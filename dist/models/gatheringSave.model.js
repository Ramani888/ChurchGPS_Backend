"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatheringSave = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env = process.env;
const GatheringSaveSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    gatheringId: {
        type: String,
        required: true
    },
}, { timestamps: true });
const dbConnection = mongoose_1.default.connection.useDb(env.DATABASE_NAME ?? '');
exports.GatheringSave = dbConnection.model('GatheringSave', GatheringSaveSchema, 'GatheringSave');
