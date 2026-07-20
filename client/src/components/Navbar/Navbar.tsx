import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import cybeliaLogo from "../../assets/logo_cybele_complet.svg";
import { useAuth } from "../../store/AuthContext";
import { useCart } from "../../store/CartContext";
import { UserGreeting } from "../UserGreeting";

function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [visible, setVisible] = useState(true);
	const [prevScrollPos, setPrevScrollPos] = useState(0);

	const { estConnecte, estAdmin, deconnexion, utilisateur } = useAuth();
	const { nombreArticles } = useCart();
	const location = useLocation();

	const fermerMenu = () => {
		setMenuOpen(false);
	};

	useEffect(() => {
		if (location.pathname) {
			setMenuOpen(false);
		}
	}, [location.pathname]);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollPos = window.scrollY;
			if (menuOpen) return;
			const isVisible =
				prevScrollPos > currentScrollPos || currentScrollPos < 10;
			setVisible(isVisible);
			setPrevScrollPos(currentScrollPos);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [prevScrollPos, menuOpen]);

	return (
		<>
			{/* Bouton Burger indépendant */}
			<button
				type="button"
				className={`navbar-burger-trigger ${menuOpen ? "is-active" : ""} ${!visible ? "is-floating" : ""}`}
				onClick={() => setMenuOpen(!menuOpen)}
				aria-label="Menu de navigation"
			>
				<span></span>
				<span></span>
				<span></span>
			</button>

			{/* Arrière-plan qui s'assombrit (Overlay) */}
			<button
				type="button"
				className={`navbar-overlay ${menuOpen ? "is-visible" : ""}`}
				onClick={fermerMenu}
				aria-label="Fermer le menu"
			/>

			<nav className={`navbar ${!visible ? "navbar--masquee" : ""}`}>
				{/* GAUCHE : Vide sur la barre principale (le menu burger est géré en fixed) */}
				<div className="navbar-left-side">
					{/* Le menu déroulant mobile / latéral */}
					<div className={`navbar-mobile-menu ${menuOpen ? "is-open" : ""}`}>
						{/* DEPLACÉ ICI : Les salutations s'affichent tout en haut du menu burger */}
						<div className="navbar-menu-greeting">
							<UserGreeting
								prenom={utilisateur?.prenom}
								nom={utilisateur?.nom}
							/>
						</div>

						<ul className="navbar-links">
							<li>
								<Link to="/">Accueil</Link>
							</li>
							<li>
								<Link to="/shop">Shop</Link>
							</li>
							<li>
								<Link to="/personnalise" className="navbar-link--highlight">
									Personnalisé
								</Link>
							</li>
							<li>
								<Link to="/contact">Contact</Link>
							</li>
							<li>
								<Link to="/about">À propos</Link>
							</li>
							{estAdmin && (
								<li>
									<Link to="/admin" className="navbar-admin-link">
										Admin
									</Link>
								</li>
							)}
						</ul>
					</div>
				</div>

				{/* CENTRE : Le Logo */}
				<div className="navbar-center-side">
					<Link to="/" className="navbar-logo-link">
						<img src={cybeliaLogo} alt="Cybelia" className="navbar-logo-img" />
					</Link>
				</div>

				{/* DROITE : Les Icônes */}
				<div className="navbar-right-side">
					<Link
						to={estConnecte ? "/profil" : "/login"}
						className="navbar-icon"
						aria-label="Compte"
					>
						<svg
							aria-hidden="true"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
					</Link>

					{estConnecte && (
						<button
							type="button"
							className="navbar-icon"
							aria-label="Déconnexion"
							onClick={deconnexion}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								aria-hidden="true"
							>
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
							</svg>
						</button>
					)}

					<Link
						to="/panier"
						className="navbar-icon navbar-icon--panier"
						aria-label="Panier"
					>
						<svg
							aria-hidden="true"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<path d="M16 10a4 4 0 0 1-8 0" />
						</svg>
						{nombreArticles > 0 && (
							<span className="navbar-panier-badge">{nombreArticles}</span>
						)}
					</Link>
				</div>
			</nav>
		</>
	);
}

export default Navbar;
