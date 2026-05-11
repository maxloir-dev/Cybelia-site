import { Router } from "express";
import {
	register,
	login,
	getProfil,
	updateProfil,
	logout,
	updateMotDePasse,
	forgotPassword,
	resetPassword,
} from "../controllers/authController";
import { verifierToken } from "../middlewares/authMiddleware";

const router = Router();

// Routes d'authentification

// Inscription d'un nouveau client
router.post("/register", register);

// Connexion d'un utilisateur
router.post("/login", login);

// Routes profil (client connecté)

// Récupère le profil de l'utilisateur connecté
router.get("/profil", verifierToken, getProfil);

// Met à jour le profil de l'utilisateur connecté
router.put("/profil", verifierToken, updateProfil);

// Déconnexion
router.post("/logout", verifierToken, logout);

// Change le mot de passe de l'utilisateur connecté
router.put("/mot-de-passe", verifierToken, updateMotDePasse);

// Mot de passe oublié — envoie l'email
router.post("/forgot-password", forgotPassword);

// Réinitialise le mot de passe avec le token
router.post("/reset-password", resetPassword);

export default router;
