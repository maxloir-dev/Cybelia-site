import ActionButton from "../ActionButton/ActionButton";
import "./Hero.css";

function Hero() {
	return (
		<section className="hero">
			<div className="hero-content">
				<h1 className="hero-title">
					Des illustrations
					<br />
					qui font voyager votre intérieur
				</h1>
				<p className="hero-subtitle">
					Des créations uniques, conçues à la main pour sublimer vos intérieurs
					avec élégance et authenticité.
				</p>
				<div className="hero-buttons">
					<ActionButton to="/shop">Découvrir la collection</ActionButton>
					<ActionButton to="/about" className="hero-btn--secondary-style">
						En savoir plus
					</ActionButton>
				</div>
			</div>
		</section>
	);
}

export default Hero;
