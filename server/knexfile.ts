import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

// ============================================
// Configuration de Knex pour les migrations
// ============================================
const config: { [key: string]: Knex.Config } = {
	// Environnement de développement
	development: {
		client: "mysql2",
		connection: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		},
		// Dossier où seront stockées les migrations
		migrations: {
			directory: "./src/migrations",
			extension: "ts",
		},
	},

	// Environnement de production
	production: {
		client: "mysql2",
		connection: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		},
		migrations: {
			directory: "./src/migrations",
			extension: "ts",
		},
	},
};

export default config;
