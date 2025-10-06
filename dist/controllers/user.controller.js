"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileImage = exports.setUpProfile = exports.forgotPassword = exports.login = exports.verifyOtp = exports.sendOtp = exports.signUp = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("../services/user.service");
const general_1 = require("../utils/helpers/general");
const sendMail_1 = __importDefault(require("../utils/helpers/sendMail"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uploadConfig_1 = require("../routes/uploadConfig");
const general_2 = require("../utils/constants/general");
const env = process.env;
const signUp = async (req, res) => {
    const bodyData = req.body;
    try {
        const email = bodyData?.email?.toLowerCase();
        // Check if the user already exists
        const existingUser = await (0, user_service_1.getUserByEmail)(email);
        if (existingUser)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'User already exists.' });
        // Encrypt Password
        const newPassword = await (0, general_1.encryptPassword)(bodyData?.password);
        // Create Username
        const newUserName = await (0, general_1.generateUniqueUsername)(email);
        await (0, user_service_1.createUser)({ ...bodyData, email: email, password: newPassword, username: newUserName });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, message: 'User created successfully.' });
    }
    catch (error) {
        console.error(error);
        // Check if it's a mongoose validation error
        if (error.name === 'ValidationError') {
            // Extract the first validation error message
            const errorObj = error;
            const errorMessage = errorObj.errors ? Object.values(errorObj.errors)[0].message : 'Validation error';
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: errorMessage
            });
        }
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
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'OTP sent successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        // Check if the temp user exists
        const tempUser = await (0, user_service_1.getTempUserByEmail)(email);
        if (!tempUser)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid email.' });
        // Verify OTP
        if (tempUser.otp !== Number(otp))
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid OTP.' });
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'OTP verified successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.verifyOtp = verifyOtp;
const login = async (req, res) => {
    const bodyData = req.body;
    try {
        const email = bodyData?.email?.toLowerCase();
        const password = bodyData?.password;
        // Check if the user exists
        const existingUser = await (0, user_service_1.getUserByEmail)(email);
        if (!existingUser)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid email.' });
        // Verify Password
        const isPasswordValid = await new Promise((resolve) => (0, general_1.comparePassword)(password, String(existingUser?.password))
            .then((result) => resolve(result))
            .catch((error) => resolve(false)));
        if (!isPasswordValid)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid password.' });
        const SECRET_KEY = env.SECRET_KEY;
        const token = jsonwebtoken_1.default.sign({ userId: existingUser?._id?.toString(), username: existingUser?.username }, SECRET_KEY, { expiresIn: '30d' } // expires in 30 days
        );
        return res.status(http_status_codes_1.StatusCodes.OK).send({ user: { ...existingUser, token }, success: true, message: 'Login successful.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    const bodyData = req.body;
    try {
        const email = bodyData?.email?.toLowerCase();
        // Check if the user exists
        const existingUser = await (0, user_service_1.getUserByEmail)(email);
        if (!existingUser)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid email.' });
        // Encrypt Password
        const newPassword = await (0, general_1.encryptPassword)(bodyData?.password);
        await (0, user_service_1.updateUser)({
            ...existingUser,
            password: String(newPassword),
            userName: existingUser.userName ?? existingUser.username
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Password reset successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.forgotPassword = forgotPassword;
const setUpProfile = async (req, res) => {
    const bodyData = req?.body;
    try {
        const userId = req?.user?.userId;
        if (!userId)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
        // Update user profile
        await (0, user_service_1.updateUser)({ ...bodyData, _id: userId });
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Profile updated successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.setUpProfile = setUpProfile;
const uploadProfileImage = async (req, res) => {
    try {
        const userId = req?.user?.userId;
        if (!userId)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: 'User not found.' });
        if (!req.file)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'No file uploaded.' });
        const profileUrl = await (0, uploadConfig_1.uploadToS3)(req.file, general_2.CHURCHGPS_IMAGES_V1_BUCKET_NAME);
        const existingUser = await (0, user_service_1.getUserById)(userId);
        if (!existingUser)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'User not found.' });
        await (0, user_service_1.updateUser)({
            ...existingUser,
            profileUrl: profileUrl,
            userName: existingUser.userName ?? existingUser.username
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: 'Profile image uploaded successfully.', profileUrl });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.uploadProfileImage = uploadProfileImage;
