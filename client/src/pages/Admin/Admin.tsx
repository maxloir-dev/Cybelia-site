import { useState } from "react";
import { getAllCommandes, getCommandeById } from "../../api/commandeService";
import {
	getProduits,
	getProduitsByCategorie,
	deleteProduit,
	updateProduit,
	addProduit,
} from "../../api/produitService";
import {
	getAllUtilisateurs,
	getHistoriqueClient,
} from "../../api/utilisateurService";
import type { Commande, Produit, Utilisateur } from "../../types";
import "./Admin.css";
import { uploadImage } from "../../api/uploadService";
import { image } from "framer-motion/client";

// Types des vues possibles

type Vue =
	| "accueil"
	| "commandes"
	| "clients"
	| "client-detail"
	| "produits"
	| "produit-detail"
	| "ajouter-produit";

// Page Admin

function Admin() {
	const [vue, setVue] = useState<Vue>("accueil");
	const [commandes, setCommandes] = useState<Commande[]>([]);
	const [clients, setClients] = useState<Utilisateur[]>([]);
	const [clientSelectionne, setClientSelectionne] =
		useState<Utilisateur | null>(null);
	const [historiqueClient, setHistoriqueClient] = useState<Commande[]>([]);
	const [produits, setProduits] = useState<Produit[]>([]);
	const [produitSelectionne, setProduitSelectionne] = useState<Produit | null>(
		null,
	);
	const [categorieFiltre, setCategorieFiltre] = useState<number>(1);
	const [chargement, setChargement] = useState(false);
	const [modeEdition, setModeEdition] = useState(false);
	const [produitEdite, setProduitEdite] = useState<Produit | null>(null);
	const [nouveauProduit, setNouveauProduit] = useState({
		nom: "",
		description: "",
		prix: 0,
		categorie_id: 1,
		image_url: "",
	});
	const [fichierImage, setFichierImage] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string>("");
	const [fichierImageEdit, setFichierImageEdit] = useState<File | null>(null);
	const [previewImageEdit, setPreviewImageEdit] = useState<string>("");
	const [fichierMockup, setFichierMockup] = useState<File | null>(null);
	const [previewMockup, setPreviewMockup] = useState<string>("");

	// Navigation vers les vues

	const allerCommandes = async () => {
		setChargement(true);
		const data = await getAllCommandes();
		setCommandes(data);
		setVue("commandes");
		setChargement(false);
	};

	const allerClients = async () => {
		setChargement(true);
		const data = await getAllUtilisateurs();
		setClients(data);
		setVue("clients");
		setChargement(false);
	};

	const allerDetailClient = async (client: Utilisateur) => {
		setChargement(true);
		setClientSelectionne(client);
		const data = await getHistoriqueClient(client.id);
		setHistoriqueClient(data);
		setVue("client-detail");
		setChargement(false);
	};

	const allerProduits = async (categorie: number = 1) => {
		setChargement(true);
		const data = await getProduitsByCategorie(categorie);
		setProduits(data);
		setCategorieFiltre(categorie);
		setVue("produits");
		setChargement(false);
	};

	const allerDetailProduit = (produit: Produit, editer: boolean = false) => {
		setProduitSelectionne(produit);
		setProduitEdite({ ...produit });
		setModeEdition(editer);
		setVue("produit-detail");
	};

	const supprimerProduit = async (id: number) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
		await deleteProduit(id);
		allerProduits(categorieFiltre);
	};

	const ajouterProduit = async () => {
		try {
			let image_url = "";
			let mockup_url = null;

			if (fichierImage) {
				const urls = await uploadImage(
					fichierImage,
					fichierMockup ?? undefined,
				);
				image_url = urls.image_url;
				mockup_url = urls.mockup_url;
			}

			const formData = new FormData();
			formData.append("nom", nouveauProduit.nom);
			formData.append("description", nouveauProduit.description);
			formData.append("prix", String(nouveauProduit.prix));
			formData.append("image_url", image_url);
			formData.append("mockup_url", mockup_url ?? "");
			formData.append("categorie_id", String(nouveauProduit.categorie_id));
			await addProduit(formData);

			setNouveauProduit({
				nom: "",
				description: "",
				prix: 0,
				image_url: "",
				categorie_id: 1,
			});
			setFichierImage(null);
			setPreviewImage("");
			setVue("accueil");
		} catch {
			alert("Erreur lors de l'ajout du produit");
		}
	};

	// Rendu des vues

	if (chargement) return <div className="admin-chargement">Chargement...</div>;

	// Vue Accueil
	if (vue === "accueil") {
		return (
			<main className="admin-main">
				<div className="admin-header">
					<h1>Dashboard</h1>
					<p className="subtitle">Espace de gestion Cybelia</p>
				</div>
				<div className="admin-cards">
					{/* Commandes */}
					<button type="button" className="admin-card" onClick={allerCommandes}>
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#fff"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<path d="M16 10a4 4 0 0 1-8 0" />
						</svg>
						<h2>Commandes</h2>
						<p>Voir toutes les commandes</p>
					</button>

					{/* Clients */}
					<button type="button" className="admin-card" onClick={allerClients}>
						<svg
							aria-hidden="true"
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
						<h2>Clients</h2>
						<p>Gérer les clients</p>
					</button>

					{/* Produits */}
					<button
						type="button"
						className="admin-card"
						onClick={() => allerProduits(1)}
					>
						<svg
							aria-hidden="true"
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#fff"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<line x1="3" y1="9" x2="21" y2="9" />
							<line x1="3" y1="15" x2="21" y2="15" />
							<line x1="9" y1="9" x2="9" y2="21" />
							<line x1="15" y1="9" x2="15" y2="21" />
						</svg>
						<h2>Produits</h2>
						<p>Gérer les produits</p>
					</button>

					{/* Ajouter */}
					<button
						type="button"
						className="admin-card"
						onClick={() => setVue("ajouter-produit")}
					>
						<svg
							aria-hidden="true"
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#fff"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
							<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
						</svg>
						<h2>Ajouter</h2>
						<p>Nouveau produit</p>
					</button>
				</div>
			</main>
		);
	}

	// Vue Commandes
	if (vue === "commandes") {
		return (
			<main className="admin-main">
				<button
					type="button"
					className="admin-retour"
					onClick={() => setVue("accueil")}
				>
					← Retour
				</button>
				<h1>Commandes</h1>
				<div className="admin-liste">
					{commandes.length === 0 && <p>Aucune commande pour le moment.</p>}
					{commandes.map((commande) => (
						<div key={commande.id} className="admin-item">
							<div className="admin-item__info">
								<span className="admin-item__titre">
									Commande #{commande.id}
								</span>
								<span className="admin-item__detail">
									{commande.nom} {commande.prenom}
								</span>
								<span className="admin-item__detail">{commande.email}</span>
								<span className="admin-item__detail">
									{new Date(commande.created_at).toLocaleDateString("fr-FR")}
								</span>
							</div>
							<span className="admin-item__prix">
								{commande.montant_total}€
							</span>
						</div>
					))}
				</div>
			</main>
		);
	}

	// Vue Clients
	if (vue === "clients") {
		return (
			<main className="admin-main">
				<button
					type="button"
					className="admin-retour"
					onClick={() => setVue("accueil")}
				>
					← Retour
				</button>
				<h1>Clients</h1>
				<div className="admin-liste">
					{clients.length === 0 && <p>Aucun client pour le moment.</p>}
					{clients.map((client) => (
						<button
							type="button"
							key={client.id}
							className="admin-item admin-item--cliquable"
							onClick={() => allerDetailClient(client)}
						>
							<div className="admin-item__info">
								<span className="admin-item__titre">
									{client.nom} {client.prenom}
								</span>

								<span className="admin-item__detail">{client.email}</span>

								<span className="admin-item__detail">
									Inscrit le{" "}
									{new Date(client.created_at).toLocaleDateString("fr-FR")}
								</span>
							</div>

							<span className="admin-item__fleche">→</span>
						</button>
					))}
				</div>
			</main>
		);
	}

	// Vue Détail Client
	if (vue === "client-detail" && clientSelectionne) {
		return (
			<main className="admin-main">
				<button
					type="button"
					className="admin-retour"
					onClick={() => setVue("clients")}
				>
					← Retour
				</button>
				<h1>
					{clientSelectionne.nom} {clientSelectionne.prenom}
				</h1>

				<div className="admin-profil">
					<h2>Profil</h2>
					<div className="admin-profil__info">
						<p>
							<span>Email</span> {clientSelectionne.email}
						</p>
						<p>
							<span>Inscrit le</span>{" "}
							{new Date(clientSelectionne.created_at).toLocaleDateString(
								"fr-FR",
							)}
						</p>
					</div>
				</div>

				<div className="admin-historique">
					<h2>Historique des commandes</h2>
					{historiqueClient.length === 0 && (
						<p>Aucune commande pour ce client.</p>
					)}
					{historiqueClient.map((commande) => (
						<div key={commande.id} className="admin-item">
							<div className="admin-item__info">
								<span className="admin-item__titre">
									Commande #{commande.id}
								</span>
								<span className="admin-item__detail">
									{new Date(commande.created_at).toLocaleDateString("fr-FR")}
								</span>
								{commande.lignes?.map((ligne, i) => (
									<span key={i} className="admin-item__detail">
										{ligne.quantite}x {ligne.produit_nom} —{" "}
										{ligne.prix_unitaire}€
									</span>
								))}
							</div>
							<span className="admin-item__prix">
								{commande.montant_total}€
							</span>
						</div>
					))}
				</div>
			</main>
		);
	}

	// Vue Produits
	if (vue === "produits") {
		return (
			<main className="admin-main">
				<button
					type="button"
					className="admin-retour"
					onClick={() => setVue("accueil")}
				>
					← Retour
				</button>
				<h1>Produits</h1>

				<div className="admin-filtres">
					<button
						type="button"
						className={`admin-filtre ${
							categorieFiltre === 1 ? "admin-filtre--actif" : ""
						}`}
						onClick={() => allerProduits(1)}
					>
						Cartes postales
					</button>

					<button
						type="button"
						className={`admin-filtre ${
							categorieFiltre === 2 ? "admin-filtre--actif" : ""
						}`}
						onClick={() => allerProduits(2)}
					>
						Affiches
					</button>
				</div>

				<div className="admin-liste">
					{produits.length === 0 && <p>Aucun produit dans cette catégorie.</p>}
					{produits.map((produit) => (
						<div key={produit.id} className="admin-item">
							<button
								type="button"
								className="admin-item__info admin-item--cliquable"
								onClick={() => allerDetailProduit(produit)}
							>
								<span className="admin-item__titre">{produit.nom}</span>
								<span className="admin-item__detail">{produit.categorie}</span>
								<span className="admin-item__prix">{produit.prix}€</span>
							</button>
							<div className="admin-item__actions">
								<button
									type="button"
									className="admin-btn admin-btn--modifier"
									onClick={(e) => {
										e.stopPropagation();
										allerDetailProduit(produit, true);
									}}
								>
									Modifier
								</button>

								<button
									type="button"
									className="admin-btn admin-btn--supprimer"
									onClick={() => supprimerProduit(produit.id)}
								>
									Supprimer
								</button>
							</div>
						</div>
					))}
				</div>
			</main>
		);
	}

	// Vue Détail Produit

	if (vue === "produit-detail" && produitSelectionne && produitEdite) {
		return (
			<main className="admin-main">
				<button
					type="button"
					className="admin-retour"
					onClick={() => setVue("produits")}
				>
					← Retour
				</button>
				<div className="admin-produit-detail">
					{produitSelectionne.image_url && (
						<img
							src={produitSelectionne.image_url}
							alt={produitSelectionne.nom}
							className="admin-produit-detail__image"
						/>
					)}
					<div className="admin-produit-detail__info">
						{/* Nom */}
						{modeEdition ? (
							<input
								className="admin-edit-input admin-edit-titre"
								value={produitEdite.nom}
								onChange={(e) =>
									setProduitEdite({ ...produitEdite, nom: e.target.value })
								}
							/>
						) : (
							<h1>{produitSelectionne.nom}</h1>
						)}

						{/* Catégorie */}
						{modeEdition ? (
							<select
								className="admin-edit-input"
								value={produitEdite.categorie}
								onChange={(e) =>
									setProduitEdite({
										...produitEdite,
										categorie: e.target.value,
									})
								}
							>
								<option value="Carte postale">Carte postale</option>
								<option value="Affiche">Affiche</option>
							</select>
						) : (
							<p className="subtitle">{produitSelectionne.categorie}</p>
						)}

						{/* Description */}
						{modeEdition ? (
							<textarea
								className="admin-edit-input admin-edit-textarea"
								value={produitEdite.description}
								onChange={(e) =>
									setProduitEdite({
										...produitEdite,
										description: e.target.value,
									})
								}
							/>
						) : (
							<p className="admin-produit-detail__description">
								{produitSelectionne.description}
							</p>
						)}

						{/* Prix */}
						{modeEdition ? (
							<div className="admin-edit-prix-wrapper">
								<input
									className="admin-edit-input admin-edit-prix"
									type="number"
									step="0.01"
									value={produitEdite.prix}
									onChange={(e) =>
										setProduitEdite({
											...produitEdite,
											prix: Number(e.target.value),
										})
									}
								/>
								<span className="admin-edit-euro">€</span>
							</div>
						) : (
							<p className="admin-produit-detail__prix">
								{produitSelectionne.prix}€
							</p>
						)}

						<p className="admin-produit-detail__date">
							Ajouté le{" "}
							{new Date(produitSelectionne.created_at).toLocaleDateString(
								"fr-FR",
							)}
						</p>

						{/* Image */}
						<div className="admin-form__field">
							<label
								htmlFor="edit-image-produit"
								style={{
									fontSize: "0.85rem",
									letterSpacing: "1px",
									textTransform: "uppercase",
									color: "var(--color-secondary)",
								}}
							>
								Changer l'image
							</label>
							<input
								type="file"
								accept="image/jpeg, image/png, image/webp"
								className="admin-edit-input"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										setFichierImageEdit(file);
										setPreviewImageEdit(URL.createObjectURL(file));
									}
								}}
							/>
							{previewImageEdit && (
								<img
									src={previewImageEdit}
									alt="Prévisualisation"
									className="admin-form__preview"
								/>
							)}
						</div>

						{/* Boutons */}
						{modeEdition ? (
							<div className="admin-item__actions">
								<button
									type="button"
									className="admin-btn admin-btn--modifier"
									onClick={async () => {
										let image_url = produitEdite.image_url;

										// Si une nouvelle image a été sélectionnée on l'upload
										if (fichierImageEdit) {
											const urls = await uploadImage(fichierImageEdit);
											image_url = urls.image_url; // On récupère image_url depuis l'objet retourné
										}

										const categorie_id =
											produitEdite.categorie === "Carte postale" ? 1 : 2;
										const formData = new FormData();
										formData.append("nom", produitEdite.nom);
										formData.append("description", produitEdite.description);
										formData.append("prix", String(produitEdite.prix));
										formData.append("image_url", image_url);
										formData.append("categorie_id", String(categorie_id));
										await updateProduit(produitSelectionne.id, formData);
										setProduitSelectionne({ ...produitEdite, image_url });
										setFichierImageEdit(null);
										setPreviewImageEdit("");
										setModeEdition(false);
									}}
								>
									Enregistrer
								</button>
								<button
									type="button"
									className="admin-btn admin-btn--supprimer"
									onClick={() => {
										setProduitEdite({ ...produitSelectionne });
										setModeEdition(false);
									}}
								>
									Annuler
								</button>
							</div>
						) : (
							<div className="admin-item__actions">
								<button
									type="button"
									className="admin-btn admin-btn--modifier"
									onClick={() => {
										setProduitEdite({ ...produitSelectionne });
										setModeEdition(true);
									}}
								>
									Modifier
								</button>
								<button
									type="button"
									className="admin-btn admin-btn--supprimer"
									onClick={() => supprimerProduit(produitSelectionne.id)}
								>
									Supprimer
								</button>
							</div>
						)}
					</div>
				</div>
			</main>
		);
	}

	// Vue Ajouter un produit
	if (vue === "ajouter-produit") {
		return (
			<main className="admin-main">
				<button
					type="button"
					className="admin-retour"
					onClick={() => setVue("accueil")}
				>
					← Retour
				</button>
				<h1>Nouveau produit</h1>
				<div className="admin-form">
					<div className="admin-form__field">
						<label htmlFor="nom-produit">Nom du produit</label>

						<input
							id="nom-produit"
							type="text"
							className="admin-edit-input"
							placeholder="ex: Carte Montagne"
							value={nouveauProduit.nom}
							onChange={(e) =>
								setNouveauProduit({ ...nouveauProduit, nom: e.target.value })
							}
						/>
					</div>

					<div className="admin-form__field">
						<label htmlFor="description-produit">Description</label>
						<textarea
							id="description-produit"
							className="admin-edit-input admin-edit-textarea"
							placeholder="Décrivez le produit..."
							value={nouveauProduit.description}
							onChange={(e) =>
								setNouveauProduit({
									...nouveauProduit,
									description: e.target.value,
								})
							}
						/>
					</div>

					<div className="admin-form__row">
						<div className="admin-form__field">
							<label htmlFor="prix-produit">Prix (€)</label>

							<input
								id="prix-produit"
								type="number"
								step="0.01"
								className="admin-edit-input"
								placeholder="0.00"
								value={nouveauProduit.prix}
								onChange={(e) =>
									setNouveauProduit({
										...nouveauProduit,
										prix: Number(e.target.value),
									})
								}
							/>
						</div>

						<div className="admin-form__field">
							<label htmlFor="categorie-produit">Catégorie</label>
							<select
								id="categorie-produit"
								className="admin-edit-input"
								value={nouveauProduit.categorie_id}
								onChange={(e) =>
									setNouveauProduit({
										...nouveauProduit,
										categorie_id: Number(e.target.value),
									})
								}
							>
								<option value={1}>Carte postale</option>
								<option value={2}>Affiche</option>
							</select>
						</div>
					</div>

					<div className="admin-form__field">
						<label htmlFor="image-produit">Image du produit</label>
						<input
							id="image-produit"
							type="file"
							accept="image/jpeg, image/png, image/webp"
							className="admin-edit-input"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setFichierImage(file);
									setPreviewImage(URL.createObjectURL(file));
								}
							}}
						/>
						{previewImage && (
							<img
								src={previewImage}
								alt="Prévisualisation"
								className="admin-form__preview"
							/>
						)}
					</div>
					<div className="admin-form__field">
						<label htmlFor="mockup-produit">Image mockup (optionnel)</label>
						<input
							id="mockup-produit"
							type="file"
							accept="image/jpeg, image/png, image/webp"
							className="admin-edit-input"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									setFichierMockup(file);
									setPreviewMockup(URL.createObjectURL(file));
								}
							}}
						/>
						{previewMockup && (
							<img
								src={previewMockup}
								alt="Prévisualisation mockup"
								className="admin-form__preview"
							/>
						)}
					</div>

					<div className="admin-form__actions">
						<button
							type="button"
							className="admin-btn admin-btn--modifier"
							onClick={ajouterProduit}
						>
							Ajouter le produit
						</button>
						<button
							type="button"
							className="admin-btn admin-btn--supprimer"
							onClick={() => setVue("accueil")}
						>
							Annuler
						</button>
					</div>
				</div>
			</main>
		);
	}
	return null;
}

export default Admin;
