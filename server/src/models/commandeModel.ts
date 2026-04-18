import pool from "../config/database";

// Crée une nouvelle commande et retourne son id
export const createCommande = async (
	utilisateur_id: number,
	montant_total: number,
) => {
	const [result]: any = await pool.query(
		"INSERT INTO commandes (utilisateur_id, montant_total) VALUES (?, ?)",
		[utilisateur_id, montant_total],
	);
	return result.insertId;
};

// Crée les lignes de commande associées à une commande
export const createLignesCommande = async (
	commande_id: number,
	lignes: { produit_id: number; quantite: number; prix_unitaire: number }[],
) => {
	// On insère toutes les lignes en une seule requête
	const values = lignes.map((l) => [
		commande_id,
		l.produit_id,
		l.quantite,
		l.prix_unitaire,
	]);
	await pool.query(
		"INSERT INTO lignes_commande (commande_id, produit_id, quantite, prix_unitaire) VALUES ?",
		[values],
	);
};

// Récupère toutes les commandes avec les infos du client (pour la gérante)
export const getAllCommandes = async () => {
	const [rows] = await pool.query(`
        SELECT c.id, c.montant_total, c.created_at,
               u.nom, u.prenom, u.email
        FROM commandes c
        JOIN utilisateurs u ON c.utilisateur_id = u.id
        ORDER BY c.created_at DESC
    `);
	return rows;
};

// Récupère le détail d'une commande avec ses lignes et produits
export const getCommandeById = async (id: number) => {
	const [rows]: any = await pool.query(
		`
        SELECT c.id, c.montant_total, c.created_at,
               u.nom, u.prenom, u.email,
               lc.quantite, lc.prix_unitaire,
               p.nom AS produit_nom
        FROM commandes c
        JOIN utilisateurs u ON c.utilisateur_id = u.id
        JOIN lignes_commande lc ON c.id = lc.commande_id
        JOIN produits p ON lc.produit_id = p.id
        WHERE c.id = ?
    `,
		[id],
	);
	return rows;
};
// Récupère toutes les commandes d'un client connecté
export const getCommandesByUserId = async (utilisateur_id: number) => {
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
		[utilisateur_id],
	);
	return rows;
};
