import { Router } from "express";
import { verifierToken } from "../middlewares/authMiddleware";
import { createPaymentIntent } from "../controllers/stripeController";

const router = Router();

// Création du PaymentIntent — réservée aux utilisateurs connectés
// (le webhook a besoin de l'utilisateur_id pour rattacher la commande).
// NB : la route /webhook n'est PAS ici : elle est montée dans index.ts avec
// express.raw() car la vérification de signature exige le body brut.
router.post("/create-payment-intent", verifierToken, createPaymentIntent);

export default router;
