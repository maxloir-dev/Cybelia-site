import type { Utilisateur } from "../types";
import api from "./axios";

// Appels API liés à l'authentification

// Inscription d'un nouvel utilisateur
export const register = async (
	nom: string,
	prenom: string,
	email: string,
	mot_de_passe: string,
): Promise<{ message: string; id: number }> => {
	const response = await api.post("/auth/register", {
		nom,
		prenom,
		email,
		mot_de_passe,
	});
	return response.data;
};

// Connexion d'un utilisateur
export const login = async (
	email: string,
	mot_de_passe: string,
): Promise<{ token: string; role_id: number; id: number }> => {
	const response = await api.post("/auth/login", { email, mot_de_passe });
	return response.data;
};

// Déconnexion — supprime le token du localStorage
export const logout = async (): Promise<{ message: string }> => {
	const response = await api.post("/auth/logout");
	localStorage.removeItem("token");
	return response.data;
};

// Récupère le profil de l'utilisateur connecté
export const getProfil = async (): Promise<Utilisateur> => {
	const response = await api.get("/auth/profil");
	return response.data;
};

// Met à jour le profil de l'utilisateur connecté
export const updateProfil = async (
	nom: string,
	prenom: string,
	email: string,
): Promise<{ message: string }> => {
	const response = await api.put("/auth/profil", { nom, prenom, email });
	return response.data;
};

// Change le mot de passe de l'utilisateur connecté
export const updateMotDePasse = async (
	ancien_mot_de_passe: string,
	nouveau_mot_de_passe: string,
): Promise<{ message: string }> => {
	const response = await api.put("/auth/mot-de-passe", {
		ancien_mot_de_passe,
		nouveau_mot_de_passe,
	});
	return response.data;
};
