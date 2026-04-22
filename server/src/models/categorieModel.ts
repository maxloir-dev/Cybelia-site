import pool from "../config/database";

// Récupère toutes les catégories
export const getAllCategories = async () => {
	const [rows] = await pool.query("SELECT * FROM categories");
	return rows;
};
