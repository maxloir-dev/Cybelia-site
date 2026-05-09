import { Router } from "express";
import {
	getProduits,
	getProduit,
	addProduit,
	editProduit,
	removeProduit,
	getProduitsByCategorieid,
} from "../controllers/produitController";
import { verifierToken, verifierAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Routes publiques

// Récupère tous les produits
router.get("/", getProduits);

// Récupère un produit par son id
router.get("/:id", getProduit);

// Récupère les produits par catégorie (public)
router.get("/categorie/:id", getProduitsByCategorieid);

// Routes protégées

// Ajoute un nouveau produit
router.post("/", verifierToken, verifierAdmin, addProduit);

// Modifie un produit existant
router.put("/:id", verifierToken, verifierAdmin, editProduit);

// Supprime un produit
router.delete("/:id", verifierToken, verifierAdmin, removeProduit);

// --------------------- tester sans auth ---------------------
// Ajoute un nouveau produit
router.post("/", addProduit);
// Modifie un produit existant
router.put("/:id", editProduit);
// Supprime un produit
router.delete("/:id", removeProduit);
// -------------------------------------------------------------

export default router;
