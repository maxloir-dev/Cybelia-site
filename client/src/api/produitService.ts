import type { Produit } from "../types";
import api from "./axios";

// Appels API liés aux produits

// Récupère tous les produits
export const getProduits = async (): Promise<Produit[]> => {
	const response = await api.get("/produits");
	return response.data;
};

// Récupère un produit par son id
export const getProduitById = async (id: number): Promise<Produit> => {
	const response = await api.get(`/produits/${id}`);
	return response.data;
};

// Récupère les produits par catégorie
export const getProduitsByCategorie = async (
	id: number,
): Promise<Produit[]> => {
	const response = await api.get(`/produits/categorie/${id}`);
	return response.data;
};

// Ajoute un nouveau produit (gérante)
export const addProduit = async (
	produit: FormData,
): Promise<{ message: string; id: number }> => {
	const response = await api.post("/produits", produit);
	return response.data;
};

// Modifie un produit (gérante)
export const updateProduit = async (
	id: number,
	produit: FormData,
): Promise<{ message: string }> => {
	const response = await api.put(`/produits/${id}`, produit);
	return response.data;
};

// Supprime un produit (gérante)
export const deleteProduit = async (
	id: number,
): Promise<{ message: string }> => {
	const response = await api.delete(`/produits/${id}`);
	return response.data;
};
