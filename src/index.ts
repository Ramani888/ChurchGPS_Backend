import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from './routes/routes'
import mongoose from "mongoose";


// Load environment variables from .env
dotenv.config();

const app: Application = express();
const mongoUri = process.env.DATABASE_URL || 'mongodb+srv://CVLCluster1:Ramani%407258@atlascluster.g9ls9b9.mongodb.net/FlashCard';

mongoose.connect(mongoUri);
const database = mongoose.connection;

database.on('error', (error: any) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

// ✅ Security Middlewares
app.use(helmet()); // sets secure HTTP headers
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // restrict origins if needed
app.use(express.json({ limit: "10kb" })); // prevent large payloads
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // secure URL-encoded parser

// ✅ Logging (development only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per window
//   message: "Too many requests, please try again later.",
// });
// app.use(limiter);

// ✅ Example Route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Secure Node.js + TypeScript API 🚀" });
});

// ✅ Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// ✅ Api
app.use("/api", routes)

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});


// Export Express app for Vercel serverless function
export default app;
