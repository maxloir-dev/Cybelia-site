import { Response } from "express";
import {
	getAllUtilisateurs,
	getCommandesByUtilisateur,
	deleteUser,
} from "../models/utilisateurModel";
import { AuthRequest } from "../middlewares/authMiddleware";

// Routes liées aux utilisateurs (gérante uniquement)

// Récupère tous les clients avec leur nombre de commandes
export const getUtilisateurs = async (req: AuthRequest, res: Response) => {
	try {
		const utilisateurs = await getAllUtilisateurs();
		res.json(utilisateurs);
	} catch (error) {
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
	} catch (error) {
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
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la suppression du client" });
	}
};
