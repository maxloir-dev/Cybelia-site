import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Login/Login.css";

export default function ResetPassword() {
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();
	const [motDePasse, setMotDePasse] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [erreur, setErreur] = useState("");
	const [chargement, setChargement] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErreur("");

		if (motDePasse !== confirmation) {
			setErreur("Les mots de passe ne correspondent pas.");
			return;
		}
		if (motDePasse.length < 6) {
			setErreur("Le mot de passe doit contenir au moins 6 caractères.");
			return;
		}

		setChargement(true);
		try {
			const res = await fetch("http://localhost:3001/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, nouveau_mot_de_passe: motDePasse }),
			});
			if (!res.ok) {
				const data = await res.json();
				setErreur(data.message || "Lien invalide ou expiré.");
				return;
			}
			navigate("/login");
		} catch {
			setErreur("Une erreur est survenue. Veuillez réessayer.");
		} finally {
			setChargement(false);
		}
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<h1>Nouveau mot de passe</h1>
				<p className="subtitle">Choisissez un nouveau mot de passe.</p>

				{erreur && <p className="login-erreur">{erreur}</p>}

				<form className="login-form" onSubmit={handleSubmit}>
					<div className="login-field">
						<label htmlFor="motDePasse">Nouveau mot de passe</label>
						<input
							id="motDePasse"
							type="password"
							value={motDePasse}
							onChange={(e) => setMotDePasse(e.target.value)}
							placeholder="••••••••"
							required
						/>
					</div>
					<div className="login-field">
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
					<button type="submit" className="login-btn" disabled={chargement}>
						{chargement ? "Enregistrement..." : "Enregistrer"}
					</button>
				</form>
			</div>
		</div>
	);
}
