import { Router } from "express";
import { getProduits, getProduit } from "../controllers/produitController";

const router = Router();

router.get("/", getProduits); // retourne tous les produits
router.get("/:id", getProduit); // retourne un produit par son ID

export default router;
