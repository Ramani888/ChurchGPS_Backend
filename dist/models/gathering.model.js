"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gathering = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env = process.env;
const GatheringSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        required: true
    },
    locationTypes: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    groupName: {
        type: String,
        required: true,
    },
    groupPicture: {
        type: String,
        required: false,
    },
    denomination: {
        type: String,
        required: true,
    },
    protestantDenomination: {
        type: String,
        required: false,
    },
    otherDenomination: {
        type: String,
        required: false,
    },
    locationPrivacy: {
        type: String,
        required: true,
    },
    radius: {
        type: Number,
        required: true,
    },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
}, { timestamps: true });
const dbConnection = mongoose_1.default.connection.useDb(env.DATABASE_NAME ?? '');
exports.Gathering = dbConnection.model('Gathering', GatheringSchema, 'Gathering');
