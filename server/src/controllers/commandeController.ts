import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware";
import {
	getAllCommandes,
	getCommandeById,
	getCommandesByUserId,
	deleteCommandeById,
} from "../models/commandeModel";

// Routes liées aux commandes
// NB : la création de commande se fait via le webhook Stripe (stripeController),
// après paiement vérifié. Il n'y a donc pas de contrôleur "passerCommande".

// Récupère toutes les commandes (gérante uniquement)
export const getCommandes = async (_req: AuthRequest, res: Response) => {
	try {
		const commandes = await getAllCommandes();
		res.json(commandes);
	} catch (error) {
		console.error("ERREUR COMMANDES:", error);
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des commandes" });
	}
};

// Récupère le détail d'une commande par son id (gérante uniquement)
export const getCommande = async (req: AuthRequest, res: Response) => {
	try {
		const id = Number(req.params.id);
		if (Number.isNaN(id)) {
			res.status(400).json({ message: "ID de commande invalide" });
			return;
		}
		const commande = await getCommandeById(id);
		if (!commande.length) {
			res.status(404).json({ message: "Commande non trouvée" });
		} else {
			res.json(commande);
		}
	} catch (error) {
		console.error("ERREUR COMMANDE:", error);
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération de la commande" });
	}
};

// Récupère les commandes du client connecté
export const getMesCommandes = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.utilisateur) {
			res.status(401).json({ message: "Utilisateur non authentifié" });
			return;
		}
		const commandes = await getCommandesByUserId(req.utilisateur.id);
		res.json(commandes);
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération de vos commandes" });
	}
};

// Supprime définitivement une commande (gérante uniquement)
export const deleteCommande = async (req: AuthRequest, res: Response) => {
	try {
		const commandeId = Number(req.params.id);

		if (isNaN(commandeId)) {
			res.status(400).json({ message: "ID de commande invalide" });
			return;
		}

		// Appelle le modèle SQL qu'on vient de créer
		await deleteCommandeById(commandeId);

		res.status(200).json({ message: "Commande supprimée avec succès" });
	} catch (error) {
		console.error("ERREUR SUPPRESSION COMMANDE:", error);
		res
			.status(500)
			.json({ message: "Erreur lors de la suppression de la commande" });
	}
};
