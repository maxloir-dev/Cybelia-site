import { Router } from "express";
import { getCategories } from "../controllers/categorieController";

const router = Router();

// Récupère toutes les catégories
router.get("/", getCategories);

export default router;
