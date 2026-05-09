"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schoolRoutes_1 = __importDefault(require("./routes/schoolRoutes"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", schoolRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`ERROR: ${err.message}`);
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
// Basic route for the root URL
app.get("/", (req, res) => {
    res.send("School Management API");
});
// Function to start the server and connect to the database
const startServer = async () => {
    try {
        await db_1.default.query("SELECT 1");
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
};
startServer();
