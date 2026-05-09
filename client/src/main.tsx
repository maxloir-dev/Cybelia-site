import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./styles.css";
import { AuthProvider } from "./store/AuthContext.tsx";

const rootElement = document.getElementById("root");

// On vérifie si l'élément existe vraiment
if (!rootElement) {
	throw new Error(
		"L'élément racine 'root' est introuvable. Assurez-vous qu'il existe dans votre index.html.",
	);
}

createRoot(rootElement).render(
	<StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</StrictMode>,
);
