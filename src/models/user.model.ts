import mongoose, { Schema } from "mongoose";
import validator from "validator";

const env = process.env;

const QuestionnaireSchema = new mongoose.Schema({
  questionId: {
    type: Number, // e.g. 1,2,3...28
    required: true
  },
  answer: {
    type: String,
    enum: ["yes", "no", "skip"],
    required: true
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,        // unique index
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
        validate: [validator.isEmail, 'Invalid email']
    },
    password: {
        type: String,
        required: false,
        default: null
    },
    dob: {
        type: Date,
        required: false,
        validate: {
        validator: function(value: Date) {
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
        validator: (v: boolean) => v === true,
            message: 'Terms must be accepted'
        }
    },
    isProfileSetup: {
        type: Boolean,
        default: false
    },
    profileUrl: {
        type: String,
        default: null
    },
    videoUrl: {
        type: String,
        default: null
    },
    profileName: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    denomination: {
        type: String,
        default: null
    },
    protestantDenomination: {
        type: String,
        default: null
    },
    otherDenomination: {
        type: String,
        default: null
    },
    questionnaire: {
        type: [QuestionnaireSchema],
        default: []
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    }
}, { timestamps: true });

const dbConnection = mongoose.connection.useDb(env.DATABASE_NAME ?? '');
export const User = dbConnection.model('User', UserSchema, 'User');