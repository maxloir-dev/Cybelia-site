import type { Request, Response } from "express";
import {
	deleteProduitDimension,
	getAllDimensions,
	getDimensionsByProduitId,
	upsertProduitDimension,
} from "../models/dimensionModel";

// GET /api/produits/:id/dimensions — public
export const getDimensionsProduit = async (req: Request, res: Response) => {
	try {
		const dimensions = await getDimensionsByProduitId(Number(req.params.id));
		res.json(dimensions);
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des dimensions" });
	}
};

// GET /api/dimensions — public (référentiel complet)
export const getDimensions = async (_req: Request, res: Response) => {
	try {
		const dimensions = await getAllDimensions();
		res.json(dimensions);
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des dimensions" });
	}
};

// POST /api/produits/:id/dimensions — admin
// body: { dimension_id, prix }
export const upsertDimensionProduit = async (req: Request, res: Response) => {
	try {
		const produit_id = Number(req.params.id);
		const { dimension_id, prix } = req.body;

		if (!dimension_id || prix == null || Number(prix) < 0) {
			res
				.status(400)
				.json({ message: "dimension_id et prix (≥ 0) sont requis" });
			return;
		}

		await upsertProduitDimension(
			produit_id,
			Number(dimension_id),
			Number(prix),
		);
		res.json({ message: "Dimension enregistrée" });
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de l'enregistrement de la dimension" });
	}
};

// DELETE /api/produits/:id/dimensions/:dimensionId — admin
export const removeDimensionProduit = async (req: Request, res: Response) => {
	try {
		await deleteProduitDimension(
			Number(req.params.id),
			Number(req.params.dimensionId),
		);
		res.json({ message: "Dimension supprimée" });
	} catch {
		res
			.status(500)
			.json({ message: "Erreur lors de la suppression de la dimension" });
	}
};
