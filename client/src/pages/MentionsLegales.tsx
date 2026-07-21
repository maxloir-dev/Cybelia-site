import "./Legal.css";

export default function MentionsLegales() {
	return (
		<div className="legal-page">
			<div className="legal-header">
				<h1 className="legal-titre">Mentions légales</h1>
				<p className="legal-soustitre">Dernière mise à jour : 21 juillet 2026</p>
			</div>

			<div className="legal-contenu">
				<section>
					<h2>Éditeur du site</h2>
					<p>
						<strong>Charrier Cybélia</strong>
						<br />
						Entrepreneur individuel
						<br />
						Architecte d'intérieur et illustratrice
						<br />
						Adresse : 1 bis boulevard des Belges, 44300 Nantes – France
						<br />
						E-mail :{" "}
						<a href="mailto:cybele.architecture@gmail.com">
							cybele.architecture@gmail.com
						</a>
						<br />
						Téléphone : 06 38 72 86 72
						<br />
						SIREN : 990 036 659
						<br />
						SIRET : 990 036 659 00011
						<br />
						Code APE : 74.10Z – Activités spécialisées de design
					</p>
					<p>
						Le vendeur bénéficie du régime de la franchise en base de TVA
						conformément à l'article 293 B du Code général des impôts.
						<br />
						<strong>TVA non applicable – article 293 B du CGI.</strong>
					</p>
					<p>Directeur de la publication : Charrier Cybélia.</p>
				</section>

				<section>
					<h2>Hébergement</h2>
					<p>
						<strong>Hébergement du site internet :</strong>
						<br />
						Netlify, Inc.
						<br />
						101 2nd Street, San Francisco, CA 94105-2239, États-Unis
						<br />
						<a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
							www.netlify.com
						</a>
					</p>
					<p>
						<strong>
							Hébergement de l'application et des données (serveur, base de
							données) :
						</strong>
						<br />
						Railway Corporation
						<br />
						<a href="https://railway.com" target="_blank" rel="noopener noreferrer">
							railway.com
						</a>
					</p>
				</section>

				<section>
					<h2>Propriété intellectuelle</h2>
					<p>
						L'ensemble des contenus présents sur ce site (textes, illustrations,
						photographies, logos, graphismes) est protégé par le Code de la
						propriété intellectuelle et demeure la propriété exclusive de
						Charrier Cybélia, sauf mention contraire.
					</p>
					<p>
						Pour plus de détails, voir les{" "}
						<a href="/cgu">Conditions Générales d'Utilisation</a>.
					</p>
				</section>

				<section>
					<h2>Autres documents juridiques</h2>
					<p>
						<a href="/cgu">Conditions Générales d'Utilisation (CGU)</a>
						<br />
						<a href="/cgv">Conditions Générales de Vente (CGV)</a>
						<br />
						<a href="/confidentialite">Politique de confidentialité (RGPD)</a>
					</p>
				</section>
			</div>
		</div>
	);
}
