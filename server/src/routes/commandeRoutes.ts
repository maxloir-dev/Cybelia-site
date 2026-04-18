import { Router } from "express";
import {
	passerCommande,
	getCommandes,
	getCommande,
	getMesCommandes,
} from "../controllers/commandeController";
import { verifierToken, verifierAdmin } from "../middlewares/authMiddleware";

const router = Router();
// Récupère les commandes du client connecté
router.get("/mes-commandes", verifierToken, getMesCommandes);

// Passer une commande (client connecté uniquement)
router.post("/", verifierToken, passerCommande);

// Récupère toutes les commandes (gérante uniquement)
router.get("/", verifierToken, verifierAdmin, getCommandes);

// Récupère le détail d'une commande (gérante uniquement)
router.get("/:id", verifierToken, verifierAdmin, getCommande);

export default router;
