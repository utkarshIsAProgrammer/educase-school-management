import mysql from "mysql2/promise";
import "dotenv/config";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME || !DB_PORT) {
	throw new Error("Missing required database environment variables.");
}

const pool = mysql.createPool({
	host: DB_HOST,
	port: Number(DB_PORT),
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,

	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,

	ssl: {
		rejectUnauthorized: false,
	},
});

export default pool;
