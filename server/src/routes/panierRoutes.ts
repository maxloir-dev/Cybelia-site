import { Router } from "express";
import { estimerPanier } from "../controllers/panierController";

const router = Router();

// POST /api/panier/estimation — montants recalculés côté serveur (public :
// le panier est consultable sans être connecté)
router.post("/estimation", estimerPanier);

export default router;
