import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import { passerCommande } from "../api/commandeService";
import ActionButton from "../components/ActionButton/ActionButton";
import "./Panier.css";

function Panier() {
	const { items, total, supprimerDuPanier, modifierQuantite, viderPanier } =
		useCart();
	const { estConnecte } = useAuth();
	const navigate = useNavigate();
	const [chargement, setChargement] = useState(false);
	const [confirmation, setConfirmation] = useState(false);
	const [erreur, setErreur] = useState("");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleCommander = async () => {
		// Si pas connecté → rediriger vers login
		if (!estConnecte) {
			navigate("/login");
			return;
		}

		setChargement(true);
		setErreur("");

		try {
			const lignes = items.map((item) => ({
				produit_id: item.id,
				quantite: item.quantite,
				prix_unitaire: item.prix,
			}));

			await passerCommande(lignes);
			viderPanier();
			setConfirmation(true);
		} catch {
			setErreur(
				"Une erreur est survenue lors de la commande. Veuillez réessayer.",
			);
		} finally {
			setChargement(false);
		}
	};

	// Page de confirmation après commande
	if (confirmation) {
		return (
			<div className="panier-page">
				<div className="panier-confirmation">
					<svg
						width="64"
						height="64"
						viewBox="0 0 24 24"
						fill="none"
						stroke="var(--color-text)"
						strokeWidth="1.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
					<h1>Commande confirmée !</h1>
					<p>
						Merci pour votre commande. La gérante vous contactera prochainement.
					</p>
					<div className="panier-confirmation__actions">
						<Link to="/profil" className="panier-btn-commander">
							Voir mes commandes
						</Link>
						<Link to="/shop" className="panier-btn-shop">
							Continuer les achats
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="panier-page">
				<h1 className="panier-titre">Mon panier</h1>
				<div className="panier-vide">
					<p>Votre panier est vide.</p>
					<Link to="/shop">Continuer les achats</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="panier-page">
			<h1 className="panier-titre">
				Mon panier <span className="panier-count">({items.length})</span>
			</h1>

			<div className="panier-layout">
				{/* Colonne gauche — articles */}
				<div className="panier-gauche">
					<div className="panier-liste">
						{items.map((item) => (
							<div key={item.id} className="panier-item">
								<img
									src={item.image_url}
									alt={item.nom}
									className="panier-item-img"
								/>
								<div className="panier-item-info">
									<p className="panier-item-nom">{item.nom}</p>
									<p className="panier-item-prix">
										{item.prix.toFixed(2)} € / unité
									</p>
									<div className="panier-quantite">
										<button
											onClick={() =>
												modifierQuantite(item.id, item.quantite - 1)
											}
										>
											−
										</button>
										<span>{item.quantite}</span>
										<button
											onClick={() =>
												modifierQuantite(item.id, item.quantite + 1)
											}
										>
											+
										</button>
									</div>
									<button
										className="panier-item-supprimer"
										onClick={() => supprimerDuPanier(item.id)}
									>
										Supprimer
									</button>
								</div>
								<span className="panier-item-sous-total">
									{(item.prix * item.quantite).toFixed(2)} €
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Colonne droite — récap */}
				<div className="panier-droite">
					<div className="panier-recap">
						<h2 className="panier-recap__titre">Récapitulatif</h2>

						<div className="panier-recap__ligne">
							<span>Sous-total</span>
							<span>{total.toFixed(2)} €</span>
						</div>
						<div className="panier-recap__ligne">
							<span>Livraison</span>
							<span>À définir</span>
						</div>
						<div className="panier-recap__ligne panier-recap__ligne--total">
							<span>Total</span>
							<span>{total.toFixed(2)} €</span>
						</div>

						{erreur && <p className="panier-erreur">{erreur}</p>}

						<div className="panier-actions">
							<ActionButton onClick={handleCommander} disabled={chargement}>
								{chargement
									? "Commande en cours..."
									: estConnecte
										? "Passer commande"
										: "Se connecter pour commander"}
							</ActionButton>
							<ActionButton to="/shop" inverse={true} onClick={() => {}}>
								Continuer mes achats
							</ActionButton>
							<button className="panier-btn-vider" onClick={viderPanier}>
								Vider le panier
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Panier;
