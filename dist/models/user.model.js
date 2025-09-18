"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const env = process.env;
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // unique index
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator_1.default.isEmail, 'Invalid email']
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // require 18+ at time of creation
                const today = new Date();
                const ageDifMs = today.getTime() - value.getTime();
                const ageDate = new Date(ageDifMs);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                return age >= 18;
            },
            message: 'User must be at least 18 years old'
        }
    },
    acceptedTnC: {
        type: Boolean,
        required: true,
        validate: {
            validator: (v) => v === true,
            message: 'Terms must be accepted'
        }
    }
}, { timestamps: true });
const dbConnection = mongoose_1.default.connection.useDb(env.DATABASE_NAME ?? '');
exports.User = dbConnection.model('User', UserSchema, 'User');
