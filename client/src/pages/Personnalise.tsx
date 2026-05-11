import ActionButton from "../components/ActionButton/ActionButton";
import "./Personnalise.css";

export default function Personnalise() {
	return (
		<div className="perso-page">

			{/* Hero */}
			<section className="perso-hero">
				<p className="perso-hero-sub">Sur mesure</p>
				<h1 className="perso-hero-titre">
					Une création unique,<br />rien que pour vous.
				</h1>
				<p className="perso-hero-desc">
					Affiche personnalisée, carte postale sur-mesure, impression à votre image —
					chaque projet est pensé à la main pour refléter votre univers.
				</p>
				<ActionButton to="/contact">Demander un devis</ActionButton>
			</section>

			{/* Séparateur */}
			<div className="perso-divider" />

			{/* Étapes */}
			<section className="perso-etapes">
				<p className="perso-section-sub">Le processus</p>
				<h2 className="perso-section-titre">Comment ça marche ?</h2>
				<div className="perso-etapes-grid">
					<div className="perso-etape">
						<span className="perso-etape-num">01</span>
						<h3>Vous nous contactez</h3>
						<p>Décrivez votre projet, vos envies, votre univers. Un simple message suffit.</p>
					</div>
					<div className="perso-etape">
						<span className="perso-etape-num">02</span>
						<h3>On crée ensemble</h3>
						<p>Nous concevons votre création sur mesure et vous soumettons un aperçu avant impression.</p>
					</div>
					<div className="perso-etape">
						<span className="perso-etape-num">03</span>
						<h3>Impression & livraison</h3>
						<p>Votre commande est imprimée avec soin et expédiée directement chez vous.</p>
					</div>
				</div>
			</section>

			{/* Pour qui */}
			<section className="perso-pourqui">
				<p className="perso-section-sub">Nos créations s'adressent à</p>
				<h2 className="perso-section-titre">Pour qui ?</h2>
				<div className="perso-pourqui-grid">
					<div className="perso-pourqui-item">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
						<span>Particuliers</span>
					</div>
					<div className="perso-pourqui-item">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
						<span>Entreprises</span>
					</div>
					<div className="perso-pourqui-item">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
						<span>Cadeaux</span>
					</div>
					<div className="perso-pourqui-item">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
						<span>Événements</span>
					</div>
				</div>
			</section>

			{/* CTA final */}
			<section className="perso-cta">
				<h2>Prêt à créer quelque chose d'unique ?</h2>
				<ActionButton to="/contact">Nous contacter</ActionButton>
			</section>

		</div>
	);
}
