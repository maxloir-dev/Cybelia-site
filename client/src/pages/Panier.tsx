import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../store/CartContext";
import "./Panier.css";

function Panier() {
	const { items, total, supprimerDuPanier, modifierQuantite, viderPanier } = useCart();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
			<h1 className="panier-titre">Mon panier</h1>

			<div className="panier-liste">
				{items.map((item) => (
					<div key={item.id} className="panier-item">
						<img src={item.image_url} alt={item.nom} className="panier-item-img" />
						<div className="panier-item-info">
							<p className="panier-item-nom">{item.nom}</p>
							<p className="panier-item-prix">{item.prix.toFixed(2)} € / unité</p>
							<div className="panier-quantite">
								<button onClick={() => modifierQuantite(item.id, item.quantite - 1)}>−</button>
								<span>{item.quantite}</span>
								<button onClick={() => modifierQuantite(item.id, item.quantite + 1)}>+</button>
							</div>
						</div>
						<div className="panier-item-droite">
							<span className="panier-item-sous-total">
								{(item.prix * item.quantite).toFixed(2)} €
							</span>
							<button className="panier-item-supprimer" onClick={() => supprimerDuPanier(item.id)}>
								Supprimer
							</button>
						</div>
					</div>
				))}
			</div>

			<div className="panier-recap">
				<p className="panier-total">Total : {total.toFixed(2)} €</p>
				<div className="panier-actions">
					<button className="panier-btn-vider" onClick={viderPanier}>Vider le panier</button>
					<Link to="/shop" className="panier-btn-shop">Continuer les achats</Link>
					<button className="panier-btn-commander">Passer commande</button>
				</div>
			</div>
		</div>
	);
}

export default Panier;
