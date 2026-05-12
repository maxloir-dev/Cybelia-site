import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
	getUserByEmail,
	createUser,
	getUserById,
	getUserByIdWithPassword,
	updateUser,
	updatePassword,
	setResetToken,
	getUserByResetToken,
	clearResetToken,
} from "../models/utilisateurModel";
import { envoyerEmailReinitialisation } from "../config/email";
import { AuthRequest } from "../middlewares/authMiddleware";

// Authentification

// Inscription d'un nouvel utilisateur
export const register = async (req: Request, res: Response) => {
	try {
		const { nom, prenom, email, mot_de_passe } = req.body;

		// Vérifier si l'email existe déjà
		const utilisateurExistant = await getUserByEmail(email);
		if (utilisateurExistant) {
			res.status(400).json({ message: "Cet email est déjà utilisé" });
			return;
		}

		// Hasher le mot de passe
		const hash = await bcrypt.hash(mot_de_passe, 10);

		// Créer l'utilisateur
		const id = await createUser(nom, prenom, email, hash);
		res.status(201).json({ message: "Compte créé avec succès", id });
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de l'inscription" });
	}
};

// Connexion d'un utilisateur
export const login = async (req: Request, res: Response) => {
	try {
		const { email, mot_de_passe } = req.body;

		// Vérifier si l'utilisateur existe
		const utilisateur = await getUserByEmail(email);
		if (!utilisateur) {
			res.status(401).json({ message: "Email ou mot de passe incorrect" });
			return;
		}

		// Vérifier le mot de passe
		const motDePasseValide = await bcrypt.compare(
			mot_de_passe,
			utilisateur.mot_de_passe,
		);
		if (!motDePasseValide) {
			res.status(401).json({ message: "Email ou mot de passe incorrect" });
			return;
		}

		// Générer le token
		const token = jwt.sign(
			{ id: utilisateur.id, role_id: utilisateur.role_id },
			process.env.JWT_SECRET as string,
			{ expiresIn: "7d" },
		);
		res.json({ token, role_id: utilisateur.role_id, id: utilisateur.id });
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de la connexion" });
	}
};

// Profil utilisateur

// Récupère le profil de l'utilisateur connecté (sans mot de passe)
export const getProfil = async (req: AuthRequest, res: Response) => {
	try {
		const utilisateur = await getUserById(req.utilisateur!.id);
		if (!utilisateur) {
			res.status(404).json({ message: "Utilisateur non trouvé" });
		} else {
			res.json(utilisateur);
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération du profil" });
	}
};

// Met à jour le profil de l'utilisateur connecté
export const updateProfil = async (req: AuthRequest, res: Response) => {
	try {
		const { nom, prenom, email } = req.body;
		await updateUser(req.utilisateur!.id, nom, prenom, email);
		res.json({ message: "Profil mis à jour avec succès" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la mise à jour du profil" });
	}
};

// Mot de passe

// Change le mot de passe de l'utilisateur connecté
export const updateMotDePasse = async (req: AuthRequest, res: Response) => {
	try {
		const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;

		// Récupère uniquement le mot de passe hashé de l'utilisateur connecté
		const utilisateur = await getUserByIdWithPassword(req.utilisateur!.id);

		// Vérifie que l'ancien mot de passe est correct
		const motDePasseValide = await bcrypt.compare(
			ancien_mot_de_passe,
			utilisateur.mot_de_passe,
		);
		if (!motDePasseValide) {
			res.status(401).json({ message: "Ancien mot de passe incorrect" });
			return;
		}

		// Hash du nouveau mot de passe
		const hash = await bcrypt.hash(nouveau_mot_de_passe, 10);

		// Met à jour le mot de passe
		await updatePassword(req.utilisateur!.id, hash);
		res.json({ message: "Mot de passe mis à jour avec succès" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la mise à jour du mot de passe" });
	}
};

// Réinitialisation du mot de passe

// Envoie un email avec un lien de réinitialisation
export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const utilisateur = await getUserByEmail(email);

		// On répond toujours OK pour ne pas révéler si l'email existe
		if (!utilisateur) {
			res.json({ message: "Si cet email existe, un lien a été envoyé." });
			return;
		}

		const token = crypto.randomBytes(32).toString("hex");
		const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

		await setResetToken(email, token, expires);
		await envoyerEmailReinitialisation(email, token);

		res.json({ message: "Si cet email existe, un lien a été envoyé." });
	} catch (error) {
		console.error("Erreur forgot-password:", error);
		res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
	}
};

// Réinitialise le mot de passe avec le token reçu par email
export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { token, nouveau_mot_de_passe } = req.body;

		const utilisateur = await getUserByResetToken(token);
		if (!utilisateur) {
			res.status(400).json({ message: "Lien invalide ou expiré." });
			return;
		}

		const hash = await bcrypt.hash(nouveau_mot_de_passe, 10);
		await updatePassword(utilisateur.id, hash);
		await clearResetToken(utilisateur.id);

		res.json({ message: "Mot de passe réinitialisé avec succès." });
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de la réinitialisation." });
	}
};

// Déconnexion

// Déconnexion de l'utilisateur — le token est supprimé côté client (React)
export const logout = async (_req: AuthRequest, res: Response) => {
	try {
		res.json({ message: "Déconnexion réussie" });
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de la déconnexion" });
	}
};
