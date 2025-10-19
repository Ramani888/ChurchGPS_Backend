import express from "express";
import { validateBody } from "../middleware/bodyvalidate.middleware";
import { forgotPassword, getProfile, login, sendOtp, setUpProfile, signUp, uploadProfileImage, uploadProfileVideo, verifyOtp } from "../controllers/user.controller";
import { forgotPasswordValidation, loginValidation, sendOtpValidation, setUpProfileValidation, signUpValidation, verifyOtpValidation } from "../utils/validates/user.validate";
import { authenticateToken } from "../utils/helpers/general";
import { set } from "mongoose";
import upload from "./uploadConfig";

enum RouteSource {
    Body,
    Query,
    Params
}

const router = express.Router();

// Temporary test route to verify large file uploads locally (unprotected)
// Remove this route after verification.
router.post('/test-upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    return res.status(200).json({ success: true, message: 'File received', size: (req.file as any).size || null, filename: (req.file as any).originalname });
});

router.post('/signUp', validateBody(signUpValidation), signUp)
router.post('/send/otp', validateBody(sendOtpValidation), sendOtp)
router.post('/verify/otp', validateBody(verifyOtpValidation), verifyOtp)
router.post('/login', validateBody(loginValidation), login)
router.post('/forgot/password', validateBody(forgotPasswordValidation), forgotPassword)

router.put('/profile/setup', validateBody(setUpProfileValidation), setUpProfile)
router.get('/profile', authenticateToken, getProfile)
router.put('/profile/image/upload', upload.single('image'), uploadProfileImage)
router.put('/profile/video/upload', authenticateToken, upload.single('video'), uploadProfileVideo)

export default router;