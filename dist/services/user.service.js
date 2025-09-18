"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTempUser = exports.getTempUserByEmail = exports.createTempUser = exports.createUser = exports.getUserByEmail = void 0;
const tempUser_model_1 = require("../models/tempUser.model");
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
const createTempUser = async (userData) => {
    try {
        const user = new tempUser_model_1.TempUser(userData);
        await user.save();
        return user.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.createTempUser = createTempUser;
const getTempUserByEmail = async (email) => {
    try {
        const updatedEmail = email?.toLowerCase();
        const result = await tempUser_model_1.TempUser?.findOne({ email: updatedEmail });
        return result?.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.getTempUserByEmail = getTempUserByEmail;
const updateTempUser = async (data) => {
    try {
        const result = await tempUser_model_1.TempUser?.findOneAndUpdate({ email: data.email.toLowerCase() }, { $set: { otp: data.otp } }, { new: true, upsert: true });
        return result?.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.updateTempUser = updateTempUser;
