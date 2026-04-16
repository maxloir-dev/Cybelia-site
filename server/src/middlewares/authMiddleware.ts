import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// On étend le type Request pour pouvoir y ajouter l'utilisateur connecté
export interface AuthRequest extends Request {
	utilisateur?: {
		id: number;
		role_id: number;
	};
}

// Vérifie que l'utilisateur est connecté
export const verifierToken = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): void => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "Accès refusé, token manquant" });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			id: number;
			role_id: number;
		};
		req.utilisateur = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Token invalide ou expiré" });
	}
};

// Vérifie que l'utilisateur est admin
export const verifierAdmin = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): void => {
	if (req.utilisateur?.role_id !== 1) {
		res.status(403).json({ message: "Accès refusé, droits insuffisants" });
		return;
	}
	next();
};
