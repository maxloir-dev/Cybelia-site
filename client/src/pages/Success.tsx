import { Link } from "react-router-dom";
import "./Success.css";

function Success() {
	return (
		<div className="success-page">
			<div className="success-confirmation">
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
					<title>Paiement réussi</title>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
				<h1>Paiement réussi !</h1>
				<p>Merci pour votre commande. La gérante vous contactera prochainement.</p>
				<div className="success-confirmation__actions">
					<Link to="/profil" className="success-btn-commandes">
						Voir mes commandes
					</Link>
					<Link to="/shop" className="success-btn-shop">
						Continuer les achats
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Success;
