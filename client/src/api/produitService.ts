import type { Produit } from "../types";
import api from "./axios";

// Appels API liés aux produits

// Récupère tous les produits (avec contournement du cache)
export const getProduits = async (): Promise<Produit[]> => {
	const response = await api.get(`/produits?_t=${Date.now()}`);
	return response.data;
};

// Récupère un produit par son id (avec contournement du cache)
export const getProduitById = async (id: number): Promise<Produit> => {
	const response = await api.get(`/produits/${id}?_t=${Date.now()}`);
	return response.data;
};

// Récupère les produits par catégorie (avec contournement du cache)
export const getProduitsByCategorie = async (
	id: number,
): Promise<Produit[]> => {
	const response = await api.get(`/produits/categorie/${id}?_t=${Date.now()}`);
	return response.data;
};

// Ajoute un nouveau produit (gérante)
export const addProduit = async (
	produit: FormData,
): Promise<{ message: string; id: number }> => {
	const response = await api.post("/produits", produit);
	return response.data;
};

// Champs modifiables d'un produit existant
type ProduitModifiable = Partial<
	Pick<
		Produit,
		"nom" | "description" | "prix" | "image_url" | "mockup_url" | "categorie_id"
	>
>;

// Modifie un produit (gérante)
export const updateProduit = async (
	id: number,
	produit: FormData | ProduitModifiable,
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
