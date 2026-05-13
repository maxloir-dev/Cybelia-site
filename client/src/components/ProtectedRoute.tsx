import { useAuth } from "../store/AuthContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

// Composant de protection des routes

interface ProtectedRouteProps {
	children: ReactNode;
	adminSeulement?: boolean; // Si true, seule la gérante peut accéder
}

const ProtectedRoute = ({
	children,
	adminSeulement = false,
}: ProtectedRouteProps) => {
	const { estConnecte, estAdmin } = useAuth();

	// Si pas connecté → redirige vers la page de connexion
	if (!estConnecte) {
		return <Navigate to="/login" />;
	}

	// Si la page est réservée à l'admin et que l'utilisateur n'est pas admin
	if (adminSeulement && !estAdmin) {
		return <Navigate to="/" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
