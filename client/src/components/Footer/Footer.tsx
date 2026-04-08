import { Link } from "react-router-dom";
import "./Footer.css";
import instagramIcon from "../../assets/instagram.svg";
import pinterestIcon from "../../assets/pinterest.svg";
import cybeliaLogoBlanc from "../../assets/CybeliaLogoBlanc.svg";

function Footer() {
	return (
		<footer className="footer">
			<div className="footer-top">
				<div className="footer-brand">
					<span className="signature">Cybelia</span>
					<p className="footer-tagline">Architecte d'intérieur</p>
					<img
						src={cybeliaLogoBlanc}
						alt="Cybelia"
						className="footer-logo-img"
					/>
				</div>

				<div className="footer-links">
					<h3 className="footer-title">Navigation</h3>
					<ul>
						<li>
							<Link to="/">Accueil</Link>
						</li>
						<li>
							<Link to="/about">À propos</Link>
						</li>
						<li>
							<Link to="/shop">Shop</Link>
						</li>
						<li>
							<Link to="/personnalise">Personnalisé</Link>
						</li>
						<li>
							<Link to="/contact">Contact</Link>
						</li>
					</ul>
				</div>

				<div className="footer-links">
					<h3 className="footer-title">Légal</h3>
					<ul>
						<li>
							<Link to="/mentions-legales">Mentions légales</Link>
						</li>
						<li>
							<Link to="/confidentialite">Confidentialité</Link>
						</li>
						<li>
							<Link to="/cgv">CGV</Link>
						</li>
					</ul>
				</div>

				<div className="footer-contact">
					<h3 className="footer-title">Contact</h3>
					<p>contact@cybelia.fr</p>
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
			</div>

			<div className="footer-bottom">
				<p>© {new Date().getFullYear()} Cybelia — Tous droits réservés</p>
			</div>
		</footer>
	);
}

export default Footer;
