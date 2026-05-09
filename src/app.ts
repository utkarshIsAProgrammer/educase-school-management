import express, { Request, Response, NextFunction } from "express";
import schoolRoutes from "./routes/schoolRoutes";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", schoolRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(`ERROR: ${err.message}`);
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

// Health Check Endpoint
app.get("/health", (req: Request, res: Response) => {
	res.status(200).send("API is healthy");
});

app.get("/", (req: Request, res: Response) => {
	res.send("School Management API");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
