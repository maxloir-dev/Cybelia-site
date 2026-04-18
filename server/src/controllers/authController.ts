import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	getUserByEmail,
	createUser,
	getUserById,
	getUserByIdWithPassword,
	updateUser,
	updatePassword,
} from "../models/utilisateurModel";
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
		res.json({ token, role_id: utilisateur.role_id });
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

// Déconnexion

// Déconnexion de l'utilisateur — le token est supprimé côté client (React)
export const logout = async (req: AuthRequest, res: Response) => {
	try {
		res.json({ message: "Déconnexion réussie" });
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de la déconnexion" });
	}
};
