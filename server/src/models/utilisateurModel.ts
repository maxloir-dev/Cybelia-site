import pool from "../config/database";

export const getUserByEmail = async (email: string) => {
	const [rows]: any = await pool.query(
		"SELECT * FROM utilisateurs WHERE email = ?",
		[email],
	);
	return rows[0];
};

export const createUser = async (
	nom: string,
	prenom: string,
	email: string,
	mot_de_passe: string,
) => {
	const [result]: any = await pool.query(
		"INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role_id) VALUES (?, ?, ?, ?, 2)",
		[nom, prenom, email, mot_de_passe],
	);
	return result.insertId;
};
