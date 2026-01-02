import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes/routes";
import mongoose from "mongoose";
import http from "http";
import { initSocket } from "./socket";


// ------------------ ENVIRONMENT ------------------ //
dotenv.config(); // Load environment variables from .env


// ------------------ DB CONNECTION ------------------ //
const app: Application = express();
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://CVLCluster1:Ramani%407258@atlascluster.g9ls9b9.mongodb.net/ChurchGPS";

mongoose.connect(mongoUri);
const database = mongoose.connection;
database.on("error", (error: any) => {
  console.error("❌ MongoDB connection error:", error);
});
database.once("connected", () => {
  console.log("✅ Database Connected");
});


// ------------------ MIDDLEWARES ------------------ //
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // CORS policy
app.use(express.json({ limit: "10kb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Limit URL-encoded payload size

// Logging (development only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ------------------ ROUTES ------------------ //
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Secure Node.js + TypeScript API 🚀" });
});

app.use("/api", routes); // Main API routes

// ------------------ ERROR HANDLING ------------------ //
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ------------------ SOCKET.IO ------------------ //
const server = http.createServer(app);
initSocket(server);

// ------------------ SERVER LISTEN ------------------ //
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`🚀 Server running securely on http://localhost:${PORT}`);
});
