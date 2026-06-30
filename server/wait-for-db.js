// Attend que la base de données soit joignable avant de lancer les migrations.
//
// Sur Railway, le réseau privé (`*.railway.internal`) met quelques secondes à
// s'initialiser au démarrage du conteneur. Une connexion lancée immédiatement
// échoue alors avec `ENOTFOUND`. Ce script réessaie jusqu'à ce que la base
// réponde, puis rend la main (exit 0). En local, la base répond du premier coup.

const mysql = require("mysql2/promise");

const MAX_TENTATIVES = 30; // 30 × 2 s = jusqu'à 60 s d'attente
const DELAI_MS = 2000;

async function attendreLaBase() {
	for (let tentative = 1; tentative <= MAX_TENTATIVES; tentative++) {
		try {
			const connexion = process.env.DATABASE_URL
				? await mysql.createConnection(process.env.DATABASE_URL)
				: await mysql.createConnection({
						host: process.env.DB_HOST,
						user: process.env.DB_USER,
						password: process.env.DB_PASSWORD,
						database: process.env.DB_NAME,
						port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
						connectTimeout: 5000,
					});
			await connexion.end();
			console.log(`✅ Base joignable (tentative ${tentative}). Lancement des migrations.`);
			process.exit(0);
		} catch (err) {
			const code = err.code || err.message;
			console.log(
				`⏳ Base pas encore prête (tentative ${tentative}/${MAX_TENTATIVES}) : ${code}`,
			);
			await new Promise((resolve) => setTimeout(resolve, DELAI_MS));
		}
	}
	console.error("❌ Base injoignable après 60 s d'attente — abandon.");
	process.exit(1);
}

attendreLaBase();
