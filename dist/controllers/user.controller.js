"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = exports.signUp = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("../services/user.service");
const general_1 = require("../utils/helpers/general");
const sendMail_1 = __importDefault(require("../utils/helpers/sendMail"));
const signUp = async (req, res) => {
    const bodyData = req.body;
    try {
        const email = bodyData?.email?.toLowerCase();
        // Check if the user already exists
        const existingUser = await (0, user_service_1.getUserByEmail)(email);
        if (existingUser)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'User already exists.' });
        // Encrypt Password
        const newPassword = await (0, general_1.encryptPassword)(bodyData?.password);
        // Create Username
        const newUserName = await (0, general_1.generateUniqueUsername)(email);
        await (0, user_service_1.createUser)({ ...bodyData, email: email, password: newPassword, username: newUserName });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: 'User created successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.signUp = signUp;
const sendOtp = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase();
        // Generate OTP
        const otp = (0, general_1.generateOTP)();
        const otpTemplate = `
            <h1>Your OTP Code</h1>
            <p>Your OTP code is <strong>${otp}</strong></p>
        `;
        const existingTempUser = await (0, user_service_1.getTempUserByEmail)(email);
        if (existingTempUser) {
            await (0, user_service_1.updateTempUser)({ email, otp: Number(otp) });
        }
        else {
            await (0, user_service_1.createTempUser)({ email, otp: Number(otp) });
        }
        await (0, sendMail_1.default)(email, 'OTP Verification', otpTemplate);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'OTP sent successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.sendOtp = sendOtp;
