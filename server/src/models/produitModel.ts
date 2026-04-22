import pool from "../config/database";

// Requêtes SQL liées aux produits

// Récupère tous les produits avec le nom de leur catégorie
export const getAllProduits = async (categorieId?: number) => {
	if (categorieId) {
		const [rows] = await pool.query(
			`SELECT p.id, p.nom, p.description, p.prix, p.image_url, p.created_at,
			        c.nom AS categorie
			 FROM produits p
			 JOIN categories c ON p.categorie_id = c.id
			 WHERE p.categorie_id = ?`,
			[categorieId],
		);
		return rows;
	}
	const [rows] = await pool.query(`
        SELECT p.id, p.nom, p.description, p.prix, p.image_url, p.created_at,
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
        SELECT p.id, p.nom, p.description, p.prix, p.image_url, p.created_at,
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
) => {
	const [result]: any = await pool.query(
		// Le ? est remplacé par les valeurs du tableau — protège contre les injections SQL
		"INSERT INTO produits (nom, description, prix, image_url, categorie_id) VALUES (?, ?, ?, ?, ?)",
		[nom, description, prix, image_url, categorie_id],
	);
	return result.insertId; // Retourne l'id du produit nouvellement créé
};

// Met à jour un produit existant par son id
export const updateProduit = async (
	id: number,
	nom: string,
	description: string,
	prix: number,
	image_url: string,
	categorie_id: number,
) => {
	await pool.query(
		"UPDATE produits SET nom = ?, description = ?, prix = ?, image_url = ?, categorie_id = ? WHERE id = ?",
		[nom, description, prix, image_url, categorie_id, id],
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
