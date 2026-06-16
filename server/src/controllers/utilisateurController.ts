import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware";
import {
	deleteUser,
	getAllUtilisateurs,
	getCommandesByUtilisateur,
} from "../models/utilisateurModel";

// Routes liées aux utilisateurs (gérante uniquement)

// Récupère tous les clients avec leur nombre de commandes
export const getUtilisateurs = async (_req: AuthRequest, res: Response) => {
	try {
		const utilisateurs = await getAllUtilisateurs();
		res.json(utilisateurs);
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des clients" });
	}
};

// Récupère l'historique des commandes d'un client par son id
export const getHistoriqueCommandes = async (
	req: AuthRequest,
	res: Response,
) => {
	try {
		const commandes = await getCommandesByUtilisateur(Number(req.params.id));
		if (!commandes) {
			res
				.status(404)
				.json({ message: "Aucune commande trouvée pour cet utilisateur" });
		} else {
			res.json(commandes);
		}
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération de l'historique" });
	}
};
// Supprime un client par son id (gérante uniquement)
export const deleteUtilisateur = async (req: AuthRequest, res: Response) => {
	try {
		await deleteUser(Number(req.params.id));
		res.json({ message: "Client supprimé avec succès" });
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la suppression du client" });
	}
};
