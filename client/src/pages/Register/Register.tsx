import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authService";
import { useAuth } from "../../store/AuthContext";
import "./Register.css";

// ============================================
// Page d'inscription
// ============================================

function Register() {
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [email, setEmail] = useState("");
	const [motDePasse, setMotDePasse] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [erreur, setErreur] = useState("");
	const [chargement, setChargement] = useState(false);

	const { connexion } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErreur("");

		// Vérification que les mots de passe correspondent
		if (motDePasse !== confirmation) {
			setErreur("Les mots de passe ne correspondent pas");
			return;
		}

		setChargement(true);

		try {
			await register(nom, prenom, email, motDePasse);
			// Connexion automatique après inscription
			const data = await import("../../api/authService").then((s) =>
				s.login(email, motDePasse),
			);
			connexion(data.token, data.role_id, data.id);
			navigate("/");
		} catch {
			setErreur("Cet email est déjà utilisé");
		} finally {
			setChargement(false);
		}
	};

	return (
		<main>
			<div className="register-container">
				<div className="register-box">
					<h1>Inscription</h1>
					<p className="subtitle">Créez votre espace personnel</p>

					{erreur && <p className="register-erreur">{erreur}</p>}

					<form onSubmit={handleSubmit} className="register-form">
						<div className="register-row">
							<div className="register-field">
								<label htmlFor="nom">Nom</label>
								<input
									id="nom"
									type="text"
									value={nom}
									onChange={(e) => setNom(e.target.value)}
									placeholder="Dupont"
									required
								/>
							</div>
							<div className="register-field">
								<label htmlFor="prenom">Prénom</label>
								<input
									id="prenom"
									type="text"
									value={prenom}
									onChange={(e) => setPrenom(e.target.value)}
									placeholder="Marie"
									required
								/>
							</div>
						</div>

						<div className="register-field">
							<label htmlFor="email">Email</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="votre@email.com"
								required
							/>
						</div>

						<div className="register-field">
							<label htmlFor="motDePasse">Mot de passe</label>
							<input
								id="motDePasse"
								type="password"
								value={motDePasse}
								onChange={(e) => setMotDePasse(e.target.value)}
								placeholder="••••••••"
								required
							/>
						</div>

						<div className="register-field">
							<label htmlFor="confirmation">Confirmer le mot de passe</label>
							<input
								id="confirmation"
								type="password"
								value={confirmation}
								onChange={(e) => setConfirmation(e.target.value)}
								placeholder="••••••••"
								required
							/>
						</div>

						<button
							type="submit"
							className="register-btn"
							disabled={chargement}
						>
							{chargement ? "Inscription..." : "S'inscrire"}
						</button>
					</form>

					<p className="register-redirect">
						Déjà un compte ? <Link to="/login">Se connecter</Link>
					</p>
				</div>
			</div>
		</main>
	);
}

export default Register;
