import { Router } from "express";
import { getProduits, getProduit, addProduit, editProduit, removeProduit } from "../controllers/produitController";

const router = Router();

router.get("/", getProduits); // retourne tous les produits
router.get("/:id", getProduit); // retourne un produit par son ID
router.post("/", addProduit);
router.put("/:id", editProduit); // modifie un produit par son ID
router.delete("/:id", removeProduit); // supprime un produit par son ID

export default router;
