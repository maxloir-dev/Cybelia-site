import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Types

interface Utilisateur {
	id: number;
	role_id: number;
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

	// Au chargement — on récupère les infos du localStorage
	useEffect(() => {
		const tokenStocke = localStorage.getItem("token");
		const roleStocke = localStorage.getItem("role_id");
		const idStocke = localStorage.getItem("id");

		if (tokenStocke && roleStocke && idStocke) {
			setToken(tokenStocke);
			setUtilisateur({
				id: Number(idStocke),
				role_id: Number(roleStocke),
			});
		}
	}, []);

	// Connexion — stocke le token et les infos dans localStorage
	const connexion = (token: string, role_id: number, id: number) => {
		localStorage.setItem("token", token);
		localStorage.setItem("role_id", String(role_id));
		localStorage.setItem("id", String(id));
		setToken(token);
		setUtilisateur({ id, role_id });
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
