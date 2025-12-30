"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Community = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env = process.env;
const CommunitySchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
}, { timestamps: true });
const dbConnection = mongoose_1.default.connection.useDb(env.DATABASE_NAME ?? '');
exports.Community = dbConnection.model('Community', CommunitySchema, 'Community');
