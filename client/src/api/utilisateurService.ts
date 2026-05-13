import type { Utilisateur, Commande } from "../types";
import api from "./axios";

// Appels API liés aux utilisateurs (gérante)

// Récupère tous les clients
export const getAllUtilisateurs = async (): Promise<Utilisateur[]> => {
	const response = await api.get("/utilisateurs");
	return response.data;
};

// Récupère l'historique des commandes d'un client
export const getHistoriqueClient = async (id: number): Promise<Commande[]> => {
	const response = await api.get(`/utilisateurs/${id}/commandes`);
	return response.data;
};
