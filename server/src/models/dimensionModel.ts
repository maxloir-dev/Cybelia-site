import pool from "../config/database";

export interface Dimension {
	id: number;
	label: string;
	largeur_cm: number;
	hauteur_cm: number;
}

export interface ProduitDimension extends Dimension {
	prix: number;
}

// Toutes les dimensions disponibles (référentiel)
export const getAllDimensions = async (): Promise<Dimension[]> => {
	const [rows] = await pool.query("SELECT * FROM dimensions ORDER BY hauteur_cm ASC");
	return rows as Dimension[];
};

// Dimensions avec prix pour un produit donné
export const getDimensionsByProduitId = async (produit_id: number): Promise<ProduitDimension[]> => {
	const [rows] = await pool.query(
		`SELECT d.id, d.label, d.largeur_cm, d.hauteur_cm, pd.prix
		 FROM produit_dimensions pd
		 JOIN dimensions d ON pd.dimension_id = d.id
		 WHERE pd.produit_id = ?
		 ORDER BY d.hauteur_cm ASC`,
		[produit_id],
	);
	return rows as ProduitDimension[];
};

// Prix d'une dimension pour un produit (pour vérification côté commande)
export const getProduitDimensionPrix = async (
	produit_id: number,
	dimension_id: number,
): Promise<number | null> => {
	const [rows]: any = await pool.query(
		"SELECT prix FROM produit_dimensions WHERE produit_id = ? AND dimension_id = ?",
		[produit_id, dimension_id],
	);
	return rows[0]?.prix ?? null;
};

// Crée ou met à jour le prix d'une dimension pour un produit
export const upsertProduitDimension = async (
	produit_id: number,
	dimension_id: number,
	prix: number,
): Promise<void> => {
	await pool.query(
		`INSERT INTO produit_dimensions (produit_id, dimension_id, prix)
		 VALUES (?, ?, ?)
		 ON DUPLICATE KEY UPDATE prix = VALUES(prix)`,
		[produit_id, dimension_id, prix],
	);
};

// Supprime une dimension d'un produit
export const deleteProduitDimension = async (
	produit_id: number,
	dimension_id: number,
): Promise<void> => {
	await pool.query(
		"DELETE FROM produit_dimensions WHERE produit_id = ? AND dimension_id = ?",
		[produit_id, dimension_id],
	);
};
