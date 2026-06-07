import { Router } from "express";
import {
	getProduits,
	getProduit,
	addProduit,
	editProduit,
	removeProduit,
	getProduitsByCategorieid,
} from "../controllers/produitController";
import {
	getDimensionsProduit,
	upsertDimensionProduit,
	removeDimensionProduit,
} from "../controllers/dimensionController";
import { verifierToken, verifierAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Routes publiques

// Récupère tous les produits
router.get("/", getProduits);

// Récupère les produits par catégorie (public) — doit être avant /:id
router.get("/categorie/:id", getProduitsByCategorieid);

// Dimensions d'un produit (public)
router.get("/:id/dimensions", getDimensionsProduit);

// Récupère un produit par son id
router.get("/:id", getProduit);

// Routes protégées

// Ajoute un nouveau produit
router.post("/", verifierToken, verifierAdmin, addProduit);

// Modifie un produit existant
router.put("/:id", verifierToken, verifierAdmin, editProduit);

// Supprime un produit
router.delete("/:id", verifierToken, verifierAdmin, removeProduit);


// Gestion des dimensions par produit (admin)
router.post("/:id/dimensions", verifierToken, verifierAdmin, upsertDimensionProduit);
router.delete("/:id/dimensions/:dimensionId", verifierToken, verifierAdmin, removeDimensionProduit);

export default router;
