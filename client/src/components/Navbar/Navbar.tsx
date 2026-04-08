import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import cybeliaLogo from "../../assets/CybeliaLogoCouleur.svg";

function Navbar() {
	const [searchOpen, setSearchOpen] = useState(false);
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
				<Link to="/login" className="navbar-icon" aria-label="Compte">
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
