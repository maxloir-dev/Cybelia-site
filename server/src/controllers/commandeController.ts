import { Response } from "express";
import {
	createCommande,
	createLignesCommande,
	getAllCommandes,
	getCommandeById,
	getCommandesByUserId,
} from "../models/commandeModel";
import { AuthRequest } from "../middlewares/authMiddleware";

// Routes liées aux commandes

// Passer une nouvelle commande (client connecté)
// Le client envoie la liste des produits avec leurs quantités
export const passerCommande = async (req: AuthRequest, res: Response) => {
	try {
		const utilisateur_id = req.utilisateur!.id;
		const { lignes } = req.body;
		// lignes = [{ produit_id, quantite, prix_unitaire }, ...]

		// Calcul du montant total
		const montant_total = lignes.reduce(
			(total: number, ligne: { quantite: number; prix_unitaire: number }) =>
				total + ligne.quantite * ligne.prix_unitaire,
			0,
		);

		// Création de la commande
		const commande_id = await createCommande(utilisateur_id, montant_total);

		// Création des lignes de commande
		await createLignesCommande(commande_id, lignes);

		res
			.status(201)
			.json({ message: "Commande passée avec succès", commande_id });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la création de la commande" });
	}
};

// Récupère toutes les commandes (gérante uniquement)
export const getCommandes = async (req: AuthRequest, res: Response) => {
	try {
		const commandes = await getAllCommandes();
		res.json(commandes);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des commandes" });
	}
};

// Récupère le détail d'une commande par son id (gérante uniquement)
export const getCommande = async (req: AuthRequest, res: Response) => {
	try {
		const commande = await getCommandeById(Number(req.params.id));
		if (!commande.length) {
			res.status(404).json({ message: "Commande non trouvée" });
		} else {
			res.json(commande);
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération de la commande" });
	}
};
// Récupère les commandes du client connecté
export const getMesCommandes = async (req: AuthRequest, res: Response) => {
	try {
		const commandes = await getCommandesByUserId(req.utilisateur!.id);
		res.json(commandes);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération de vos commandes" });
	}
};
