import ActionButton from "../components/ActionButton/ActionButton";
import RevealCard from "../components/RevealCard";
import { cloudinaryUrl } from "../lib/cloudinary";
import "./Personnalise.css";

const realisations = [
	{ src: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071959/Commande_pro_2_gg6hxw.jpg", alt: "Commande professionnelle 2" },
	{ src: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071959/Commande_pro_1_rvjcpt.jpg", alt: "Commande professionnelle 1" },
	{ src: "https://res.cloudinary.com/dgi4qubrq/image/upload/v1782071959/Commande_particulier_cmi8cg.jpg", alt: "Commande particulier" },
];

export default function Personnalise() {
	return (
		<div className="perso-page">
			{/* Hero — déjà visible au chargement, pas d'animation */}
			<section className="perso-hero">
				<p className="perso-hero-sub">Sur mesure</p>
				<h1 className="perso-hero-titre">
					DONNEZ VIE
					<br />À VOS SOUVENIRS
				</h1>
				<p className="perso-hero-desc">
					Une illustration unique, créée à partir de vos souvenirs ou de vos
					projets.
				</p>
				<ActionButton to="/contact">Demander un devis</ActionButton>
			</section>

			<div className="perso-divider" />

			{/* Réalisations */}
			<section className="perso-realisations">
				<RevealCard direction="left">
					<div>
						<p className="perso-section-sub">Nos créations</p>
						<h2 className="perso-section-titre">Quelques réalisations</h2>
					</div>
				</RevealCard>
				<div className="perso-realisations-grid">
					{realisations.map((r, index) => (
						<RevealCard
							key={r.src}
							direction={index % 2 === 0 ? "left" : "right"}
							delay={index * 0.08}
						>
							<div className="perso-realisation-item">
								<img src={cloudinaryUrl(r.src, 500)} alt={r.alt} loading="lazy" />
							</div>
						</RevealCard>
					))}
				</div>
			</section>

			<div className="perso-divider" />

			{/* Pour qui */}
			<section className="perso-pourqui">
				<RevealCard direction="left">
					<div>
						<p className="perso-section-sub">A qui sont destinées</p>
						<h2 className="perso-section-titre">nos créations ?</h2>
					</div>
				</RevealCard>
				<div className="perso-pourqui-grid">
					<RevealCard direction="left" delay={0}>
						<div className="perso-pourqui-item">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
								<polyline points="9 22 9 12 15 12 15 22" />
							</svg>
							<span>Particuliers</span>
						</div>
					</RevealCard>
					<RevealCard direction="right" delay={0.08}>
						<div className="perso-pourqui-item">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
								<rect x="2" y="3" width="20" height="14" rx="2" />
								<path d="M8 21h8M12 17v4" />
							</svg>
							<span>Entreprises</span>
						</div>
					</RevealCard>
					<RevealCard direction="left" delay={0.16}>
						<div className="perso-pourqui-item">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
								<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
							</svg>
							<span>Cadeaux</span>
						</div>
					</RevealCard>
					<RevealCard direction="right" delay={0.24}>
						<div className="perso-pourqui-item">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
								<path d="M12 2L2 7l10 5 10-5-10-5z" />
								<path d="M2 17l10 5 10-5" />
								<path d="M2 12l10 5 10-5" />
							</svg>
							<span>Événements</span>
						</div>
					</RevealCard>
				</div>
			</section>

			{/* Texte long */}
			<section className="perso-texte-long">
				<RevealCard direction="right">
					<div className="perso-texte-long-content">
						<p>
							Une maison de famille, un lieu de voyage ou un village qui vous est
							cher : chaque photo peut devenir une illustration personnalisée,
							créée avec soin pour raconter une histoire unique et préserver vos
							plus beaux souvenirs.
						</p>
						<p>
							Ces créations s'adressent également aux professionnels :
							collectivités, mairies, architectes, agences immobilières,
							commerces, hébergements touristiques ou entreprises souhaitant
							mettre en valeur leur patrimoine, leur activité ou l'histoire d'un
							lieu à travers une création authentique et sur mesure.
						</p>
						<p>
							Illustration originale réalisée à la main ou projet graphique
							(cartes de visite, supports de communication, visuels
							personnalisés…), chaque réalisation est pensée selon vos envies, vos
							besoins et l'identité de votre projet.
						</p>
						<p>
							Que ce soit pour décorer votre intérieur, offrir un cadeau chargé
							d'émotion ou valoriser un lieu professionnel, je serais ravie de
							donner vie à vos images, vos souvenirs et vos projets.
						</p>
						<p>
							Découvrez ci-dessous les différentes étapes de création, de l'envoi
							de votre photo jusqu'à la réalisation finale de votre projet.
						</p>
					</div>
				</RevealCard>
			</section>

			<div className="perso-divider" />

			{/* Étapes résumé */}
			<section className="perso-etapes">
				<RevealCard direction="left">
					<div>
						<p className="perso-section-sub">Le processus</p>
						<h2 className="perso-section-titre">Comment ça marche ?</h2>
					</div>
				</RevealCard>
				<div className="perso-etapes-grid">
					{[
						{ num: "01", titre: "Vous nous contactez", texte: "Décrivez votre projet, vos envies, votre univers. Un simple message suffit !" },
						{ num: "02", titre: "On crée ensemble", texte: "Nous concevons votre création sur mesure et vous soumettons un aperçu avant impression." },
						{ num: "03", titre: "Impression & livraison", texte: "Votre commande est imprimée avec soin et expédiée directement chez vous." },
					].map((etape, index) => (
						<RevealCard
							key={etape.num}
							direction={index % 2 === 0 ? "left" : "right"}
							delay={index * 0.08}
						>
							<div className="perso-etape">
								<span className="perso-etape-num">{etape.num}</span>
								<h3>{etape.titre}</h3>
								<p>{etape.texte}</p>
							</div>
						</RevealCard>
					))}
				</div>
			</section>

			{/* Étapes détaillées */}
			<section className="perso-etapes-detail">
				<RevealCard direction="left">
					<div>
						<p className="perso-section-sub">En détail</p>
						<h2 className="perso-section-titre">Les 4 étapes de votre commande</h2>
					</div>
				</RevealCard>
				<div className="perso-etapes-detail-list">
					<RevealCard direction="left" delay={0}>
						<div className="perso-etape-detail">
							<div className="perso-etape-detail-num">01</div>
							<div className="perso-etape-detail-content">
								<h3>Votre demande par mail</h3>
								<p>
									Pour démarrer votre projet, contactez-moi par e-mail en me
									partageant votre idée, vos photos et les informations
									essentielles. Ensemble, donnons vie à une création unique qui
									vous ressemble.
								</p>
							</div>
						</div>
					</RevealCard>
					<RevealCard direction="right" delay={0}>
						<div className="perso-etape-detail">
							<div className="perso-etape-detail-num">02</div>
							<div className="perso-etape-detail-content">
								<h3>Analyse de votre demande</h3>
								<p>
									Après réception de votre e-mail, je prends le temps d'étudier
									votre projet afin de comprendre vos envies et les spécificités
									de votre demande. Je vous transmets ensuite un devis
									personnalisé ainsi qu'une estimation du délai de réalisation
									avant le lancement de la création.
								</p>
							</div>
						</div>
					</RevealCard>
					<RevealCard direction="left" delay={0}>
						<div className="perso-etape-detail">
							<div className="perso-etape-detail-num">03</div>
							<div className="perso-etape-detail-content">
								<h3>Confirmation de votre commande</h3>
								<p>
									Si le devis vous convient, il vous suffit de le signer et de me
									le retourner. Dès réception, votre projet est officiellement
									lancé et je peux commencer à donner vie à votre création sur
									mesure.
								</p>
							</div>
						</div>
					</RevealCard>
					<RevealCard direction="right" delay={0}>
						<div className="perso-etape-detail">
							<div className="perso-etape-detail-num">04</div>
							<div className="perso-etape-detail-content">
								<h3>De l'atelier à votre intérieur</h3>
								<p>
									Après la réalisation de votre projet, votre illustration est
									imprimée avec soin puis préparée pour l'expédition. Quelques
									temps plus tard, votre création rejoint votre intérieur ou celui
									de la personne à qui vous souhaitez l'offrir.
								</p>
							</div>
						</div>
					</RevealCard>
				</div>
			</section>

			{/* CTA final */}
			<section className="perso-cta">
				<RevealCard direction="right">
					<div>
						<h2>Prêt à créer quelque chose d'unique ?</h2>
						<ActionButton to="/contact">Nous contacter</ActionButton>
					</div>
				</RevealCard>
			</section>
		</div>
	);
}
