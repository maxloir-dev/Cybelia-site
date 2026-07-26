import ActionButton from "../components/ActionButton/ActionButton";
import "./NotFound.css";

export default function NotFound() {
	return (
		<div className="notfound-page">
			<p className="notfound-code">404</p>
			<h1 className="notfound-titre">Cette page n'existe pas</h1>
			<p className="notfound-texte">
				La page que vous cherchez a peut-être été déplacée, ou son adresse
				comporte une erreur.
			</p>
			<div className="notfound-actions">
				<ActionButton to="/">Retour à l'accueil</ActionButton>
				<ActionButton to="/shop">Voir la boutique</ActionButton>
			</div>
		</div>
	);
}
