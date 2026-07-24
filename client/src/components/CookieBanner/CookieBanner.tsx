import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CookieBanner.css";

const CLE_STOCKAGE = "cybelia_cookie_consent";
const DUREE_VALIDITE_JOURS = 395; // ~13 mois, conforme à la recommandation CNIL

type Consentement = {
	choix: "accepte" | "refuse";
	date: string;
};

function consentementValide(): boolean {
	const brut = localStorage.getItem(CLE_STOCKAGE);
	if (!brut) return false;

	try {
		const consentement: Consentement = JSON.parse(brut);
		const dateChoix = new Date(consentement.date).getTime();
		const ageEnJours = (Date.now() - dateChoix) / (1000 * 60 * 60 * 24);
		return ageEnJours < DUREE_VALIDITE_JOURS;
	} catch {
		return false;
	}
}

export default function CookieBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!consentementValide()) {
			setVisible(true);
		}
	}, []);

	const enregistrerChoix = (choix: Consentement["choix"]) => {
		const consentement: Consentement = { choix, date: new Date().toISOString() };
		localStorage.setItem(CLE_STOCKAGE, JSON.stringify(consentement));
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div className="cookie-overlay">
			<div className="cookie-banner" role="dialog" aria-label="Gestion des cookies">
				<p className="cookie-texte">
					Ce site utilise des cookies nécessaires à son fonctionnement.
					Aucun cookie de mesure d'audience ou publicitaire n'est déposé sans
					votre consentement. Consultez notre{" "}
					<Link to="/confidentialite">Politique de confidentialité</Link>{" "}
					pour en savoir plus.
				</p>
				<div className="cookie-actions">
					<button
						type="button"
						className="cookie-btn cookie-btn-refuser"
						onClick={() => enregistrerChoix("refuse")}
					>
						Refuser
					</button>
					<button
						type="button"
						className="cookie-btn cookie-btn-accepter"
						onClick={() => enregistrerChoix("accepte")}
					>
						Accepter
					</button>
				</div>
			</div>
		</div>
	);
}
