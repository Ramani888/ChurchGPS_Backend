import mongoose, { Schema } from "mongoose";
const env = process.env;

const GatheringSchema = new mongoose.Schema({
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

const dbConnection = mongoose.connection.useDb(env.DATABASE_NAME ?? '');
export const Gathering = dbConnection.model('Gathering', GatheringSchema, 'Gathering');