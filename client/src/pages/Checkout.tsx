import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../store/CartContext";
import api from "../api/axios";
import CheckoutForm from "../components/Checkout/CheckoutForm";
import type { LivraisonData } from "../types";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


const livraisonVide: LivraisonData = {
	prenom: "",
	nom: "",
	email: "",
	telephone: "",
	adresse: "",
	code_postal: "",
	ville: "",
	pays: "France",
};

function Checkout() {
	const { items, total } = useCart();
	const [etape, setEtape] = useState<1 | 2>(1);
	const [livraison, setLivraison] = useState<LivraisonData>(livraisonVide);
	const [erreurs, setErreurs] = useState<Partial<Record<keyof LivraisonData, string>>>({});
	const [clientSecret, setClientSecret] = useState("");
	const [erreurPaiement, setErreurPaiement] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		// items.length > 0 : évite un appel parasite quand le panier est vidé
		// après un paiement réussi (l'effet se re-déclenche alors avec un panier vide).
		if (etape === 2 && items.length > 0) {
			// On envoie les lignes du panier (pas le montant) : le serveur
			// recalcule lui-même le prix depuis la DB.
			const lignes = items.map((item) => ({
				produit_id: item.id,
				quantite: item.quantite,
				dimension_id: item.dimension_id ?? null,
			}));
			// La livraison est envoyée dès maintenant : elle est stockée dans la
			// metadata du PaymentIntent pour que le webhook puisse créer la commande.
			api
				.post("/stripe/create-payment-intent", { lignes, livraison })
				.then(({ data }) => {
					setClientSecret(data.clientSecret);
					setErreurPaiement("");
				})
				.catch(() =>
					setErreurPaiement(
						"Impossible d'initialiser le paiement. Réessayez dans un instant.",
					),
				);
		}
	}, [etape, items, livraison]);

	const valider = () => {
		const e: Partial<Record<keyof LivraisonData, string>> = {};
		if (!livraison.prenom.trim()) e.prenom = "Obligatoire";
		if (!livraison.nom.trim()) e.nom = "Obligatoire";
		if (!livraison.email.trim()) e.email = "Obligatoire";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(livraison.email)) e.email = "Email invalide";
		if (!livraison.adresse.trim()) e.adresse = "Obligatoire";
		if (!livraison.code_postal.trim()) e.code_postal = "Obligatoire";
		if (!livraison.ville.trim()) e.ville = "Obligatoire";
		if (!livraison.pays.trim()) e.pays = "Obligatoire";
		return e;
	};

	const handleContinuer = (e: React.FormEvent) => {
		e.preventDefault();
		const e_ = valider();
		if (Object.keys(e_).length > 0) {
			setErreurs(e_);
			return;
		}
		setErreurs({});
		setEtape(2);
	};

	const champ = (key: keyof LivraisonData, label: string, required = true, type = "text", placeholder = "") => (
		<div className="checkout-champ">
			<label className="checkout-label" htmlFor={key}>
				{label}{required && <span className="checkout-asterisk"> *</span>}
			</label>
			<input
				id={key}
				type={type}
				className={`checkout-input${erreurs[key] ? " checkout-input--erreur" : ""}`}
				value={livraison[key] ?? ""}
				placeholder={placeholder}
				onChange={(e) => setLivraison({ ...livraison, [key]: e.target.value })}
			/>
			{erreurs[key] && <span className="checkout-erreur-champ">{erreurs[key]}</span>}
		</div>
	);

	return (
	<div className="checkout-page">
            <button
                type="button"
                className="checkout-retour"
                onClick={() => navigate("/panier")}
                aria-label="Retour au panier"
            >
                <svg width="36" height="20" viewBox="0 0 36 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="34" y1="10" x2="2" y2="10" />
                    <polyline points="10 18 2 10 10 2" />
                </svg>
            </button>
            <h1 className="checkout-titre">Paiement</h1>

			<div className="checkout-layout">
				{/* Colonne gauche — récapitulatif */}
				<div className="checkout-recap">
					<h2 className="checkout-recap__titre">Récapitulatif</h2>
					<div className="checkout-recap__liste">
						{items.map((item) => (
							<div key={item.cartKey} className="checkout-recap__item">
								<span className="checkout-recap__nom">
									{item.quantite}x {item.nom}
									{item.dimension_label && ` — ${item.dimension_label}`}
								</span>
								<span>{(item.prix * item.quantite).toFixed(2)} €</span>
							</div>
						))}
					</div>
					<div className="checkout-recap__total">
						<span>Total</span>
						<span>{total.toFixed(2)} €</span>
					</div>
				</div>

				{/* Colonne droite */}
				<div className="checkout-carte">
					{/* Étape 1 — Livraison */}
					{etape === 1 && (
						<form onSubmit={handleContinuer} noValidate>
							<h2 className="checkout-section-titre">Informations de livraison</h2>

							<div className="checkout-ligne-double">
								{champ("prenom", "Prénom")}
								{champ("nom", "Nom")}
							</div>

							{champ("email", "Email", true, "email")}
							{champ("telephone", "Téléphone", false, "tel")}
							{champ("adresse", "Adresse", true, "text", "Numéro et rue")}

							<div className="checkout-ligne-double">
								{champ("code_postal", "Code postal")}
								{champ("ville", "Ville")}
							</div>

							{champ("pays", "Pays")}

							<button type="submit" className="custom-button checkout-bouton-livraison">
								<span className="button-text">Continuer vers le paiement →</span>
							</button>
						</form>
					)}

					{/* Étape 2 — Paiement Stripe */}
					{etape === 2 && (
						<div>
							<button
								type="button"
								className="checkout-retour"
								onClick={() => setEtape(1)}
							>
								← Modifier la livraison
							</button>
							<h2 className="checkout-section-titre">Paiement</h2>
							<div className="checkout-recap-livraison">
								<span>{livraison.prenom} {livraison.nom}</span>
								<span>{livraison.adresse}, {livraison.code_postal} {livraison.ville}</span>
								<span>{livraison.email}</span>
							</div>
							{erreurPaiement ? (
								<p className="checkout-erreur">{erreurPaiement}</p>
							) : !clientSecret ? (
								<p className="checkout-chargement">Chargement...</p>
							) : (
								<Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret,
                        appearance: {
                            theme: "flat",
                            variables: {
                                colorPrimary: "#965846",
                                colorBackground: "#ffffff",
                                colorText: "#111111",
                                colorDanger: "#c0392b",
                                fontFamily: "Oswald, sans-serif",
                                borderRadius: "12px",
                            },
                        },
                    }}
                >
                    <CheckoutForm />
                </Elements>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Checkout;
