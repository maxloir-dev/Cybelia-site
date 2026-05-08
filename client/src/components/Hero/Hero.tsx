import { Link } from "react-router-dom";
import ActionButton from "../ActionButton/ActionButton";
import "./Hero.css";

function Hero() {
	return (
		<section className="hero">
			<div className="hero-content">
				<span className="hero-tag">Nouvelle collection</span>
				<h1 className="hero-title">
					L'art de
					<br />
					votre espace
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
