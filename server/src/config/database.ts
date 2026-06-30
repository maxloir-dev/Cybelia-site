import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Si DATABASE_URL est défini (ex. URL publique fournie par Railway, avec le
// port), on l'utilise tel quel. Sinon, on retombe sur les variables séparées
// (utile en local).
const pool = process.env.DATABASE_URL
	? mysql.createPool(process.env.DATABASE_URL)
	: mysql.createPool({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			waitForConnections: true,
			connectionLimit: 10,
		});

export default pool;
