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
const mongoUri = process.env.DATABASE_URL || 'mongodb+srv://CVLCluster1:Ramani%407258@atlascluster.g9ls9b9.mongodb.net/FlashCard';
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
app.use((req, res) => res.status(404).json("API route not found"));
app.use('/api', routes_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
