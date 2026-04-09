import { Link } from "react-router-dom";
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
					<Link to="/shop" className="hero-btn hero-btn--primary">
						Découvrir la collection
					</Link>
					<Link to="/about" className="hero-btn hero-btn--secondary">
						En savoir plus
					</Link>
				</div>
			</div>
		</section>
	);
}

export default Hero;
