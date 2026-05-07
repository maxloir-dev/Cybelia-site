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
			 WHERE p.categorie_id = ?`,
			[categorieId],
		);
		return rows;
	}
	const [rows] = await pool.query(`
        SELECT p.id, p.nom, p.description, p.prix, p.image_url, p.mockup_url, p.created_at,
               c.nom AS categorie
        FROM produits p
        JOIN categories c ON p.categorie_id = c.id
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

// Supprime un produit de la base par son id
export const deleteProduit = async (id: number) => {
	await pool.query("DELETE FROM produits WHERE id = ?", [id]);
};

// Récupère les produits par catégorie
export const getProduitsByCategorie = async (categorie_id: number) => {
	const [rows] = await pool.query(
		`
        SELECT p.id, p.nom, p.description, p.prix, p.image_url, p.created_at,
               c.nom AS categorie
        FROM produits p
        JOIN categories c ON p.categorie_id = c.id
        WHERE p.categorie_id = ?
    `,
		[categorie_id],
	);
	return rows;
};
