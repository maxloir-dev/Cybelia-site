import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import cybeliaLogo from "../../assets/CybeliaLogoCouleur.svg";
import { useAuth } from "../../store/AuthContext";

function Navbar() {
	const [searchOpen, setSearchOpen] = useState(false);
	const { estConnecte, estAdmin, deconnexion } = useAuth();

	return (
		<nav className="navbar">
			<div className="navbar-logo">
				<Link to="/">
					<img src={cybeliaLogo} alt="Cybelia" className="navbar-logo-img" />
				</Link>
			</div>
			<ul className="navbar-links">
				<li>
					<Link to="/">Accueil</Link>
				</li>
				<li className="navbar-dropdown-wrapper">
					<span className="navbar-dropdown-trigger">
						Shop
						<svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
							<path d="M1 1l4 4 4-4" />
						</svg>
					</span>
					<ul className="navbar-dropdown">
						<li><Link to="/shop/affiches">Affiches</Link></li>
						<li><Link to="/shop/cartes">Cartes postales</Link></li>
					</ul>
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
				{/* Lien admin visible uniquement par la gérante */}
				{estAdmin && (
					<li>
						<Link to="/admin">Admin</Link>
					</li>
				)}
			</ul>
			<div className="navbar-icons">
				<button
					className="navbar-icon"
					aria-label="Recherche"
					onClick={() => setSearchOpen(!searchOpen)}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="M21 21l-4.35-4.35" />
					</svg>
				</button>

				{/* Si connecté → profil, sinon → login */}
				<Link
					to={estConnecte ? "/profil" : "/login"}
					className="navbar-icon"
					aria-label="Compte"
				>
					<svg
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

				{/* Bouton déconnexion si connecté */}
				{estConnecte && (
					<button
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
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" y1="12" x2="9" y2="12" />
						</svg>
					</button>
				)}

				<Link to="/panier" className="navbar-icon" aria-label="Panier">
					<svg
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
				</Link>
			</div>
			{searchOpen && (
				<div className="navbar-search">
					<input
						type="text"
						placeholder="Rechercher..."
						className="navbar-search-input"
						autoFocus
					/>
					<button
						className="navbar-search-close"
						onClick={() => setSearchOpen(false)}
					>
						✕
					</button>
				</div>
			)}
		</nav>
	);
}

export default Navbar;
