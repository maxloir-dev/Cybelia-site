import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser } from "../models/utilisateurModel";

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
