import type { Request, Response } from "express";
import {
	createProduit,
	deleteProduit,
	getAllProduits,
	getProduitById,
	getProduitsByCategorie,
	updateProduit,
} from "../models/produitModel";

// Routes publiques (tout le monde peut voir)

// Récupère tous les produits avec leur catégorie
export const getProduits = async (req: Request, res: Response) => {
	try {
		const categorieId = req.query.categorie_id ? Number(req.query.categorie_id) : undefined;
		const dimensionId = req.query.dimension_id ? Number(req.query.dimension_id) : undefined;
		const produits = await getAllProduits(categorieId, dimensionId);
		res.json(produits);
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des produits" });
	}
};

// Récupère un seul produit par son id
export const getProduit = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		if (Number.isNaN(id)) {
			res.status(400).json({ message: "ID de produit invalide" });
			return;
		}
		const produit = await getProduitById(id);
		if (!produit) {
			res.status(404).json({ message: "Produit non trouvé" });
		} else {
			res.json(produit);
		}
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération du produit" });
	}
};
// Récupère les produits par catégorie
export const getProduitsByCategorieid = async (req: Request, res: Response) => {
	try {
		const produits = await getProduitsByCategorie(Number(req.params.id));
		res.json(produits);
	} catch {
		res.status(500).json({
			message: "Erreur lors de la récupération des produits par catégorie",
		});
	}
};

// Routes protégées

// Ajoute un nouveau produit
export const addProduit = async (req: Request, res: Response) => {
	try {
		const { nom, description, prix, image_url, mockup_url, categorie_id } =
			req.body;
		const id = await createProduit(
			nom,
			description,
			prix,
			image_url,
			categorie_id,
			mockup_url,
		);
		res.status(201).json({ message: "Produit créé avec succès", id });
	} catch {
		res.status(500).json({ message: "Erreur lors de la création du produit" });
	}
};

// Modifie un produit existant par son id
export const editProduit = async (req: Request, res: Response) => {
	try {
		const { nom, description, prix, image_url, mockup_url, categorie_id } =
			req.body;
		await updateProduit(
			Number(req.params.id),
			nom,
			description,
			prix,
			image_url,
			categorie_id,
			mockup_url,
		);
		res.json({ message: "Produit modifié avec succès" });
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la modification du produit" });
	}
};

// Désactive un produit (soft delete)
export const removeProduit = async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		if (Number.isNaN(id)) {
			res.status(400).json({ message: "ID de produit invalide" });
			return;
		}
		await deleteProduit(id);
		res.json({ message: "Produit désactivé avec succès" });
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la suppression du produit" });
	}
};
