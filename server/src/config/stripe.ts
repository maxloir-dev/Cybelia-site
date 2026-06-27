import dotenv from "dotenv";
dotenv.config(); // garantit que la clé est chargée même si ce module est importé tôt

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
	// Fail-fast : mieux vaut un crash au démarrage qu'un 400 silencieux à chaque paiement
	throw new Error("STRIPE_SECRET_KEY manquante dans l'environnement (.env)");
}

// Instance unique de Stripe, réutilisée par toute l'application.
// apiVersion épinglée : évite qu'une montée de version Stripe modifie le
// comportement de l'API sans qu'on l'ait validé.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2026-05-27.dahlia",
});

export default stripe;
