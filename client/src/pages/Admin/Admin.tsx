import { useState, useEffect } from "react";
import ActionButton from "../../components/ActionButton/ActionButton";
import { useLocation } from "react-router-dom";
import { getAllCommandes, deleteCommande } from "../../api/commandeService";
import {
	getProduitsByCategorie,
	getProduitById,
	deleteProduit,
	updateProduit,
	addProduit,
} from "../../api/produitService";
import {
	getAllUtilisateurs,
	getHistoriqueClient,
	deleteUtilisateur,
} from "../../api/utilisateurService";
import {
	getAllDimensions,
	getDimensionsByProduit,
	upsertDimensionProduit,
	deleteDimensionProduit,
} from "../../api/dimensionService";
import type { Commande, Produit, Utilisateur, Dimension } from "../../types";
import "./Admin.css";
import { uploadImage } from "../../api/uploadService";
import { GooeyInput } from "../../components/ui/GooeyInput";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { cloudinaryUrl } from "../../lib/cloudinary";

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
	const location = useLocation();
	const [vue, setVue] = useState<Vue>("accueil");
	const containerRef = useScrollReveal(vue);
	const [locationKeyVue, setLocationKeyVue] = useState(location.key);
	if (location.key !== locationKeyVue) {
		setLocationKeyVue(location.key);
		setVue("accueil");
	}
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
	const [rechercheCommandes, setRechercheCommandes] = useState("");
	const [tousLesDimensions, setTousLesDimensions] = useState<Dimension[]>([]);
	const [dimensionsProduit, setDimensionsProduit] = useState<Dimension[]>([]);
	const [nouveauPrix, setNouveauPrix] = useState<Record<number, string>>({});
	const [dimensionsPrixAjout, setDimensionsPrixAjout] = useState<
		Record<number, string>
	>({});
	const [commandeSelectionnee, setCommandeSelectionnee] =
		useState<Commande | null>(null);
	const [fichierMockupEdit, setFichierMockupEdit] = useState<File | null>(null);
	const [previewMockupEdit, setPreviewMockupEdit] = useState<string>("");
	const [commandeEnSuppression, setCommandeEnSuppression] = useState<
		number | null
	>(null);
	const [rechercheProduits, setRechercheProduits] = useState<string>("");
	const [rechercheClients, setRechercheClients] = useState<string>("");

	useEffect(() => {
		getAllDimensions()
			.then(setTousLesDimensions)
			.catch(() => {});
	}, []);

	// Navigation vers les vues
	const allerCommandes = async () => {
		setChargement(true);
		try {
			const data = await getAllCommandes();
			setCommandes(data);
			setVue("commandes");
		} catch (error) {
			console.error("Erreur chargement commandes :", error);
			alert("Impossible de charger les commandes. Réessayez plus tard.");
		} finally {
			setChargement(false);
		}
	};

	const allerClients = async () => {
		setChargement(true);
		try {
			const data = await getAllUtilisateurs();
			setClients(data);
			setVue("clients");
		} catch (error) {
			console.error("Erreur chargement clients :", error);
			alert("Impossible de charger les clients. Réessayez plus tard.");
		} finally {
			setChargement(false);
		}
	};

	const allerDetailClient = async (client: Utilisateur) => {
		setChargement(true);
		setCommandeEnSuppression(null);
		setCommandeSelectionnee(null);
		setClientSelectionne(client);
		try {
			const data = await getHistoriqueClient(client.id);
			setHistoriqueClient(data);
			setVue("client-detail");
		} catch (error) {
			console.error("Erreur chargement historique client :", error);
			alert("Impossible de charger l'historique de ce client. Réessayez plus tard.");
		} finally {
			setChargement(false);
		}
	};

	const supprimerClient = async (id: number) => {
		if (
			!confirm(
				"Êtes-vous sûr de vouloir supprimer ce client et toutes ses commandes ?",
			)
		)
			return;
		try {
			await deleteUtilisateur(id);
			setVue("clients");
			const data = await getAllUtilisateurs();
			setClients(data);
		} catch {
			alert("Erreur lors de la suppression du client");
		}
	};

	const allerProduits = async (categorie: number = 1) => {
		setChargement(true);
		try {
			const data = await getProduitsByCategorie(categorie);
			setProduits(data);
			setCategorieFiltre(categorie);
			setVue("produits");
		} catch (error) {
			console.error("Erreur chargement produits :", error);
			alert("Impossible de charger les produits. Réessayez plus tard.");
		} finally {
			setChargement(false);
		}
	};

	const allerDetailProduit = async (
		produit: Produit,
		editer: boolean = false,
	) => {
		setProduitSelectionne(produit);
		setProduitEdite({ ...produit });
		setModeEdition(editer);
		setVue("produit-detail");
		const [toutes, actives] = await Promise.all([
			getAllDimensions(),
			getDimensionsByProduit(produit.id),
		]);
		setTousLesDimensions(toutes);
		setDimensionsProduit(actives);
		const prixInit: Record<number, string> = {};
		for (const d of actives) prixInit[d.id] = String(d.prix);
		setNouveauPrix(prixInit);
	};

	const supprimerProduit = async (id: number) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
		await deleteProduit(id);
		allerProduits(categorieFiltre);
	};

	const handleSupprimerCommande = async (commandeId: number) => {
		if (
			!window.confirm(
				`Êtes-vous sûr de vouloir supprimer la commande #${commandeId} ?`,
			)
		)
			return;
		try {
			setCommandeSelectionnee(null);
			setCommandeEnSuppression(commandeId);
			await deleteCommande(commandeId);
			setTimeout(() => {
				// Met à jour les deux listes
				setHistoriqueClient((prev) => prev.filter((c) => c.id !== commandeId));
				setCommandes((prev) => prev.filter((c) => c.id !== commandeId));
				setCommandeEnSuppression(null);
			}, 800);
		} catch {
			alert("Erreur lors de la suppression de la commande sur le serveur");
			setCommandeEnSuppression(null);
		}
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

			const dimensionBaseId = nouveauProduit.categorie_id === 1 ? 1 : 3;
			const prixFinal = Number(dimensionsPrixAjout[dimensionBaseId] ?? 0);

			const formData = new FormData();
			formData.append("nom", nouveauProduit.nom);
			formData.append("description", nouveauProduit.description);
			formData.append("prix", String(prixFinal));
			formData.append("image_url", image_url);
			formData.append("mockup_url", mockup_url ?? "");
			formData.append("categorie_id", String(nouveauProduit.categorie_id));
			const result = await addProduit(formData);

			const dimensionsARenseigner = Object.entries(dimensionsPrixAjout).filter(
				([, prix]) =>
					prix.trim() !== "" && !isNaN(Number(prix)) && Number(prix) >= 0,
			);
			await Promise.all(
				dimensionsARenseigner.map(([dimId, prix]) =>
					upsertDimensionProduit(result.id, Number(dimId), Number(prix)),
				),
			);

			setNouveauProduit({
				nom: "",
				description: "",
				prix: 0,
				image_url: "",
				categorie_id: 1,
			});
			setFichierImage(null);
			setPreviewImage("");
			setFichierMockup(null);
			setPreviewMockup("");
			setDimensionsPrixAjout({});
			setVue("accueil");
		} catch {
			alert("Erreur lors de l'ajout du produit");
		}
	};

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
					aria-label="Retour à l'accueil"
				>
					<svg
						width="36"
						height="20"
						viewBox="0 0 36 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="34" y1="10" x2="2" y2="10" />
						<polyline points="10 18 2 10 10 2" />
					</svg>
				</button>
				<div className="admin-top">
					<h1>Commandes</h1>
					<GooeyInput
						placeholder="Rechercher..."
						value={rechercheCommandes}
						onValueChange={setRechercheCommandes}
						collapsedWidth={40}
						expandedWidth={280}
						expandedOffset={48}
					/>
				</div>

				{commandes.length === 0 && <p>Aucune commande pour le moment.</p>}

				<div className="admin-postit-grille">
					{commandes
						.filter((c) => {
							const q = rechercheCommandes.toLowerCase();
							if (!q) return true;
							return (
								String(c.id).includes(q) ||
								c.nom_livraison?.toLowerCase().includes(q) ||
								c.prenom_livraison?.toLowerCase().includes(q) ||
								c.email_livraison?.toLowerCase().includes(q) ||
								c.adresse?.toLowerCase().includes(q) ||
								c.ville?.toLowerCase().includes(q) ||
								new Date(c.created_at).toLocaleDateString("fr-FR").includes(q)
							);
						})
						.map((commande) => {
							const estEnSuppression = commandeEnSuppression === commande.id;
							return (
								<button
									type="button"
									key={commande.id}
									className={`admin-postit ${estEnSuppression ? "admin-postit--suppression" : ""}`}
									onClick={() => setCommandeSelectionnee(commande)}
									aria-label={`Ouvrir la commande numéro ${commande.id}`}
								>
									<span className="admin-postit__punaise" />
									<div className="admin-postit__titre">
										Commande #{commande.id}
									</div>
									<div className="admin-postit__date">
										{commande.nom_livraison} {commande.prenom_livraison}
									</div>
									{commande.email_livraison && (
										<div className="admin-postit__info">
											{commande.email_livraison}
										</div>
									)}
									{commande.telephone && (
										<div className="admin-postit__info">
											{commande.telephone}
										</div>
									)}
									{commande.adresse && (
										<div className="admin-postit__info">{commande.adresse}</div>
									)}
									{(commande.ville || commande.code_postal) && (
										<div className="admin-postit__info">
											{commande.code_postal} {commande.ville}
										</div>
									)}
									<div className="admin-postit__date">
										{new Date(commande.created_at).toLocaleDateString("fr-FR")}
									</div>
									<div className="admin-postit__prix">
										{commande.montant_total}€
									</div>
									<div className="admin-postit__cliquez">Cliquez pour voir</div>
								</button>
							);
						})}
				</div>

				{commandeSelectionnee && (
					<button
						type="button"
						className="admin-popin-overlay"
						onClick={() => setCommandeSelectionnee(null)}
						aria-label="Fermer"
					>
						<div
							className="admin-popin"
							role="document"
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								className="admin-popin__fermer"
								onClick={() => setCommandeSelectionnee(null)}
							>
								&times;
							</button>
							<h3>Commande #{commandeSelectionnee.id}</h3>
							<p className="admin-popin__date">
								{commandeSelectionnee.nom_livraison}{" "}
								{commandeSelectionnee.prenom_livraison} —{" "}
								{commandeSelectionnee.email_livraison}
							</p>
							{commandeSelectionnee.telephone && (
								<p className="admin-popin__date">
									{commandeSelectionnee.telephone}
								</p>
							)}
							{commandeSelectionnee.adresse && (
								<p className="admin-popin__date">
									{commandeSelectionnee.adresse}
								</p>
							)}
							{(commandeSelectionnee.ville ||
								commandeSelectionnee.code_postal) && (
								<p className="admin-popin__date">
									{commandeSelectionnee.code_postal}{" "}
									{commandeSelectionnee.ville}
								</p>
							)}
							<p className="admin-popin__date">
								Le{" "}
								{new Date(commandeSelectionnee.created_at).toLocaleDateString(
									"fr-FR",
								)}
							</p>
							<div className="admin-popin__lignes">
								<h4>Articles commandés</h4>
								{commandeSelectionnee.lignes?.map((ligne, index) => (
									<div
										key={`${commandeSelectionnee.id}-${index}`}
										className="admin-popin__ligne"
									>
										<span>
											{ligne.quantite}x <strong>{ligne.produit_nom}</strong>
										</span>
										<span>{ligne.prix_unitaire}€ / u</span>
									</div>
								))}
							</div>
							<div className="admin-popin__total">
								<span>Total</span>
								<strong>{commandeSelectionnee.montant_total}€</strong>
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									marginTop: "24px",
								}}
							>
								<button
									type="button"
									className="admin-pill-btn"
									style={{
										borderColor: "#d4a090",
										color: "#a0522d",
										background: "#f5e6e2",
									}}
									onClick={() =>
										handleSupprimerCommande(commandeSelectionnee.id)
									}
								>
									Supprimer la commande
								</button>
							</div>
						</div>
					</button>
				)}
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
					aria-label="Retour à l'accueil"
				>
					<svg
						width="36"
						height="20"
						viewBox="0 0 36 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="34" y1="10" x2="2" y2="10" />
						<polyline points="10 18 2 10 10 2" />
					</svg>
				</button>
				<div className="admin-top">
					<h1>Clients</h1>
					<GooeyInput
						placeholder="Rechercher un client..."
						value={rechercheClients}
						onValueChange={setRechercheClients}
						collapsedWidth={40}
						expandedWidth={280}
						expandedOffset={48}
					/>
				</div>

				<div className="admin-liste" ref={containerRef}>
					{clients.length === 0 && <p>Aucun client trouvé.</p>}
					{clients
						.filter((client) => {
							const q = rechercheClients.toLowerCase();
							if (!q) return true;
							return (
								(client.nom || "").toLowerCase().includes(q) ||
								(client.prenom || "").toLowerCase().includes(q) ||
								(client.email || "").toLowerCase().includes(q)
							);
						})
						.map((client) => (
							<div key={client.id} className="admin-item scroll-item">
								<button
									type="button"
									className="admin-item__info admin-item--cliquable"
									onClick={() => allerDetailClient(client)}
								>
									<span className="admin-item__titre">
										{client.nom} {client.prenom}
									</span>
									<span className="admin-item__detail">{client.email}</span>
								</button>
							</div>
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
					onClick={() => setVue("accueil")}
					aria-label="Retour à l'accueil"
				>
					<svg
						width="36"
						height="20"
						viewBox="0 0 36 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="34" y1="10" x2="2" y2="10" />
						<polyline points="10 18 2 10 10 2" />
					</svg>
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
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginTop: "16px",
						marginBottom: "24px",
					}}
				>
					<ActionButton
						inverse={true}
						onClick={() => supprimerClient(clientSelectionne.id)}
					>
						Supprimer le client
					</ActionButton>
				</div>
				<div className="admin-historique">
					<h2>Historique des commandes</h2>
					{historiqueClient.length === 0 && (
						<p>Aucune commande pour ce client.</p>
					)}

					<div className="admin-postit-grille">
						{historiqueClient.map((commande) => {
							const estEnSuppression = commandeEnSuppression === commande.id;
							return (
								<button
									type="button"
									key={commande.id}
									className={`admin-postit ${estEnSuppression ? "admin-postit--suppression" : ""}`}
									onClick={() => setCommandeSelectionnee(commande)}
									aria-label={`Ouvrir la commande numéro ${commande.id}`}
								>
									<span className="admin-postit__punaise"></span>
									<div className="admin-postit__titre">
										Commande #{commande.id}
									</div>
									{commande.email_livraison && (
										<div className="admin-postit__info">
											{commande.email_livraison}
										</div>
									)}
									{commande.telephone && (
										<div className="admin-postit__info">
											{commande.telephone}
										</div>
									)}
									{commande.adresse && (
										<div className="admin-postit__info">{commande.adresse}</div>
									)}
									{(commande.ville || commande.code_postal) && (
										<div className="admin-postit__info">
											{commande.code_postal} {commande.ville}
										</div>
									)}
									<div className="admin-postit__date">
										{new Date(commande.created_at).toLocaleDateString("fr-FR")}
									</div>
									<div className="admin-postit__prix">
										{commande.montant_total}€
									</div>
									<div className="admin-postit__cliquez">Cliquez pour voir</div>
								</button>
							);
						})}
					</div>

					{commandeSelectionnee && (
						<button
							type="button"
							className="admin-popin-overlay"
							onClick={() => setCommandeSelectionnee(null)}
							aria-label="Fermer la fenêtre de détail"
						>
							<div
								className="admin-popin"
								role="document"
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => e.stopPropagation()}
							>
								<button
									type="button"
									className="admin-popin__fermer"
									onClick={() => setCommandeSelectionnee(null)}
								>
									&times;
								</button>

								<h3>Détails de la Commande #{commandeSelectionnee.id}</h3>
								<p className="admin-popin__date">
									{commandeSelectionnee.nom_livraison}{" "}
									{commandeSelectionnee.prenom_livraison}
								</p>
								{commandeSelectionnee.email_livraison && (
									<p className="admin-popin__date">
										{commandeSelectionnee.email_livraison}
									</p>
								)}
								{commandeSelectionnee.telephone && (
									<p className="admin-popin__date">
										{commandeSelectionnee.telephone}
									</p>
								)}
								{commandeSelectionnee.adresse && (
									<p className="admin-popin__date">
										{commandeSelectionnee.adresse}
									</p>
								)}
								{(commandeSelectionnee.ville ||
									commandeSelectionnee.code_postal) && (
									<p className="admin-popin__date">
										{commandeSelectionnee.code_postal}{" "}
										{commandeSelectionnee.ville}
									</p>
								)}
								<p className="admin-popin__date">
									Faite le :{" "}
									{new Date(commandeSelectionnee.created_at).toLocaleDateString(
										"fr-FR",
									)}
								</p>

								<hr />

								<div className="admin-popin__lignes">
									<h4>Articles commandés :</h4>
									{commandeSelectionnee.lignes?.map((ligne, index) => (
										<div
											key={`${commandeSelectionnee.id}-${ligne.produit_id || index}`}
											className="admin-popin__ligne"
										>
											<span>
												{ligne.quantite}x <strong>{ligne.produit_nom}</strong>
											</span>
											<span>{ligne.prix_unitaire}€ / u</span>
										</div>
									))}
								</div>

								<hr />

								<div className="admin-popin__total">
									<span>Montant Total :</span>
									<strong>{commandeSelectionnee.montant_total}€</strong>
								</div>

								<div
									style={{
										display: "flex",
										justifyContent: "center",
										marginTop: "24px",
									}}
								>
									<button
										type="button"
										className="admin-pill-btn"
										style={{
											borderColor: "#d4a090",
											color: "#a0522d",
											background: "#f5e6e2",
										}}
										onClick={() =>
											handleSupprimerCommande(commandeSelectionnee.id)
										}
									>
										Supprimer la commande
									</button>
								</div>
							</div>
						</button>
					)}
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
					aria-label="Retour à l'accueil"
				>
					<svg
						width="36"
						height="20"
						viewBox="0 0 36 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="34" y1="10" x2="2" y2="10" />
						<polyline points="10 18 2 10 10 2" />
					</svg>
				</button>
				<div className="admin-filtres-clean">
					<ActionButton
						inverse={categorieFiltre !== 1}
						onClick={() => allerProduits(1)}
					>
						Cartes postales
					</ActionButton>

					<ActionButton
						inverse={categorieFiltre !== 2}
						onClick={() => allerProduits(2)}
					>
						Affiches
					</ActionButton>
				</div>

				<div className="admin-top">
					<h1>Mes Produits</h1>
					<GooeyInput
						placeholder="Rechercher un produit..."
						value={rechercheProduits}
						onValueChange={setRechercheProduits}
						collapsedWidth={40}
						expandedWidth={280}
						expandedOffset={48}
					/>
				</div>

				<div className="admin-liste" ref={containerRef}>
					{produits.length === 0 && <p>Aucun produit dans cette catégorie.</p>}
					{produits
						.filter((produit) => {
							const q = rechercheProduits.toLowerCase();
							if (!q) return true;
							return (
								(produit.nom || "").toLowerCase().includes(q) ||
								(produit.categorie || "").toLowerCase().includes(q) ||
								String(produit.prix).includes(q)
							);
						})
						.map((produit) => (
							<div key={produit.id} className="admin-item scroll-item">
								<button
									type="button"
									className="admin-item--cliquable"
									onClick={() => allerDetailProduit(produit)}
								>
									<img
										src={cloudinaryUrl(produit.image_url, 150) || "/placeholder.jpg"}
										alt={produit.nom}
										className="admin-item__vignette"
										loading="lazy"
									/>
									<div className="admin-item__textes">
										<div className="admin-item__textes-empiles">
											<span className="admin-item__titre">{produit.nom}</span>
											<span className="admin-item__detail">
												{produit.categorie}
											</span>
										</div>
										<span className="admin-item__prix">{produit.prix}€</span>
									</div>
								</button>
								<div className="admin-item__actions">
									<ActionButton
										className="admin-action-btn"
										onClick={() => allerDetailProduit(produit, true)}
									>
										Modifier
									</ActionButton>
									<ActionButton
										className="admin-action-btn"
										inverse={true}
										onClick={() => supprimerProduit(produit.id)}
									>
										Supprimer
									</ActionButton>
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
					onClick={() => setVue("accueil")}
					aria-label="Retour à l'accueil"
				>
					<svg
						width="36"
						height="20"
						viewBox="0 0 36 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="34" y1="10" x2="2" y2="10" />
						<polyline points="10 18 2 10 10 2" />
					</svg>
				</button>
				<div className="admin-produit-detail">
					{/* BLOC DES IMAGES EMPILÉES */}
					<div className="admin-produit-detail__images-wrapper">
						{produitSelectionne.image_url && (
							<img
								src={cloudinaryUrl(produitSelectionne.image_url, 800)}
								alt={produitSelectionne.nom}
								className="admin-produit-detail__image"
								loading="lazy"
							/>
						)}
						{produitSelectionne.mockup_url && (
							<img
								src={cloudinaryUrl(produitSelectionne.mockup_url, 800)}
								alt={`${produitSelectionne.nom} - Mockup`}
								className="admin-produit-detail__image--mockup"
								loading="lazy"
							/>
						)}
					</div>

					<div className="admin-produit-detail__info">
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
						{/* ZONE DE GESTION DES IMAGES */}
						{modeEdition ? (
							<div className="admin-form__images-row">
								{/* BLOC 1 : IMAGE PRINCIPALE */}
								<div className="admin-form__field">
									<span
										style={{
											fontSize: "0.85rem",
											letterSpacing: "1px",
											textTransform: "uppercase",
											color: "var(--color-secondary)",
											display: "block",
										}}
									>
										Image Principale
									</span>
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
									{(previewImageEdit || produitSelectionne.image_url) && (
										<img
											src={
												previewImageEdit ||
												cloudinaryUrl(produitSelectionne.image_url, 400)
											}
											alt="Prévisualisation principale"
											className="admin-form__preview"
										/>
									)}
								</div>

								{/* BLOC 2 : MOCKUP */}
								<div className="admin-form__field">
									<span
										style={{
											fontSize: "0.85rem",
											letterSpacing: "1px",
											textTransform: "uppercase",
											color: "var(--color-secondary)",
											display: "block",
										}}
									>
										Seconde Image (Mockup)
									</span>
									<input
										type="file"
										accept="image/jpeg, image/png, image/webp"
										className="admin-edit-input"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												setFichierMockupEdit(file);
												setPreviewMockupEdit(URL.createObjectURL(file));
											}
										}}
									/>
									{(previewMockupEdit || produitSelectionne.mockup_url) && (
										<img
											src={
												previewMockupEdit ||
												cloudinaryUrl(produitSelectionne.mockup_url, 400)
											}
											alt="Prévisualisation mockup"
											className="admin-form__preview"
										/>
									)}
								</div>
							</div>
						) : null}{" "}
						{/*
						// 	<div className="admin-form__field">
						// 		<span
						// 			style={{
						// 				fontSize: "0.85rem",
						// 				letterSpacing: "1px",
						// 				textTransform: "uppercase",
						// 				color: "var(--color-secondary)",
						// 				display: "block",
						// 			}}
						// 		>
						// 			Images enregistrées
						// 		</span>
						// 		<div className="admin-form__images-previews">
						// 			{produitSelectionne.image_url && (
						// 				<img
						// 					src={produitSelectionne.image_url}
						// 					alt="Principal"
						// 					className="admin-form__preview-mini"
						// 				/>
						// 			)}
						// 			{produitSelectionne.mockup_url && (
						// 				<img
						// 					src={produitSelectionne.mockup_url}
						// 					alt="Mockup"
						// 					className="admin-form__preview-mini"
						// 				/>
						// 			)}
						// 		</div>
						// 	</div>
						// )} */}
						{modeEdition ? (
							<div className="admin-item__actions">
								<button
									type="button"
									className="admin-pill-btn admin-pill-btn--actif"
									onClick={async () => {
										try {
											let imagePrincipaleFinale = produitSelectionne.image_url;
											let mockupFinal = produitSelectionne.mockup_url;

											if (fichierImageEdit) {
												const reponse1 = await uploadImage(fichierImageEdit);
												if (reponse1?.image_url)
													imagePrincipaleFinale = reponse1.image_url;
											}

											if (fichierMockupEdit) {
												const reponse2 = await uploadImage(fichierMockupEdit);
												if (reponse2?.image_url)
													mockupFinal = reponse2.image_url;
											}

											await updateProduit(produitSelectionne.id, {
												nom: produitEdite.nom,
												description: produitEdite.description,
												prix: produitEdite.prix,
												image_url: imagePrincipaleFinale,
												mockup_url: mockupFinal || null,
												categorie_id:
													produitEdite.categorie === "Carte postale" ? 1 : 2,
											});

											// Recharge le produit frais depuis la base
											const produitFrais = await getProduitById(
												produitSelectionne.id,
											);
											setProduitSelectionne(produitFrais);
											setProduitEdite(produitFrais);

											// 7. On nettoie tout
											setFichierImageEdit(null);
											setFichierMockupEdit(null);
											setPreviewImageEdit("");
											setPreviewMockupEdit("");
											setModeEdition(false);
											if (categorieFiltre) {
												await allerProduits(categorieFiltre);
											}
										} catch (error) {
											console.error(error);
											alert("Erreur lors de l'enregistrement.");
										}
									}}
								>
									Enregistrer
								</button>
								<button
									type="button"
									className="admin-pill-btn"
									onClick={() => {
										setProduitEdite({ ...produitSelectionne });
										setFichierImageEdit(null);
										setFichierMockupEdit(null);
										setPreviewImageEdit("");
										setPreviewMockupEdit("");
										setModeEdition(false);
									}}
								>
									Annuler
								</button>
							</div>
						) : (
							<div className="admin-item__actions">
								<ActionButton
									onClick={() => {
										setProduitEdite({ ...produitSelectionne });
										setModeEdition(true);
									}}
								>
									Modifier
								</ActionButton>

								<ActionButton
									inverse={true}
									onClick={() => supprimerProduit(produitSelectionne.id)}
								>
									Supprimer
								</ActionButton>
							</div>
						)}
					</div>
				</div>

				<div className="admin-dimensions">
					<h2>Dimensions & prix</h2>
					<div className="admin-dimensions-liste">
						{tousLesDimensions.map((dim) => {
							const active = dimensionsProduit.find((d) => d.id === dim.id);
							return (
								<div key={dim.id} className="admin-dimension-ligne">
									<span className="admin-dimension-label">{dim.label}</span>
									<input
										type="number"
										step="0.01"
										min="0"
										className="admin-edit-input admin-dimension-prix"
										placeholder="Prix €"
										value={
											nouveauPrix[dim.id] ?? (active ? String(active.prix) : "")
										}
										onChange={(e) =>
											setNouveauPrix({
												...nouveauPrix,
												[dim.id]: e.target.value,
											})
										}
									/>
									{active ? (
										<div className="admin-dimension-actions">
											<button
												type="button"
												className="admin-btn admin-btn--modifier"
												onClick={async () => {
													const prix = Number(nouveauPrix[dim.id]);
													if (Number.isNaN(prix) || prix < 0) return;
													await upsertDimensionProduit(
														produitSelectionne.id,
														dim.id,
														prix,
													);
													const actives = await getDimensionsByProduit(
														produitSelectionne.id,
													);
													setDimensionsProduit(actives);
												}}
											>
												Mettre à jour
											</button>
											<button
												type="button"
												className="admin-btn admin-btn--supprimer"
												onClick={async () => {
													await deleteDimensionProduit(
														produitSelectionne.id,
														dim.id,
													);
													const actives = await getDimensionsByProduit(
														produitSelectionne.id,
													);
													setDimensionsProduit(actives);
													setNouveauPrix((prev) => {
														const copy = { ...prev };
														delete copy[dim.id];
														return copy;
													});
												}}
											>
												Retirer
											</button>
										</div>
									) : (
										<button
											type="button"
											className="admin-btn admin-btn--modifier"
											onClick={async () => {
												const prix = Number(nouveauPrix[dim.id]);
												if (
													Number.isNaN(prix) ||
													prix < 0 ||
													!nouveauPrix[dim.id]
												)
													return;
												await upsertDimensionProduit(
													produitSelectionne.id,
													dim.id,
													prix,
												);
												const actives = await getDimensionsByProduit(
													produitSelectionne.id,
												);
												setDimensionsProduit(actives);
											}}
										>
											Ajouter
										</button>
									)}
								</div>
							);
						})}
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
					aria-label="Retour à l'accueil"
				>
					<svg
						width="36"
						height="20"
						viewBox="0 0 36 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="34" y1="10" x2="2" y2="10" />
						<polyline points="10 18 2 10 10 2" />
					</svg>
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

					{tousLesDimensions.length > 0 && (
						<div className="admin-form__field">
							<span className="admin-form__section-title">
								Formats et prix — renseigner au moins le format principal
							</span>
							{tousLesDimensions.map((d) => {
								const estBase =
									(nouveauProduit.categorie_id === 1 && d.id === 1) ||
									(nouveauProduit.categorie_id === 2 && d.id === 3);
								return (
									<div key={d.id} className="admin-form__dimension-ligne">
										<span className="admin-form__dimension-label">
											{d.label} {estBase && <em>(format principal)</em>}
										</span>
										<input
											type="number"
											step="0.01"
											min="0"
											placeholder="Prix €"
											className="admin-edit-input admin-form__dimension-prix"
											value={dimensionsPrixAjout[d.id] ?? ""}
											onChange={(e) =>
												setDimensionsPrixAjout({
													...dimensionsPrixAjout,
													[d.id]: e.target.value,
												})
											}
										/>
									</div>
								);
							})}
						</div>
					)}

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
							className="admin-pill-btn admin-pill-btn--actif"
							onClick={ajouterProduit}
						>
							Ajouter le produit
						</button>
						<button
							type="button"
							className="admin-pill-btn"
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
	// Reste du routage ou des cas par défaut si nécessaire
}

export default Admin;
