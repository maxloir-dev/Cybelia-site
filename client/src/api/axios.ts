import axios from "axios";

// Configuration de base d'axios

const api = axios.create({
	baseURL: "http://localhost:3001/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Intercepteur de requête
// Ajoute automatiquement le token à chaque requête

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Intercepteur de réponse
// Gère les erreurs globalement

api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Si le token est expiré ou invalide → on déconnecte l'utilisateur
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export default api;
