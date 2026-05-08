import express from "express"; // Framework web
import cors from "cors"; // Autorise React à communiquer avec le serveur
import dotenv from "dotenv"; // Charge les variables d'environnement (.env)

// Imports de la config
import pool from "./config/database"; // Connexion à MySQL

// Imports des routes
import produitRoutes from "./routes/produitRoutes"; // Routes /api/produits
import authRoutes from "./routes/authRoutes"; // Routes /api/auth
import commandeRoutes from "./routes/commandeRoutes"; // Routes /api/commandes
import utilisateurRoutes from "./routes/utilisateurRoutes"; // Routes /api/utilisateurs
import categorieRoutes from "./routes/categorieRoutes"; // Routes /api/categories
import uploadRoutes from "./routes/uploadRoutes"; // Routes /api/upload
import contactRoutes from "./routes/contactRoutes"; // Routes /api/contact

// Chargement des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globaux

app.use(cors()); // Autorise les requêtes venant de React
app.use(express.json()); // Permet de lire le JSON dans les requêtes

// Routes

app.use("/api/produits", produitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);

// Route de vérification que le serveur tourne
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

// Connexion à MySQL

pool
	.getConnection()
	.then((connection) => {
		console.log("✅ Connecté à MySQL - base de données Cybelia");
		connection.release(); // Libère la connexion après le test
	})
	.catch((error) => {
		console.error("❌ Erreur de connexion MySQL :", error.message);
	});

// Démarrage du serveur

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
