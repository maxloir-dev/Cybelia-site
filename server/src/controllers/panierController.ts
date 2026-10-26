import type { Request, Response } from "express";
import { calculerPanier, type LignePanier } from "../services/panierService";

// ============================================
// Estimation du panier (sous-total, frais de livraison, total)
// Sert uniquement à l'affichage : le client envoie ses lignes, le serveur
// renvoie les montants recalculés depuis la DB. Le montant réellement
// payé est recalculé une seconde fois à la création du PaymentIntent.
// ============================================
export const estimerPanier = async (req: Request, res: Response) => {
	const { lignes } = req.body as { lignes: LignePanier[] };

	try {
		const { sous_total, frais_livraison, montant_total } =
			await calculerPanier(lignes);
		res.json({ sous_total, frais_livraison, montant_total });
	} catch (err) {
		res.status(400).json({
			error: err instanceof Error ? err.message : "Panier invalide",
		});
	}
};
