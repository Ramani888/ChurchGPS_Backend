"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserByEmail = void 0;
const user_model_1 = require("../models/user.model");
const getUserByEmail = async (email) => {
    try {
        const updatedEmail = email?.toLowerCase();
        const result = await user_model_1.User?.findOne({ email: updatedEmail });
        return result?.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.getUserByEmail = getUserByEmail;
const createUser = async (userData) => {
    try {
        const user = new user_model_1.User(userData);
        await user.save();
        return user.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.createUser = createUser;
