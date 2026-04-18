import api from "./axios";
import type { Commande, LigneCommande } from "../types";

// Appels API liés aux commandes

// Passer une nouvelle commande
export const passerCommande = async (
	lignes: LigneCommande[],
): Promise<{ message: string; commande_id: number }> => {
	const response = await api.post("/commandes", { lignes });
	return response.data;
};

// Récupère les commandes du client connecté
export const getMesCommandes = async (): Promise<Commande[]> => {
	const response = await api.get("/commandes/mes-commandes");
	return response.data;
};

// Récupère toutes les commandes (gérante)
export const getAllCommandes = async (): Promise<Commande[]> => {
	const response = await api.get("/commandes");
	return response.data;
};

// Récupère le détail d'une commande (gérante)
export const getCommandeById = async (id: number): Promise<Commande> => {
	const response = await api.get(`/commandes/${id}`);
	return response.data;
};
