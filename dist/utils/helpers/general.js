"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.generateUniqueUsername = exports.encryptPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nanoid_1 = require("nanoid");
const slugify_1 = __importDefault(require("slugify"));
const user_model_1 = require("../../models/user.model");
const encryptPassword = (password) => {
    return new Promise((resolve) => {
        bcryptjs_1.default.genSalt(5, function (err, salt) {
            if (err || !salt) {
                return resolve(undefined);
            }
            bcryptjs_1.default.hash(password, salt, function (err, hash) {
                return resolve(hash);
            });
        });
    });
};
exports.encryptPassword = encryptPassword;
const generateUniqueUsername = async (email) => {
    const prefix = (0, slugify_1.default)(email.split('@')[0], { lower: true, strict: true }).slice(0, 18) || 'user';
    // check existing usernames
    const regex = new RegExp(`^${prefix}(-?\\d*)?$`, 'i');
    const existing = await user_model_1.User.find({ username: regex }).select('username').lean();
    if (!existing.length)
        return prefix;
    const used = new Set(existing.map(u => u.username));
    for (let i = 1; i < 10000; i++) {
        const candidate = `${prefix}${i}`;
        if (!used.has(candidate))
            return candidate;
    }
    // fallback → prefix + nanoid
    return `${prefix}${(0, nanoid_1.nanoid)(6)}`;
};
exports.generateUniqueUsername = generateUniqueUsername;
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
