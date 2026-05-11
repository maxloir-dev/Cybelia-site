import { useState } from "react";
import { Link } from "react-router-dom";
import "../Login/Login.css";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [envoye, setEnvoye] = useState(false);
	const [erreur, setErreur] = useState("");
	const [chargement, setChargement] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErreur("");
		setChargement(true);

		try {
			const res = await fetch("http://localhost:3001/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			if (!res.ok) throw new Error();
			setEnvoye(true);
		} catch {
			setErreur("Une erreur est survenue. Veuillez réessayer.");
		} finally {
			setChargement(false);
		}
	};

	if (envoye) {
		return (
			<div className="login-container">
				<div className="login-box">
					<h1>Email envoyé</h1>
					<p className="subtitle">
						Si cet email est associé à un compte, vous recevrez un lien de réinitialisation dans quelques minutes.
					</p>
					<p className="login-redirect">
						<Link to="/login">Retour à la connexion</Link>
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="login-container">
			<div className="login-box">
				<h1>Mot de passe oublié</h1>
				<p className="subtitle">
					Entrez votre email pour recevoir un lien de réinitialisation.
				</p>

				{erreur && <p className="login-erreur">{erreur}</p>}

				<form className="login-form" onSubmit={handleSubmit}>
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
					<button type="submit" className="login-btn" disabled={chargement}>
						{chargement ? "Envoi..." : "Envoyer le lien"}
					</button>
				</form>

				<p className="login-redirect">
					<Link to="/login">Retour à la connexion</Link>
				</p>
			</div>
		</div>
	);
}
