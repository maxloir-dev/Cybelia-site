import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import type { ReactNode } from "react";
import { getProfil } from "../api/authService";

// Types

interface Utilisateur {
	id: number;
	role_id: number;
	nom: string;
	prenom: string;
}

interface AuthContextType {
	utilisateur: Utilisateur | null;
	token: string | null;
	estConnecte: boolean;
	estAdmin: boolean;
	connexion: (token: string, role_id: number, id: number) => void;
	deconnexion: () => void;
}

// Création du contexte

const AuthContext = createContext<AuthContextType | null>(null);

// Provider — enveloppe toute l'application

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token"),
	);
	const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);

	// Fonction pour aller chercher les infos réelles (nom/prénom) sur l'API
	const chargerProfilComplet = useCallback(async () => {
		try {
			const data = await getProfil();
			setUtilisateur(data);
		} catch (error) {
			console.error("Erreur lors du chargement du profil:", error);
			// Optionnel : deconnexion();
		}
	}, []);

	// Au chargement — on récupère les infos du localStorage
	useEffect(() => {
		const tokenStocke = localStorage.getItem("token");

		if (tokenStocke) {
			setToken(tokenStocke);
			// Au lieu de juste mettre l'ID, on va chercher tout le profil sur l'API
			chargerProfilComplet();
		}
	}, [chargerProfilComplet]);

	// Connexion — stocke le token et les infos dans localStorage
	const connexion = async (token: string, role_id: number, id: number) => {
		localStorage.setItem("token", token);
		localStorage.setItem("role_id", String(role_id));
		localStorage.setItem("id", String(id));
		setToken(token);
		await chargerProfilComplet();
	};

	// Déconnexion — supprime tout du localStorage
	const deconnexion = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("role_id");
		localStorage.removeItem("id");
		setToken(null);
		setUtilisateur(null);
	};

	return (
		<AuthContext.Provider
			value={{
				utilisateur,
				token,
				estConnecte: !!token,
				estAdmin: utilisateur?.role_id === 1,
				connexion,
				deconnexion,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Hook personnalisé pour utiliser le contexte

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth doit être utilisé dans un AuthProvider");
	}
	return context;
};
