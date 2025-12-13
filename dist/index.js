"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes/routes"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables from .env
dotenv_1.default.config();
const app = (0, express_1.default)();
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://CVLCluster1:Ramani%407258@atlascluster.g9ls9b9.mongodb.net/ChurchGPS';
mongoose_1.default.connect(mongoUri);
const database = mongoose_1.default.connection;
database.on('error', (error) => {
    console.log(error);
});
database.once('connected', () => {
    console.log('Database Connected');
});
// ✅ Security Middlewares
app.use((0, helmet_1.default)()); // sets secure HTTP headers
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL || "*" })); // restrict origins if needed
app.use(express_1.default.json({ limit: "10kb" })); // prevent large payloads
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" })); // secure URL-encoded parser
// ✅ Logging (development only)
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// ✅ Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per window
//   message: "Too many requests, please try again later.",
// });
// app.use(limiter);
// ✅ Example Route
app.get("/", (req, res) => {
    res.json({ message: "Hello from Secure Node.js + TypeScript API 🚀" });
});
// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
});
// ✅ Api
const basePath = process.env.NODE_ENV === "production" ? "/" : "/api";
app.use(basePath, routes_1.default);
// Catch-all route for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "API route not found" });
});
// ✅ Server Listen
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`🚀 Server running securely on http://localhost:${PORT}`);
});
