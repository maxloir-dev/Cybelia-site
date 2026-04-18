import { Router } from "express";
import {
	getUtilisateurs,
	getHistoriqueCommandes,
	deleteUtilisateur,
} from "../controllers/utilisateurController";
import { verifierToken, verifierAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Récupère tous les clients (gérante uniquement)
router.get("/", verifierToken, verifierAdmin, getUtilisateurs);

// Récupère l'historique des commandes d'un client (gérante uniquement)
router.get(
	"/:id/commandes",
	verifierToken,
	verifierAdmin,
	getHistoriqueCommandes,
);
// Supprime un client (gérante uniquement)
router.delete("/:id", verifierToken, verifierAdmin, deleteUtilisateur);

export default router;
