import pool from "../config/database";

// Requêtes SQL liées aux utilisateurs

// Recherche un utilisateur par son email
// Utilisé lors de la connexion pour vérifier si l'email existe
export const getUserByEmail = async (email: string) => {
	const [rows]: any = await pool.query(
		"SELECT * FROM utilisateurs WHERE email = ?",
		[email],
	);
	return rows[0]; // Retourne l'utilisateur ou undefined si non trouvé
};
// Crée un nouvel utilisateur dans la base et retourne son id
// Le role_id est forcé à 2 (client) — seule la gérante peut avoir le role_id 1 (admin)
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
	return result.insertId; // Retourne l'id de l'utilisateur nouvellement créé
};
