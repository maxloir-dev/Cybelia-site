import { Request, Response } from "express";
import {
	getAllProduits,
	getProduitById,
	createProduit,
	updateProduit,
	deleteProduit,
	getProduitsByCategorie,
} from "../models/produitModel";

// Routes publiques (tout le monde peut voir)

// Récupère tous les produits avec leur catégorie
export const getProduits = async (req: Request, res: Response) => {
	try {
		const categorieId = req.query.categorie_id
			? Number(req.query.categorie_id)
			: undefined;
		const produits = await getAllProduits(categorieId);
		res.json(produits);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des produits" });
	}
};

// Récupère un seul produit par son id
export const getProduit = async (req: Request, res: Response) => {
	try {
		const produit = await getProduitById(Number(req.params.id));
		if (!produit) {
			res.status(404).json({ message: "Produit non trouvé" });
		} else {
			res.json(produit);
		}
	} catch (error) {
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
	} catch (error) {
		res.status(500).json({
			message: "Erreur lors de la récupération des produits par catégorie",
		});
	}
};

// Routes protégées

// Ajoute un nouveau produit
export const addProduit = async (req: Request, res: Response) => {
	try {
		const { nom, description, prix, image_url, categorie_id } = req.body;
		const id = await createProduit(
			nom,
			description,
			prix,
			image_url,
			categorie_id,
		);
		res.status(201).json({ message: "Produit créé avec succès", id });
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de la création du produit" });
	}
};

// Modifie un produit existant par son id
export const editProduit = async (req: Request, res: Response) => {
	try {
		const { nom, description, prix, image_url, categorie_id } = req.body;
		await updateProduit(
			Number(req.params.id),
			nom,
			description,
			prix,
			image_url,
			categorie_id,
		);
		res.json({ message: "Produit modifié avec succès" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la modification du produit" });
	}
};

// Supprime un produit par son id
export const removeProduit = async (req: Request, res: Response) => {
	try {
		await deleteProduit(Number(req.params.id));
		res.json({ message: "Produit supprimé avec succès" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la suppression du produit" });
	}
};
