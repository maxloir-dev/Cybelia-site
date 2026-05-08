import { useState, useEffect } from "react";
import {
	getProfil,
	updateProfil,
	updateMotDePasse,
} from "../../api/authService";
import { getMesCommandes } from "../../api/commandeService";
import type { Utilisateur, Commande } from "../../types";
import "./Profil.css";

// ============================================
// Types des vues possibles
// ============================================
type Vue = "accueil" | "commandes" | "modifier-profil" | "changer-mdp";

function Profil() {
	const [vue, setVue] = useState<Vue>("accueil");
	const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
	const [commandes, setCommandes] = useState<Commande[]>([]);
	const [chargement, setChargement] = useState(false);
	const [message, setMessage] = useState("");
	const [erreur, setErreur] = useState("");

	// États formulaire modifier profil
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [email, setEmail] = useState("");

	// États formulaire changer mot de passe
	const [ancienMdp, setAncienMdp] = useState("");
	const [nouveauMdp, setNouveauMdp] = useState("");
	const [confirmationMdp, setConfirmationMdp] = useState("");

	// Chargement du profil au démarrage
	useEffect(() => {
		const chargerProfil = async () => {
			const data = await getProfil();
			setUtilisateur(data);
			setNom(data.nom);
			setPrenom(data.prenom);
			setEmail(data.email);
		};
		chargerProfil();
	}, []);

	const allerCommandes = async () => {
		setChargement(true);
		const data = await getMesCommandes();
		setCommandes(data);
		setVue("commandes");
		setChargement(false);
	};

	const handleModifierProfil = async (e: React.FormEvent) => {
		e.preventDefault();
		setErreur("");
		setMessage("");
		try {
			await updateProfil(nom, prenom, email);
			setUtilisateur({ ...utilisateur!, nom, prenom, email });
			setMessage("Profil mis à jour avec succès !");
		} catch {
			setErreur("Erreur lors de la mise à jour du profil");
		}
	};

	const handleChangerMdp = async (e: React.FormEvent) => {
		e.preventDefault();
		setErreur("");
		setMessage("");

		if (nouveauMdp !== confirmationMdp) {
			setErreur("Les mots de passe ne correspondent pas");
			return;
		}

		try {
			await updateMotDePasse(ancienMdp, nouveauMdp);
			setMessage("Mot de passe mis à jour avec succès !");
			setAncienMdp("");
			setNouveauMdp("");
			setConfirmationMdp("");
		} catch {
			setErreur("Ancien mot de passe incorrect");
		}
	};

	if (chargement) return <div className="profil-chargement">Chargement...</div>;

	// Vue Accueil
	if (vue === "accueil") {
		return (
			<main className="profil-main">
				<div className="profil-header">
					<h1>
						{utilisateur?.prenom} {utilisateur?.nom}
					</h1>
					<p className="subtitle">{utilisateur?.email}</p>
				</div>

				<div className="profil-cards">
					{/* Carte Mes commandes */}
					<div className="profil-card" onClick={allerCommandes}>
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#fff"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
							<circle cx="9" cy="21" r="1" />
							<circle cx="20" cy="21" r="1" />
							<path d="M7 13L5.4 5" />
						</svg>
						<h2>Mes commandes</h2>
						<p>Voir mes commandes passées</p>
					</div>

					{/* Carte Mon profil */}
					<div
						className="profil-card"
						onClick={() => {
							setMessage("");
							setErreur("");
							setVue("modifier-profil");
						}}
					>
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#fff"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="8" r="4" />
							<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
						</svg>
						<h2>Mon profil</h2>
						<p>Mettre à jour mes informations</p>
					</div>

					{/* Carte Mot de passe */}
					<div
						className="profil-card"
						onClick={() => {
							setMessage("");
							setErreur("");
							setVue("changer-mdp");
						}}
					>
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#fff"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="2" y="7" width="20" height="15" rx="2" />
							<path d="M8 7V5a4 4 0 0 1 8 0v2" />
							<circle cx="12" cy="15" r="1.5" fill="#fff" />
							<line x1="12" y1="16.5" x2="12" y2="19" />
							<line x1="6" y1="11" x2="6" y2="11" />
							<line x1="18" y1="11" x2="18" y2="11" />
							<path d="M5 10h14" />
						</svg>
						<h2>Mot de passe</h2>
						<p>Changer mon mot de passe</p>
					</div>
				</div>
			</main>
		);
	}

	// Vue Commandes
	if (vue === "commandes") {
		return (
			<main className="profil-main">
				<button className="profil-retour" onClick={() => setVue("accueil")}>
					← Retour
				</button>
				<h1>Mes commandes</h1>
				<div className="profil-liste">
					{commandes.length === 0 && (
						<p>Vous n'avez pas encore passé de commande.</p>
					)}
					{commandes.map((commande) => (
						<div key={commande.id} className="profil-item">
							<div className="profil-item__info">
								<span className="profil-item__titre">
									Commande #{commande.id}
								</span>
								<span className="profil-item__detail">
									{new Date(commande.created_at).toLocaleDateString("fr-FR")}
								</span>
								{commande.lignes?.map((ligne, i) => (
									<span key={i} className="profil-item__detail">
										{ligne.quantite}x {ligne.produit_nom} —{" "}
										{ligne.prix_unitaire}€
									</span>
								))}
							</div>
							<span className="profil-item__prix">
								{commande.montant_total}€
							</span>
						</div>
					))}
				</div>
			</main>
		);
	}

	// Vue Modifier profil
	if (vue === "modifier-profil") {
		return (
			<main className="profil-main">
				<button className="profil-retour" onClick={() => setVue("accueil")}>
					← Retour
				</button>
				<h1>Modifier mon profil</h1>

				{message && <p className="profil-message">{message}</p>}
				{erreur && <p className="profil-erreur">{erreur}</p>}

				<form className="profil-form" onSubmit={handleModifierProfil}>
					<div className="profil-form__row">
						<div className="profil-form__field">
							<label>Nom</label>
							<input
								type="text"
								value={nom}
								onChange={(e) => setNom(e.target.value)}
								required
							/>
						</div>
						<div className="profil-form__field">
							<label>Prénom</label>
							<input
								type="text"
								value={prenom}
								onChange={(e) => setPrenom(e.target.value)}
								required
							/>
						</div>
					</div>
					<div className="profil-form__field">
						<label>Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="profil-btn">
						Enregistrer
					</button>
				</form>
			</main>
		);
	}

	// Vue Changer mot de passe
	if (vue === "changer-mdp") {
		return (
			<main className="profil-main">
				<button className="profil-retour" onClick={() => setVue("accueil")}>
					← Retour
				</button>
				<h1>Changer mon mot de passe</h1>

				{message && <p className="profil-message">{message}</p>}
				{erreur && <p className="profil-erreur">{erreur}</p>}

				<form className="profil-form" onSubmit={handleChangerMdp}>
					<div className="profil-form__field">
						<label>Ancien mot de passe</label>
						<input
							type="password"
							value={ancienMdp}
							onChange={(e) => setAncienMdp(e.target.value)}
							placeholder="••••••••"
							required
						/>
					</div>
					<div className="profil-form__field">
						<label>Nouveau mot de passe</label>
						<input
							type="password"
							value={nouveauMdp}
							onChange={(e) => setNouveauMdp(e.target.value)}
							placeholder="••••••••"
							required
						/>
					</div>
					<div className="profil-form__field">
						<label>Confirmer le nouveau mot de passe</label>
						<input
							type="password"
							value={confirmationMdp}
							onChange={(e) => setConfirmationMdp(e.target.value)}
							placeholder="••••••••"
							required
						/>
					</div>
					<button type="submit" className="profil-btn">
						Changer le mot de passe
					</button>
				</form>
			</main>
		);
	}

	return null;
}

export default Profil;
