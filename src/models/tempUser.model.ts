import mongoose, { Schema } from "mongoose";
import validator from "validator";

const env = process.env;

const TempUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email']
    },
    otp: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const dbConnection = mongoose.connection.useDb(env.DATABASE_NAME ?? '');
export const TempUser = dbConnection.model('TempUser', TempUserSchema, 'TempUser');