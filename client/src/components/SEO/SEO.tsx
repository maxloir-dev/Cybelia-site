import { Helmet } from "react-helmet-async";

interface SEOProps {
	titre?: string;
	description?: string;
	image?: string;
	url?: string;
	noindex?: boolean;
}

function SEO({
	titre = "Cybelia — Créations artisanales",
	description = "Découvrez les créations uniques de Cybelia — cartes postales et affiches artistiques faites à la main pour sublimer vos intérieurs.",
	image = "/og-image.jpg",
	url = "https://cybelearchitecture.com",
	noindex = false,
}: SEOProps) {
	const titreComplet =
		titre === "Cybelia — Créations artisanales" ? titre : `${titre} | Cybelia`;

	return (
		<Helmet>
			<title>{titreComplet}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={url} />
			<meta property="og:title" content={titreComplet} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta property="og:url" content={url} />
			<meta property="og:type" content="website" />
			<meta property="og:locale" content="fr_FR" />
			<meta property="og:site_name" content="Cybelia" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={titreComplet} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />
			<meta
				name="robots"
				content={noindex ? "noindex, nofollow" : "index, follow"}
			/>
			<meta name="language" content="fr" />
		</Helmet>
	);
}

export default SEO;
