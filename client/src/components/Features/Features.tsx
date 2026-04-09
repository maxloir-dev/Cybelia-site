import "./Features.css";

const features = [
	{
		id: 1,
		icon: "◈",
		title: "Conçu à Nantes",
		description: "Création française locale",
	},
	{
		id: 2,
		icon: "♡",
		title: "Fait main",
		description: "Fabrication artisanale",
	},
	{
		id: 3,
		icon: "⊡",
		title: "Livraison",
		description: "Offerte dès 60€",
	},
	{
		id: 4,
		icon: "◻",
		title: "Paiement sécurisé",
		description: "Transactions protégées",
	},
];

function Features() {
	return (
		<section className="features">
			{features.map((feature, index) => (
				<div key={feature.id} className="feature-item">
					<span className="feature-icon">{feature.icon}</span>
					<h3 className="feature-title">{feature.title}</h3>
					<p className="feature-description">{feature.description}</p>
					{index < features.length - 1 && <div className="feature-divider" />}
				</div>
			))}
		</section>
	);
}

export default Features;
