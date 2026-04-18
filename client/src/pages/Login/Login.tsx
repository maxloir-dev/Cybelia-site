import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/authService";
import { useAuth } from "../../store/AuthContext";
import "./Login.css";

// Page de connexion

function Login() {
	const [email, setEmail] = useState("");
	const [motDePasse, setMotDePasse] = useState("");
	const [erreur, setErreur] = useState("");
	const [chargement, setChargement] = useState(false);

	const { connexion } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErreur("");
		setChargement(true);

		try {
			const data = await login(email, motDePasse);
			// On stocke le token et les infos dans le contexte
			connexion(data.token, data.role_id, data.id);
			// Redirige vers l'accueil après connexion
			navigate("/");
		} catch {
			setErreur("Email ou mot de passe incorrect");
		} finally {
			setChargement(false);
		}
	};

	return (
		<main>
			<div className="login-container">
				<div className="login-box">
					<h1>Connexion</h1>
					<p className="subtitle">Accédez à votre espace personnel</p>

					{erreur && <p className="login-erreur">{erreur}</p>}

					<form onSubmit={handleSubmit} className="login-form">
						<div className="login-field">
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

						<div className="login-field">
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

						<button type="submit" className="login-btn" disabled={chargement}>
							{chargement ? "Connexion..." : "Se connecter"}
						</button>
					</form>

					<p className="login-redirect">
						Pas encore de compte ? <Link to="/register">S'inscrire</Link>
					</p>
				</div>
			</div>
		</main>
	);
}

export default Login;
