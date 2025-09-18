"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes/routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const cors = require('cors');
const port = process.env.PORT || 3010;
const mongoUri = process.env.DATABASE_URL;
if (!mongoUri) {
    throw new Error('DATABASE_URL environment variable is not set.');
}
mongoose_1.default.connect(mongoUri);
const database = mongoose_1.default.connection;
database.on('error', (error) => {
    console.log(error);
});
database.once('connected', () => {
    console.log('Database Connected');
});
app.use(cors());
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.use((req, res) => res.json("API route not found"));
app.get('/', (req, res) => res.json("server working...."));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
