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
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket");
// ------------------ ENVIRONMENT ------------------ //
dotenv_1.default.config(); // Load environment variables from .env
// ------------------ DB CONNECTION ------------------ //
const app = (0, express_1.default)();
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://CVLCluster1:Ramani%407258@atlascluster.g9ls9b9.mongodb.net/ChurchGPS";
mongoose_1.default.connect(mongoUri);
const database = mongoose_1.default.connection;
database.on("error", (error) => {
    console.error("❌ MongoDB connection error:", error);
});
database.once("connected", () => {
    console.log("✅ Database Connected");
});
// ------------------ MIDDLEWARES ------------------ //
app.use((0, helmet_1.default)()); // Secure HTTP headers
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL || "*" })); // CORS policy
app.use(express_1.default.json({ limit: "10kb" })); // Limit JSON payload size
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" })); // Limit URL-encoded payload size
// Logging (development only)
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// ------------------ ROUTES ------------------ //
app.get("/", (req, res) => {
    res.json({ message: "Hello from Secure Node.js + TypeScript API 🚀" });
});
app.use("/api", routes_1.default); // Main API routes
// ------------------ ERROR HANDLING ------------------ //
app.use((err, req, res, next) => {
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
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
// ------------------ SERVER LISTEN ------------------ //
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
    console.log(`🚀 Server running securely on http://localhost:${PORT}`);
});
