import { useCart } from "../../store/CartContext";
import ActionButton from "../ActionButton/ActionButton";
import "./MiniPanier.css";

function MiniPanier() {
	const {
		miniPanierOuvert,
		fermerMiniPanier,
		dernierProduitAjoute,
		nombreArticles,
		total,
		items,
	} = useCart();

	if (!miniPanierOuvert || !dernierProduitAjoute) return null;

	return (
		<>
			{/* Overlay */}
			<button
				className="mini-panier-overlay"
				onClick={fermerMiniPanier}
				aria-label="Fermer le menu"
				type="button"
			/>
			{/* Drawer */}
			<div
				className={`mini-panier ${miniPanierOuvert ? "mini-panier--ouvert" : ""}`}
			>
				<div className="mini-panier__header">
					<h2>Produit ajouté</h2>
					{/* Correction 2 : Ajout de type="button" sur la croix de fermeture */}
					<button
						type="button"
						className="mini-panier__fermer"
						onClick={fermerMiniPanier}
					>
						✕
					</button>
				</div>

				{/* Dernier produit ajouté */}
				<div className="mini-panier__produit mini-panier__produit--nouveau">
					<img
						src={dernierProduitAjoute.image_url}
						alt={dernierProduitAjoute.nom}
						className="mini-panier__image"
					/>
					<div className="mini-panier__info">
						<p className="mini-panier__nom">{dernierProduitAjoute.nom}</p>
						<p className="mini-panier__prix">
							{dernierProduitAjoute.prix.toFixed(2)} €
						</p>
						<span className="mini-panier__badge">Ajouté</span>
					</div>
				</div>

				{/* Autres articles si il y en a */}
				{items.length > 1 && (
					<div className="mini-panier__autres">
						<p className="mini-panier__autres-titre">Aussi dans votre panier</p>
						<div className="mini-panier__liste">
							{items
								.filter((item) => item.id !== dernierProduitAjoute.id)
								.map((item) => (
									<div key={item.id} className="mini-panier__produit">
										<img
											src={item.image_url}
											alt={item.nom}
											className="mini-panier__image mini-panier__image--small"
										/>
										<div className="mini-panier__info">
											<p className="mini-panier__nom">{item.nom}</p>
											<p className="mini-panier__prix">
												{item.prix.toFixed(2)} €
											</p>
											<p className="mini-panier__quantite">
												Quantité : {item.quantite}
											</p>
										</div>
									</div>
								))}
						</div>
					</div>
				)}

				{/* Récap */}
				<div className="mini-panier__recap">
					<span>
						{nombreArticles} article{nombreArticles > 1 ? "s" : ""}
					</span>
					<span className="mini-panier__total">{total.toFixed(2)} €</span>
				</div>

				{/* Boutons */}
				<div className="mini-panier__actions">
					<ActionButton to="/panier" onClick={fermerMiniPanier}>
						Commander maintenant
					</ActionButton>
					<ActionButton onClick={fermerMiniPanier} inverse={true}>
						Continuer mes achats
					</ActionButton>
				</div>
			</div>
		</>
	);
}

export default MiniPanier;
