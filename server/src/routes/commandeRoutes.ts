import { Router } from "express";
import {
	getCommandes,
	getCommande,
	getMesCommandes,
	deleteCommande,
} from "../controllers/commandeController";
import { verifierToken, verifierAdmin } from "../middlewares/authMiddleware";

const router = Router();
// Récupère les commandes du client connecté
router.get("/mes-commandes", verifierToken, getMesCommandes);

// NB : la création de commande se fait désormais côté serveur via le webhook
// Stripe (payment_intent.succeeded), voir stripeController. Il n'y a plus de
// route publique de création de commande (pas de commande sans paiement vérifié).

// Récupère toutes les commandes (gérante uniquement)
router.get("/", verifierToken, verifierAdmin, getCommandes);

// Récupère le détail d'une commande (gérante uniquement)
router.get("/:id", verifierToken, verifierAdmin, getCommande);

// Supprime une commande (gérante uniquement)
router.delete("/:id", verifierToken, verifierAdmin, deleteCommande);

export default router;
