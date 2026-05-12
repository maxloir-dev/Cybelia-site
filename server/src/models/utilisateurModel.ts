import pool from "../config/database";

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

// Récupère tous les clients avec leur nombre de commandes (gérante)
export const getAllUtilisateurs = async () => {
	const [rows] = await pool.query(`
        SELECT u.id, u.nom, u.prenom, u.email, u.created_at,
               COUNT(c.id) AS nombre_commandes
        FROM utilisateurs u
        LEFT JOIN commandes c ON u.id = c.utilisateur_id
        WHERE u.role_id = 2
        GROUP BY u.id
        ORDER BY u.created_at DESC
    `);
	return rows;
};

// Récupère l'historique des commandes d'un client (gérante)
export const getCommandesByUtilisateur = async (id: number) => {
	const [rows] = await pool.query(
		`
        SELECT c.id, c.montant_total, c.created_at,
               lc.quantite, lc.prix_unitaire,
               p.nom AS produit_nom
        FROM commandes c
        JOIN lignes_commande lc ON c.id = lc.commande_id
        JOIN produits p ON lc.produit_id = p.id
        WHERE c.utilisateur_id = ?
        ORDER BY c.created_at DESC
    `,
		[id],
	);
	return rows;
};

// Récupère le profil d'un utilisateur par son id
export const getUserById = async (id: number) => {
	const [rows]: any = await pool.query(
		"SELECT id, nom, prenom, email, role_id, created_at FROM utilisateurs WHERE id = ?",
		[id],
	);
	return rows[0];
};

// Avec mot de passe — uniquement pour la vérification du mot de passe
export const getUserByIdWithPassword = async (id: number) => {
	const [rows]: any = await pool.query(
		"SELECT id, mot_de_passe FROM utilisateurs WHERE id = ?",
		[id],
	);
	return rows[0];
};

// Met à jour le profil d'un utilisateur
export const updateUser = async (
	id: number,
	nom: string,
	prenom: string,
	email: string,
) => {
	await pool.query(
		"UPDATE utilisateurs SET nom = ?, prenom = ?, email = ? WHERE id = ?",
		[nom, prenom, email, id],
	);
};

// Supprime un utilisateur par son id
export const deleteUser = async (id: number) => {
	await pool.query("DELETE FROM utilisateurs WHERE id = ?", [id]);
};

// Stocke un token de réinitialisation avec expiration (1h)
export const setResetToken = async (email: string, token: string, expires: Date) => {
	await pool.query(
		"UPDATE utilisateurs SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
		[token, expires, email],
	);
};

// Trouve un utilisateur par son token de réinitialisation (non expiré)
export const getUserByResetToken = async (token: string) => {
	const [rows]: any = await pool.query(
		"SELECT * FROM utilisateurs WHERE reset_token = ? AND reset_token_expires > NOW()",
		[token],
	);
	return rows[0];
};

// Efface le token après utilisation
export const clearResetToken = async (id: number) => {
	await pool.query(
		"UPDATE utilisateurs SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
		[id],
	);
};

// Met à jour le mot de passe d'un utilisateur
export const updatePassword = async (id: number, mot_de_passe: string) => {
	await pool.query("UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?", [
		mot_de_passe,
		id,
	]);
};
