import express from "express"; // Framework web
import cors from "cors"; // Autorise React à communiquer avec le serveur
import helmet from "helmet"; // Headers HTTP de sécurité
import rateLimit from "express-rate-limit"; // Protection brute-force
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
import dimensionRoutes from "./routes/dimensionRoutes"; // Routes /api/dimensions
import stripeRoutes from "./routes/stripeRoutes";
import { handleWebhook } from "./controllers/stripeController";

// Chargement des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globaux

app.use(helmet()); // Headers HTTP de sécurité (CSP, X-Frame-Options, etc.)
app.use(cors({
	origin: process.env.CLIENT_URL,
	methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Webhook Stripe : DOIT être monté avant express.json() car la vérification
// de signature exige le body brut (Buffer), non parsé en JSON.
app.post(
	"/api/stripe/webhook",
	express.raw({ type: "application/json" }),
	handleWebhook,
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Rate limiting sur les routes sensibles
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 15,
	message: { message: "Trop de tentatives, réessayez dans 15 minutes." },
	standardHeaders: true,
	legacyHeaders: false,
});

const contactLimiter = rateLimit({
	windowMs: 30 * 60 * 1000,
	max: 3,
	message: { message: "Trop de messages envoyés, réessayez dans 30 minutes." },
	standardHeaders: true,
	legacyHeaders: false,
});

// Routes

app.use("/api/produits", produitRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/dimensions", dimensionRoutes);
app.use("/api/stripe", stripeRoutes);

// Route de vérification que le serveur tourne
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

// Filet de sécurité : capture toute erreur non gérée par un try/catch dans une route
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
	console.error("ERREUR NON GÉRÉE:", err);
	res.status(500).json({ message: "Erreur serveur inattendue" });
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
