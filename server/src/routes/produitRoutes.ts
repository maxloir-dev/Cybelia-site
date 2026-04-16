import { Router } from "express";
import {
	getProduits,
	getProduit,
	addProduit,
	editProduit,
	removeProduit,
} from "../controllers/produitController";
import { verifierToken, verifierAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Routes publiques

// Récupère tous les produits
router.get("/", getProduits);

// Récupère un produit par son id
router.get("/:id", getProduit);

// Routes protégées

// Ajoute un nouveau produit
router.post("/", verifierToken, verifierAdmin, addProduit);

// Modifie un produit existant
router.put("/:id", verifierToken, verifierAdmin, editProduit);

// Supprime un produit
router.delete("/:id", verifierToken, verifierAdmin, removeProduit);

export default router;
