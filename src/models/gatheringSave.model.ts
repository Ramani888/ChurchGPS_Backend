import mongoose, { Schema } from "mongoose";
const env = process.env;

const GatheringSaveSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    gatheringId: {
        type: String,
        required: true
    },
}, { timestamps: true });

const dbConnection = mongoose.connection.useDb(env.DATABASE_NAME ?? '');
export const GatheringSave = dbConnection.model('GatheringSave', GatheringSaveSchema, 'GatheringSave');