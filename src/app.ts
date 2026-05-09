import express, { Request, Response, NextFunction } from "express";
import schoolRoutes from "./routes/schoolRoutes";
import "dotenv/config";
import cors from "cors";
import pool from "./config/db";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", schoolRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(`ERROR: ${err.message}`);
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

// Basic route for the root URL
app.get("/", (req: Request, res: Response) => {
	res.send("School Management API");
});

// Function to start the server and connect to the database
const startServer = async () => {
	try {
		await pool.query("SELECT 1");
		console.log("Database connected successfully");

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to connect to database:", error);
		process.exit(1);
	}
};

startServer();
