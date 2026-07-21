import type { Request, Response } from "express";
import stripe from "../config/stripe";

// Types dérivés du SDK (évite la dépendance au chemin interne des types Stripe)
type StripeEvent = ReturnType<typeof stripe.webhooks.constructEvent>;
type StripePaymentIntent = Awaited<ReturnType<typeof stripe.paymentIntents.create>>;
import type { AuthRequest } from "../middlewares/authMiddleware";
import { calculerPanier, type LignePanier } from "../services/panierService";
import {
	createCommande,
	createLignesCommande,
	getCommandeByPaymentIntentId,
	type LivraisonData,
} from "../models/commandeModel";
import { envoyerEmailConfirmationCommande } from "../config/email";

// ============================================
// Création du PaymentIntent
// Le client connecté envoie ses lignes de panier (PAS le montant) et son
// adresse de livraison. On recalcule le montant depuis la DB, et on stocke
// dans la metadata du PaymentIntent tout ce qu'il faut pour reconstruire la
// commande côté serveur quand le paiement réussira (via le webhook).
// ============================================
export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
	const { lignes, livraison } = req.body as {
		lignes: LignePanier[];
		livraison: LivraisonData;
	};
	const utilisateur_id = req.utilisateur!.id;

	if (!livraison || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(livraison.email)) {
		res.status(400).json({ error: "Email de livraison invalide" });
		return;
	}

	try {
		// Le montant est recalculé depuis la DB — jamais celui fourni par le client.
		const { montant_total } = await calculerPanier(lignes);

		// Stripe attend un entier en centimes.
		const amount = Math.round(montant_total * 100);
		if (amount <= 0) {
			res.status(400).json({ error: "Montant invalide" });
			return;
		}

		// Lignes compactées pour tenir dans la metadata (limite 500 caractères/valeur) :
		// [[produit_id, quantite, dimension_id|0], ...]
		const lignesCompactes = JSON.stringify(
			lignes.map((l) => [l.produit_id, l.quantite, l.dimension_id ?? 0]),
		);

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: "eur",
			payment_method_types: ["card"],
			metadata: {
				utilisateur_id: String(utilisateur_id),
				lignes: lignesCompactes,
				// Adresse de livraison éclatée par champ (chaque valeur reste courte)
				prenom: livraison.prenom,
				nom: livraison.nom,
				email: livraison.email,
				telephone: livraison.telephone ?? "",
				adresse: livraison.adresse,
				code_postal: livraison.code_postal,
				ville: livraison.ville,
				pays: livraison.pays,
			},
		});

		res.json({ clientSecret: paymentIntent.client_secret });
	} catch (err: any) {
		console.error("[create-payment-intent] échec :", err);
		res.status(400).json({ error: err.message });
	}
};

// ============================================
// Webhook Stripe
// C'EST ICI que la commande est réellement créée, sur l'événement
// payment_intent.succeeded vérifié par signature. Le client ne fait plus foi.
// La requête arrive en body BRUT (voir le montage dans index.ts).
// ============================================
export const handleWebhook = async (req: Request, res: Response) => {
	const signature = req.headers["stripe-signature"];
	const secret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!secret) {
		console.error("[webhook] STRIPE_WEBHOOK_SECRET manquante");
		res.status(500).send("Webhook non configuré");
		return;
	}

	let event: StripeEvent;
	try {
		// req.body est un Buffer (express.raw) — requis pour vérifier la signature
		event = stripe.webhooks.constructEvent(req.body, signature as string, secret);
	} catch (err: any) {
		console.error("[webhook] signature invalide :", err.message);
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	// On répond 200 vite ; le traitement long est encadré pour ne jamais throw.
	if (event.type === "payment_intent.succeeded") {
		const pi = event.data.object as StripePaymentIntent;
		try {
			await creerCommandeDepuisPaymentIntent(pi);
		} catch (err) {
			console.error("[webhook] échec création commande :", err);
			// On renvoie 500 pour que Stripe réessaie (idempotence assurée en DB)
			res.status(500).send("Erreur de traitement");
			return;
		}
	}

	res.json({ received: true });
};

// Reconstruit et enregistre la commande à partir de la metadata du PaymentIntent
async function creerCommandeDepuisPaymentIntent(pi: StripePaymentIntent) {
	// Idempotence : si la commande existe déjà pour ce PaymentIntent, on ne refait rien
	const existante = await getCommandeByPaymentIntentId(pi.id);
	if (existante) {
		console.log(`[webhook] commande déjà créée pour ${pi.id} (ignoré)`);
		return;
	}

	const m = pi.metadata;
	const utilisateur_id = Number(m.utilisateur_id);
	const lignesBrutes: number[][] = JSON.parse(m.lignes ?? "[]");
	const lignes: LignePanier[] = lignesBrutes.map(([produit_id, quantite, dim]) => ({
		produit_id,
		quantite,
		dimension_id: dim || null,
	}));

	const livraison: LivraisonData = {
		prenom: m.prenom,
		nom: m.nom,
		email: m.email,
		telephone: m.telephone || undefined,
		adresse: m.adresse,
		code_postal: m.code_postal,
		ville: m.ville,
		pays: m.pays,
	};

	// Prix recalculés depuis la DB (ne jamais faire confiance à des montants stockés)
	const { lignesVerifiees, montant_total } = await calculerPanier(lignes);

	const commande_id = await createCommande(
		utilisateur_id,
		montant_total,
		livraison,
		pi.id,
	);
	await createLignesCommande(commande_id, lignesVerifiees);

	envoyerEmailConfirmationCommande(
		livraison.email,
		livraison.prenom,
		commande_id,
		lignesVerifiees,
		montant_total,
	).catch((err) => console.error("[EMAIL] Échec envoi confirmation:", err));

	console.log(`[webhook] commande ${commande_id} créée pour ${pi.id}`);
}
