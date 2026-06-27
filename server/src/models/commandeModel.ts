import pool from "../config/database";
import { grouperLignesParCommande } from "../utils/grouperCommandes";

const CHAMPS_LIGNE = [
	"quantite",
	"prix_unitaire",
	"produit_nom",
	"dimension_label",
	"image_url",
];

export interface LivraisonData {
	prenom: string;
	nom: string;
	email: string;
	telephone?: string;
	adresse: string;
	code_postal: string;
	ville: string;
	pays: string;
}

// Crée une nouvelle commande et retourne son id.
// payment_intent_id : id du PaymentIntent Stripe associé (null pour les
// commandes créées hors flux de paiement). Sert à l'idempotence du webhook.
export const createCommande = async (
	utilisateur_id: number,
	montant_total: number,
	livraison: LivraisonData,
	payment_intent_id: string | null = null,
) => {
	const [result]: any = await pool.query(
		`INSERT INTO commandes
		 (utilisateur_id, montant_total, prenom_livraison, nom_livraison, email_livraison, telephone, adresse, code_postal, ville, pays, stripe_payment_intent_id)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			utilisateur_id,
			montant_total,
			livraison.prenom,
			livraison.nom,
			livraison.email,
			livraison.telephone ?? null,
			livraison.adresse,
			livraison.code_postal,
			livraison.ville,
			livraison.pays,
			payment_intent_id,
		],
	);
	return result.insertId;
};

// Retrouve une commande par l'id de son PaymentIntent (idempotence webhook)
export const getCommandeByPaymentIntentId = async (
	payment_intent_id: string,
): Promise<{ id: number } | null> => {
	const [rows]: any = await pool.query(
		"SELECT id FROM commandes WHERE stripe_payment_intent_id = ? LIMIT 1",
		[payment_intent_id],
	);
	return rows[0] ?? null;
};

// Crée les lignes de commande associées à une commande
export const createLignesCommande = async (
	commande_id: number,
	lignes: {
		produit_id: number;
		quantite: number;
		prix_unitaire: number;
		dimension_id?: number | null;
		produit_nom: string;
		dimension_label?: string | null;
	}[],
) => {
	const values = lignes.map((l) => [
		commande_id,
		l.produit_id,
		l.quantite,
		l.prix_unitaire,
		l.dimension_id ?? null,
		l.produit_nom,
		l.dimension_label ?? null,
	]);
	await pool.query(
		"INSERT INTO lignes_commande (commande_id, produit_id, quantite, prix_unitaire, dimension_id, produit_nom, dimension_label) VALUES ?",
		[values],
	);
};

// Récupère toutes les commandes avec les infos du client et leurs lignes (pour la gérante)
export const getAllCommandes = async () => {
	const [rows]: any = await pool.query(`
        SELECT c.id, c.montant_total, c.created_at,
               u.nom, u.prenom, u.email,
               c.prenom_livraison, c.nom_livraison, c.email_livraison,
               c.telephone, c.adresse, c.code_postal, c.ville, c.pays,
               lc.quantite, lc.prix_unitaire,
               COALESCE(lc.produit_nom, p.nom) AS produit_nom,
               COALESCE(lc.dimension_label, d.label) AS dimension_label,
			   p.image_url
        FROM commandes c
        JOIN utilisateurs u ON c.utilisateur_id = u.id
        JOIN lignes_commande lc ON c.id = lc.commande_id
        LEFT JOIN produits p ON lc.produit_id = p.id
        LEFT JOIN dimensions d ON lc.dimension_id = d.id
        ORDER BY c.created_at DESC
    `);
	return grouperLignesParCommande(rows, CHAMPS_LIGNE);
};

// Récupère le détail d'une commande avec ses lignes et produits
export const getCommandeById = async (id: number) => {
	const [rows]: any = await pool.query(
		`
        SELECT c.id, c.montant_total, c.created_at,
               u.nom, u.prenom, u.email,
               lc.quantite, lc.prix_unitaire,
               COALESCE(lc.produit_nom, p.nom) AS produit_nom,
               COALESCE(lc.dimension_label, d.label) AS dimension_label,
			   p.image_url
        FROM commandes c
        JOIN utilisateurs u ON c.utilisateur_id = u.id
        JOIN lignes_commande lc ON c.id = lc.commande_id
        LEFT JOIN produits p ON lc.produit_id = p.id
        LEFT JOIN dimensions d ON lc.dimension_id = d.id
        WHERE c.id = ?
    `,
		[id],
	);
	return grouperLignesParCommande(rows, CHAMPS_LIGNE);
};
// Supprime une commande et ses lignes
export const deleteCommande = async (id: number) => {
	await pool.query("DELETE FROM lignes_commande WHERE commande_id = ?", [id]);
	await pool.query("DELETE FROM commandes WHERE id = ?", [id]);
};

// Récupère toutes les commandes d'un client connecté
export const getCommandesByUserId = async (utilisateur_id: number) => {
	const [rows]: any = await pool.query(
		`
        SELECT c.id, c.montant_total, c.created_at,
               lc.quantite, lc.prix_unitaire,
               COALESCE(lc.produit_nom, p.nom) AS produit_nom,
               COALESCE(lc.dimension_label, d.label) AS dimension_label,
               p.image_url
        FROM commandes c
        JOIN lignes_commande lc ON c.id = lc.commande_id
        LEFT JOIN produits p ON lc.produit_id = p.id
        LEFT JOIN dimensions d ON lc.dimension_id = d.id
        WHERE c.utilisateur_id = ?
        ORDER BY c.created_at DESC
    `,
		[utilisateur_id],
	);
	return grouperLignesParCommande(rows, CHAMPS_LIGNE);
};

// Supprime une commande et ses lignes associées
export const deleteCommandeById = async (id: number): Promise<void> => {
	await pool.query("DELETE FROM lignes_commande WHERE commande_id = ?", [id]);

	await pool.query("DELETE FROM commandes WHERE id = ?", [id]);
};
