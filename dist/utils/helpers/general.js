"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistanceMiles = exports.generateReferralCode = exports.comparePassword = exports.generateOTP = exports.generateUniqueUsername = exports.encryptPassword = void 0;
exports.authenticateToken = authenticateToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Using dynamic import for nanoid
const slugify_1 = __importDefault(require("slugify"));
const user_model_1 = require("../../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env = process.env;
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
    // Dynamically import nanoid when needed
    const { nanoid } = await Promise.resolve().then(() => __importStar(require('nanoid')));
    // fallback → prefix + nanoid
    return `${prefix}${nanoid(6)}`;
};
exports.generateUniqueUsername = generateUniqueUsername;
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const comparePassword = (storedPassword, validatePassword) => {
    if (storedPassword === validatePassword) {
        return Promise.resolve(true);
    }
    return new Promise((resolve, reject) => {
        bcryptjs_1.default.compare(storedPassword, validatePassword, (err, result) => {
            if (err)
                return reject(err);
            return result ? resolve(result) : reject(new Error('Passwords do not match.'));
        });
    });
};
exports.comparePassword = comparePassword;
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    const SECRET_KEY = env.SECRET_KEY;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}
const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};
exports.generateReferralCode = generateReferralCode;
const getDistanceMiles = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 3958.8; // Earth radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
exports.getDistanceMiles = getDistanceMiles;
