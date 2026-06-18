import pool from "../config/database";

// Requêtes SQL liées aux produits

// Récupère tous les produits avec le nom de leur catégorie
export const getAllProduits = async (categorieId?: number) => {
	if (categorieId) {
		const [rows] = await pool.query(
			`SELECT p.id, p.nom, p.description, p.prix, p.image_url, p.mockup_url, p.created_at,
			        c.nom AS categorie
			 FROM produits p
			 JOIN categories c ON p.categorie_id = c.id
			 WHERE p.categorie_id = ? AND p.actif = true`,
			[categorieId],
		);
		return rows;
	}
	const [rows] = await pool.query(`
        SELECT p.id, p.nom, p.description, p.prix, p.image_url, p.mockup_url, p.created_at,
               c.nom AS categorie
        FROM produits p
        JOIN categories c ON p.categorie_id = c.id
        WHERE p.actif = true
    `);
	return rows;
};

// Récupère un seul produit par son id avec le nom de sa catégorie
export const getProduitById = async (id: number) => {
	const [rows]: any = await pool.query(
		`
        SELECT p.id, p.nom, p.description, p.prix, p.image_url, p.mockup_url, p.created_at,
               c.nom AS categorie
        FROM produits p
        JOIN categories c ON p.categorie_id = c.id
        WHERE p.id = ?
    `,
		[id],
	);
	return rows[0]; // Retourne le premier résultat ou undefined si non trouvé
};

// Insère un nouveau produit dans la base et retourne son id
export const createProduit = async (
	nom: string,
	description: string,
	prix: number,
	image_url: string,
	categorie_id: number,
	mockup_url?: string,
) => {
	const [result]: any = await pool.query(
		"INSERT INTO produits (nom, description, prix, image_url, categorie_id, mockup_url) VALUES (?, ?, ?, ?, ?, ?)",
		[nom, description, prix, image_url, categorie_id, mockup_url ?? null],
	);
	return result.insertId;
};

// Met à jour un produit existant par son id
export const updateProduit = async (
	id: number,
	nom: string,
	description: string,
	prix: number,
	image_url: string,
	categorie_id: number,
	mockup_url?: string,
) => {
	await pool.query(
		"UPDATE produits SET nom = ?, description = ?, prix = ?, image_url = ?, categorie_id = ?, mockup_url = ? WHERE id = ?",
		[nom, description, prix, image_url, categorie_id, mockup_url ?? null, id],
	);
};

// Désactive un produit (soft delete — ne supprime pas la ligne)
export const deleteProduit = async (id: number) => {
	await pool.query("UPDATE produits SET actif = false WHERE id = ?", [id]);
};

// Bascule la disponibilité d'un produit (rupture / disponible)
export const toggleDisponibleProduit = async (
	id: number,
	disponible: boolean,
) => {
	await pool.query("UPDATE produits SET disponible = ? WHERE id = ?", [
		disponible,
		id,
	]);
};

// Retourne les ids de commandes qui contiennent ce produit
export const getCommandesForProduit = async (id: number) => {
	const [rows]: any = await pool.query(
		"SELECT DISTINCT commande_id FROM lignes_commande WHERE produit_id = ?",
		[id],
	);
	return rows.map((r: any) => r.commande_id) as number[];
};

// Récupère les produits par catégorie
export const getProduitsByCategorie = async (categorie_id: number) => {
	const [rows] = await pool.query(
		`
        SELECT p.id, p.nom, p.description, p.prix, p.image_url, p.mockup_url, p.created_at,
               c.nom AS categorie
        FROM produits p
        JOIN categories c ON p.categorie_id = c.id
        WHERE p.categorie_id = ? AND p.actif = true
    `,
		[categorie_id],
	);
	return rows;
};
