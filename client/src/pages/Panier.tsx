import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import ActionButton from "../components/ActionButton/ActionButton";
import { cloudinaryUrl } from "../lib/cloudinary";
import "./Panier.css";

function Panier() {
	const { items, total, supprimerDuPanier, modifierQuantite, viderPanier } =
		useCart();
	const { estConnecte } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleCommander = () => {
		if (!estConnecte) {
			navigate("/login");
			return;
		}

		navigate("/checkout");
	};

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
							<div key={item.cartKey} className="panier-item">
								<img
									src={cloudinaryUrl(item.image_url, 200)}
									alt={item.nom}
									className="panier-item-img"
									loading="lazy"
								/>
								<div className="panier-item-info">
									<p className="panier-item-nom">{item.nom}</p>
									{item.dimension_label && (
										<p className="panier-item-dimension">{item.dimension_label}</p>
									)}
									<p className="panier-item-prix">
										{item.prix.toFixed(2)} € / unité
									</p>
									<div className="panier-quantite">
										<button
											type="button"
											onClick={() =>
												modifierQuantite(item.cartKey, item.quantite - 1)
											}
										>
											−
										</button>
										<span>{item.quantite}</span>
										<button
											type="button"
											onClick={() =>
												modifierQuantite(item.cartKey, item.quantite + 1)
											}
										>
											+
										</button>
									</div>
									<button
										type="button"
										className="panier-item-supprimer"
										onClick={() => supprimerDuPanier(item.cartKey)}
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

						<div className="panier-actions">
							<ActionButton onClick={handleCommander}>
								{estConnecte ? "Passer commande" : "Se connecter pour commander"}
							</ActionButton>
							<ActionButton to="/shop" onClick={() => {}}>
								Continuer mes achats
							</ActionButton>
							<button
								type="button"
								className="panier-btn-vider"
								onClick={viderPanier}
							>
								Vider le panier
							</button>
						</div>
					</div>

					<div className="panier-reassurance">
						<div className="reassurance-item">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Icône paiement sécurisé</title>
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
								<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
							</svg>
							<div className="reassurance-texte">
								<span className="reassurance-titre">Paiement sécurisé</span>
								<span className="reassurance-desc">
									Par carte bancaire via Stripe
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Panier;
