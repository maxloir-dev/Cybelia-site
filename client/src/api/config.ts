// URL de base de l'API.
// En production (Netlify), définir VITE_API_URL = https://VOTRE-URL-RAILWAY/api
// En développement, repli automatique sur le serveur local.
export const API_URL =
	import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";
