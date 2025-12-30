import mongoose, { Schema } from "mongoose";
const env = process.env;

const CommunitySchema = new mongoose.Schema({
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

CommunitySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 432000 } // 5 days
);

const dbConnection = mongoose.connection.useDb(env.DATABASE_NAME ?? '');
export const Community = dbConnection.model('Community', CommunitySchema, 'Community');