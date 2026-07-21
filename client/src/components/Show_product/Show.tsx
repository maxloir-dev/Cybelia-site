import "./show.css";
import ActionButton from "../ActionButton/ActionButton";
import { GooeyInput } from "../ui/GooeyInput";
import RevealCard from "../RevealCard";
import { useCart } from "../../store/CartContext";
import { useAuth } from "../../store/AuthContext";
import { API_URL } from "../../api/config";
import {
	getAllDimensions,
	getDimensionsByProduit,
	upsertDimensionProduit,
} from "../../api/dimensionService";
import type { Dimension } from "../../types";
import { cloudinaryUrl } from "../../lib/cloudinary";
import {
	type ChangeEvent,
	type FormEvent,
	useCallback,
	useEffect,
	useState,
} from "react";

type Produit = {
	id: number;
	nom: string;
	description: string;
	prix: number;
	image_url: string;
	mockup_url?: string;
};

type Form = {
	nom: string;
	description: string;
	prix: string;
	categorie_id: number;
};

const formVide: Form = {
	nom: "",
	description: "",
	prix: "",
	categorie_id: 1,
};

type Props = {
	categorieId: number;
	titre: string;
};

export default function Show({ categorieId, titre }: Props) {
	const [produits, setProduits] = useState<Produit[]>([]);
	const [form, setForm] = useState<Form>({
		...formVide,
		categorie_id: categorieId,
	});
	const [modalOuverte, setModalOuverte] = useState(false);
	const [produitEnEdition, setProduitEnEdition] = useState<Produit | null>(
		null,
	);
	const [formEdition, setFormEdition] = useState<Form>({
		...formVide,
		categorie_id: categorieId,
	});
	const [erreurs, setErreurs] = useState<Partial<Form>>({});
	const [erreursEdition, setErreursEdition] = useState<Partial<Form>>({});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [mockupFile, setMockupFile] = useState<File | null>(null);
	const [imageFileEdition, setImageFileEdition] = useState<File | null>(null);
	const [mockupFileEdition, setMockupFileEdition] = useState<File | null>(null);
	const [produitDetail, setProduitDetail] = useState<Produit | null>(null);
	const [slideIndex, setSlideIndex] = useState(0);
	const [recherche, setRecherche] = useState("");
	const [dimensions, setDimensions] = useState<Dimension[]>([]);
	const [dimensionSelectionnee, setDimensionSelectionnee] = useState<Dimension | null>(null);
	const [toutesLesDimensions, setToutesLesDimensions] = useState<Dimension[]>([]);
	const [dimensionsPrixAjout, setDimensionsPrixAjout] = useState<Record<number, string>>({});
	const [dimensionFiltre, setDimensionFiltre] = useState<number | null>(null);
	const { ajouterAuPanier } = useCart();
	const { estAdmin } = useAuth();

	const fetchProduits = useCallback(() => {
		const url = dimensionFiltre
			? `${API_URL}/produits?categorie_id=${categorieId}&dimension_id=${dimensionFiltre}`
			: `${API_URL}/produits?categorie_id=${categorieId}`;
		fetch(url)
			.then((res) => res.json())
			.then((data) => setProduits(data));
	}, [categorieId, dimensionFiltre]);

	useEffect(() => {
		fetchProduits();
	}, [fetchProduits]);

	useEffect(() => {
		if (categorieId === 2 || estAdmin) getAllDimensions().then(setToutesLesDimensions).catch(() => {});
	}, [categorieId, estAdmin]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const valider = (f: Form) => {
		const e: Partial<Form> = {};
		if (!f.nom.trim()) e.nom = "Le nom est obligatoire";
		if (categorieId !== 2) {
			if (!f.prix.trim()) e.prix = "Le prix est obligatoire";
			else if (isNaN(Number(f.prix)) || Number(f.prix) < 0)
				e.prix = "Le prix doit être un nombre positif";
		}
		return e;
	};

	const token = localStorage.getItem("token");
	const authHeader = { Authorization: `Bearer ${token}` };

	const uploadImages = async (principale: File | null, mockup: File | null) => {
		const formData = new FormData();
		if (principale) formData.append("images", principale);
		if (mockup) formData.append("images", mockup);
		const res = await fetch(`${API_URL}/upload/multiple`, {
			method: "POST",
			headers: authHeader,
			body: formData,
		});
		if (!res.ok) throw new Error("Échec de l'upload des images");
		return res.json() as Promise<{
			image_url: string;
			mockup_url: string | null;
		}>;
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const e_ = valider(form);
		if (Object.keys(e_).length > 0) {
			setErreurs(e_);
			return;
		}
		setErreurs({});

		const run = async () => {
			let image_url = "";
			let mockup_url = null;
			if (imageFile || mockupFile) {
				const urls = await uploadImages(imageFile, mockupFile);
				image_url = urls.image_url;
				mockup_url = urls.mockup_url;
			}

			// Pour les affiches : prix de base = prix du format A4 (21×30 cm)
			let prixFinal = Number(form.prix);
			if (categorieId === 2) {
				const dimA4 = toutesLesDimensions.find(
					(d) => Number(d.largeur_cm) === 21,
				);
				const prixA4 = dimA4 ? Number(dimensionsPrixAjout[dimA4.id] ?? 0) : 0;
				prixFinal = prixA4;
			}

			const res = await fetch(`${API_URL}/produits`, {
				method: "POST",
				headers: { "Content-Type": "application/json", ...authHeader },
				body: JSON.stringify({
					...form,
					prix: prixFinal,
					image_url,
					mockup_url,
				}),
			});
			const { id: newId } = await res.json();

			// Sauvegarde des dimensions configurées dans le formulaire
			const dimensionsARenseigner = Object.entries(dimensionsPrixAjout).filter(
				([, prix]) =>
					prix.trim() !== "" && !isNaN(Number(prix)) && Number(prix) >= 0,
			);
			await Promise.all(
				dimensionsARenseigner.map(([dimId, prix]) =>
					upsertDimensionProduit(newId, Number(dimId), Number(prix)),
				),
			);

			setForm({ ...formVide, categorie_id: categorieId });
			setImageFile(null);
			setMockupFile(null);
			setDimensionsPrixAjout({});
			setModalOuverte(false);
			fetchProduits();
		};
		run();
	};

	const ouvrirEdition = (p: Produit) => {
		setProduitEnEdition(p);
		setFormEdition({
			nom: p.nom,
			description: p.description,
			prix: String(p.prix),
			categorie_id: categorieId,
		});
	};

	const handleChangeEdition = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormEdition({ ...formEdition, [e.target.name]: e.target.value });
	};

	const handleEdition = (e: FormEvent) => {
		e.preventDefault();
		const e_ = valider(formEdition);
		if (Object.keys(e_).length > 0) {
			setErreursEdition(e_);
			return;
		}
		setErreursEdition({});

		const run = async () => {
			let image_url = produitEnEdition!.image_url;
			let mockup_url = produitEnEdition!.mockup_url ?? null;
			if (imageFileEdition || mockupFileEdition) {
				const urls = await uploadImages(imageFileEdition, mockupFileEdition);
				image_url = urls.image_url;
				mockup_url = urls.mockup_url;
			}
			await fetch(
				`${API_URL}/produits/${produitEnEdition!.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json", ...authHeader },
					body: JSON.stringify({
						...formEdition,
						prix: Number(formEdition.prix),
						image_url,
						mockup_url,
					}),
				},
			);
			setProduitEnEdition(null);
			setImageFileEdition(null);
			setMockupFileEdition(null);
			fetchProduits();
		};
		run();
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Supprimer ce produit ?")) return;
		await fetch(`${API_URL}/produits/${id}`, {
			method: "DELETE",
			headers: authHeader,
		});
		fetchProduits();
	};

	const produitsFiltres = produits.filter(
		(p) =>
			p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
			p.description.toLowerCase().includes(recherche.toLowerCase()),
	);

	const ouvrirDetail = (p: Produit) => {
		setProduitDetail(p);
		setSlideIndex(0);
		setDimensionSelectionnee(null);
		getDimensionsByProduit(p.id)
			.then((dims) => {
				setDimensions(dims);
				const a4 = dims.find((d) => Number(d.largeur_cm) === 21);
				setDimensionSelectionnee(a4 ?? dims[0] ?? null);
			})
			.catch(() => setDimensions([]));
	};

	return (
		<div className="shop-page">
			<div className="shop-top">
				<h1 className="shop-title">{titre}</h1>
				<GooeyInput
					placeholder="Rechercher..."
					value={recherche}
					onValueChange={setRecherche}
					collapsedWidth={40}
					expandedWidth={280}
					expandedOffset={48}
				/>
			</div>

			{categorieId === 2 && toutesLesDimensions.filter((d) => d.id !== 1).length > 0 && (
				<div className="shop-filtres">
					<button
						type="button"
						className={`shop-filtre-btn${dimensionFiltre === null ? " shop-filtre-btn--actif" : ""}`}
						onClick={() => setDimensionFiltre(null)}
					>
						Tous les formats
					</button>
					{toutesLesDimensions.filter((d) => d.id !== 1).map((d) => (
						<button
							key={d.id}
							type="button"
							className={`shop-filtre-btn${dimensionFiltre === d.id ? " shop-filtre-btn--actif" : ""}`}
							onClick={() => setDimensionFiltre(d.id)}
						>
							{d.label}
						</button>
					))}
				</div>
			)}

			<p className="shop-count">{produitsFiltres.length} résultats affichés</p>

			<div className="shop-grid">
				{produitsFiltres.map((p, index) => (
					<RevealCard
						key={p.id}
						direction={index % 2 === 0 ? "left" : "right"}
						delay={(index % 4) * 0.08}
					>
					<div
						className="shop-card"
						onClick={() => ouvrirDetail(p)}
						onKeyUp={(e) => e.key === "Enter" && ouvrirDetail(p)}
					>
						<img
							src={cloudinaryUrl(p.image_url, 400)}
							alt={p.nom}
							className="shop-card-img"
							loading="lazy"
						/>
						<h3 className="shop-card-nom">{p.nom}</h3>
						<p className="shop-card-prix">
							<span className="shop-card-prix-label">À partir de </span>
							{Number(p.prix).toFixed(2)} €
						</p>

						<button
							type="button"
							className="custom-button shop-card-btn"
							onClick={(e) => {
								e.stopPropagation();
								ouvrirDetail(p);
							}}
						>
							<span className="button-text">Choisir un format</span>
						</button>

						{estAdmin && (
							<div className="shop-card-actions">
								<button
									type="button"
									className="shop-card-edit"
									onClick={(e) => {
										e.stopPropagation();
										ouvrirEdition(p);
									}}
								>
									Modifier
								</button>
								<button
									type="button"
									className="shop-card-delete"
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(p.id);
									}}
								>
									Supprimer
								</button>
							</div>
						)}
					</div>
					</RevealCard>
				))}
			</div>

			{estAdmin && (
				<button
					type="button"
					className="btn-ouvrir-modal"
					onClick={() => setModalOuverte(true)}
				>
					+
				</button>
			)}

			{/* Modale ajout */}
			{estAdmin && modalOuverte && (
				<div className="modal-overlay" onClick={() => setModalOuverte(false)}>
					<div
						className="modal-contenu"
						onClick={(e) => e.stopPropagation()}
						onKeyUp={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							className="modal-fermer"
							onClick={() => setModalOuverte(false)}
						>
							✕
						</button>
						<h2 className="form-title">Ajouter : {titre}</h2>
						<form className="shop-form" onSubmit={handleSubmit}>
							<div>
								<input
									name="nom"
									placeholder="Nom *"
									value={form.nom}
									onChange={handleChange}
								/>
								{erreurs.nom && (
									<span className="form-erreur">{erreurs.nom}</span>
								)}
							</div>
							<textarea
								name="description"
								placeholder="Description"
								value={form.description}
								onChange={handleChange}
							/>
							{categorieId !== 2 && (
								<div>
									<label className="form-label" htmlFor="input-prix">
										Carte postale (10,5 × 14,8 cm) *
									</label>
									<input
										id="input-prix"
										name="prix"
										placeholder="Prix €"
										value={form.prix}
										onChange={handleChange}
									/>
									{erreurs.prix && (
										<span className="form-erreur">{erreurs.prix}</span>
									)}
								</div>
							)}
							<div>
								<label className="form-label" htmlFor="image-main">
									Image principale *
								</label>
								<input
									id="image-main"
									type="file"
									accept="image/*"
									onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
								/>
							</div>
							<div>
								<label className="form-label" htmlFor="image-mockup">
									Image mockup (optionnel)
								</label>
								<input
									id="image-mockup"
									type="file"
									accept="image/*"
									onChange={(e) => setMockupFile(e.target.files?.[0] ?? null)}
								/>
							</div>

							{categorieId === 2 && toutesLesDimensions.length > 0 && (
								<div className="form-dimensions">
									<p className="form-dimensions-titre">
										Formats disponibles — renseigner uniquement les formats
										proposés
									</p>
									{toutesLesDimensions
										.filter((d) => d.id !== 1)
										.map((d) => (
											<div key={d.id} className="form-dimension-ligne">
												<span className="form-dimension-label">{d.label}</span>
												<input
													type="number"
													step="0.01"
													min="0"
													placeholder="Prix €"
													className="form-dimension-prix"
													value={dimensionsPrixAjout[d.id] ?? ""}
													onChange={(e) =>
														setDimensionsPrixAjout({
															...dimensionsPrixAjout,
															[d.id]: e.target.value,
														})
													}
												/>
											</div>
										))}
								</div>
							)}

							<button type="submit">Ajouter</button>
						</form>
					</div>
				</div>
			)}

			{/* Modale édition */}
			{estAdmin && produitEnEdition && (
				<div
					className="modal-overlay"
					onClick={() => setProduitEnEdition(null)}
				>
					<div
						className="modal-contenu"
						onClick={(e) => e.stopPropagation()}
						onKeyUp={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							className="modal-fermer"
							onClick={() => setProduitEnEdition(null)}
						>
							✕
						</button>
						<h2 className="form-title">Modifier : {produitEnEdition.nom}</h2>
						<form className="shop-form" onSubmit={handleEdition}>
							<div>
								<input
									name="nom"
									placeholder="Nom *"
									value={formEdition.nom}
									onChange={handleChangeEdition}
								/>
								{erreursEdition.nom && (
									<span className="form-erreur">{erreursEdition.nom}</span>
								)}
							</div>
							<textarea
								name="description"
								placeholder="Description"
								value={formEdition.description}
								onChange={handleChangeEdition}
							/>
							<div>
								<input
									name="prix"
									placeholder="Prix *"
									value={formEdition.prix}
									onChange={handleChangeEdition}
								/>
								{erreursEdition.prix && (
									<span className="form-erreur">{erreursEdition.prix}</span>
								)}
							</div>
							<div>
								<label className="form-label" htmlFor="edit-main">
									Image principale (laisser vide pour garder l'actuelle)
								</label>
								<input
									id="edit-main"
									type="file"
									accept="image/*"
									onChange={(e) =>
										setImageFileEdition(e.target.files?.[0] ?? null)
									}
								/>
							</div>
							<div>
								<label className="form-label" htmlFor="edit-mockup">
									Image mockup (laisser vide pour garder l'actuelle)
								</label>
								<input
									id="edit-mockup"
									type="file"
									accept="image/*"
									onChange={(e) =>
										setMockupFileEdition(e.target.files?.[0] ?? null)
									}
								/>
							</div>
							<button type="submit">Enregistrer</button>
						</form>
					</div>
				</div>
			)}

			{/* Modale détail avec slider */}
			{produitDetail && (
				<div className="modal-overlay" onClick={() => setProduitDetail(null)}>
					<div
						className="modal-detail"
						onClick={(e) => e.stopPropagation()}
						onKeyUp={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							className="modal-fermer"
							onClick={() => setProduitDetail(null)}
						>
							✕
						</button>
						<div className="detail-contenu">
							<div className="detail-image">
								<img
									src={
										(slideIndex === 0
											? produitDetail.image_url
											: (produitDetail.mockup_url ?? produitDetail.image_url)) ||
										undefined
									}
									alt={produitDetail.nom}
								/>
								{produitDetail.mockup_url && (
									<div className="slider-controls">
										<button
											type="button"
											className="slider-btn"
											onClick={() => setSlideIndex(slideIndex === 0 ? 1 : 0)}
										>
											{slideIndex === 0 ? "›" : "‹"}
										</button>
										<span className="slider-dots">
											<button
												type="button"
												className={slideIndex === 0 ? "dot actif" : "dot"}
												onClick={() => setSlideIndex(0)}
												aria-label="Slide 1"
											/>
											<button
												type="button"
												className={slideIndex === 1 ? "dot actif" : "dot"}
												onClick={() => setSlideIndex(1)}
												aria-label="Slide 2"
											/>
										</span>
									</div>
								)}
							</div>
							<div className="detail-info">
								<h2>{produitDetail.nom}</h2>
								<p className="detail-prix">
									{dimensionSelectionnee
										? Number(dimensionSelectionnee.prix).toFixed(2)
										: Number(produitDetail.prix).toFixed(2)}{" "}
									€
								</p>
								<p className="detail-description">
									{produitDetail.description}
								</p>

								{dimensions.length > 0 && (
									<div className="detail-dimensions">
										<p className="detail-dimensions-titre">Format</p>
										<div className="detail-dimensions-liste">
											{dimensions.map((d) => (
												<button
													key={d.id}
													type="button"
													className={`dimension-btn${dimensionSelectionnee?.id === d.id ? " dimension-btn--actif" : ""}`}
													onClick={() => setDimensionSelectionnee(d)}
												>
													{d.label}
													<span className="dimension-btn-prix">
														{Number(d.prix).toFixed(2)} €
													</span>
												</button>
											))}
										</div>
									</div>
								)}

								<ActionButton
									className="btn-panier"
									onClick={() => {
										const prixFinal = dimensionSelectionnee
											? Number(dimensionSelectionnee.prix)
											: Number(produitDetail.prix);
										const cartKey = dimensionSelectionnee
											? `${produitDetail.id}-${dimensionSelectionnee.id}`
											: `${produitDetail.id}-sans`;
										ajouterAuPanier({
											cartKey,
											id: produitDetail.id,
											nom: produitDetail.nom,
											prix: prixFinal,
											image_url: produitDetail.image_url,
											dimension_id: dimensionSelectionnee?.id ?? null,
											dimension_label: dimensionSelectionnee?.label ?? null,
										});
										setProduitDetail(null);
									}}
								>
									Ajouter au panier
								</ActionButton>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
