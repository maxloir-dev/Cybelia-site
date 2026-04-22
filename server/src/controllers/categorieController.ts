import { Request, Response } from "express";
import { getAllCategories } from "../models/categorieModel";

// Récupère toutes les catégories (public)
export const getCategories = async (req: Request, res: Response) => {
	try {
		const categories = await getAllCategories();
		res.json(categories);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des catégories" });
	}
};
