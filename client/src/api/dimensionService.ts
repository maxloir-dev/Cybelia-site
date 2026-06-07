import type { Dimension } from "../types";
import api from "./axios";

// Référentiel complet des formats disponibles
export const getAllDimensions = async (): Promise<Dimension[]> => {
	const response = await api.get("/dimensions");
	return response.data;
};

// Dimensions (avec prix) disponibles pour un produit donné
export const getDimensionsByProduit = async (produitId: number): Promise<Dimension[]> => {
	const response = await api.get(`/produits/${produitId}/dimensions`);
	return response.data;
};

// Associe ou met à jour le prix d'une dimension pour un produit (admin)
export const upsertDimensionProduit = async (
	produitId: number,
	dimension_id: number,
	prix: number,
): Promise<{ message: string }> => {
	const response = await api.post(`/produits/${produitId}/dimensions`, { dimension_id, prix });
	return response.data;
};

// Supprime une dimension d'un produit (admin)
export const deleteDimensionProduit = async (
	produitId: number,
	dimensionId: number,
): Promise<{ message: string }> => {
	const response = await api.delete(`/produits/${produitId}/dimensions/${dimensionId}`);
	return response.data;
};
