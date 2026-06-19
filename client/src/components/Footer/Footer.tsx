import { Link } from "react-router-dom";
import "./Footer.css";
import instagramIcon from "../../assets/instagram.svg";
import pinterestIcon from "../../assets/pinterest.svg";
import cybeliaLogoBlanc from "../../assets/CybeliaLogoBlanc.svg";

function Footer() {
	return (
		<footer className="footer">
			<div className="footer-top">
				{/* Logo + Marque centrés */}
				<div className="footer-brand">
					<img src={cybeliaLogoBlanc} alt="" className="footer-logo-img" />
					<span className="signature">Cybelia</span>
					<p className="footer-tagline">— Architecte d'intérieur</p>
				</div>

				{/* Tous les liens sur une seule ligne horizontale */}
				<nav className="footer-nav">
					<Link to="/">Accueil</Link>
					<Link to="/about">À propos</Link>
					<Link to="/shop">Shop</Link>
					<Link to="/personnalise">Personnalisé</Link>
					<Link to="/contact">Contact</Link>
					<Link to="/mentions-legales">Mentions légales</Link>
					<Link to="/confidentialite">Confidentialité</Link>
					<Link to="/cgv">CGV</Link>
				</nav>
			</div>

			{/* Section basse : Alignement Gauche (Copyright) et Droite (Socials) */}
			<div className="footer-bottom">
				<p className="footer-copyright">
					© {new Date().getFullYear()} Cybelia — Tous droits réservés
				</p>

				<div className="footer-socials">
					<a
						href="#"
						aria-label="Instagram"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src={instagramIcon}
							alt="Instagram"
							className="footer-social-icon"
						/>
					</a>
					<a
						href="#"
						aria-label="Pinterest"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src={pinterestIcon}
							alt="Pinterest"
							className="footer-social-icon"
						/>
					</a>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
