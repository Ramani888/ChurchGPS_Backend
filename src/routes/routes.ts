import express from "express";
import { validateBody } from "../middleware/bodyvalidate.middleware";
import { forgotPassword, login, sendOtp, setUpProfile, signUp, verifyOtp } from "../controllers/user.controller";
import { forgotPasswordValidation, loginValidation, sendOtpValidation, setUpProfileValidation, signUpValidation, verifyOtpValidation } from "../utils/validates/user.validate";
import { authenticateToken } from "../utils/helpers/general";
import { set } from "mongoose";

enum RouteSource {
    Body,
    Query,
    Params
}

const router = express.Router();

router.post('/signUp', validateBody(signUpValidation), signUp)
router.post('/send/otp', validateBody(sendOtpValidation), sendOtp)
router.post('/verify/otp', validateBody(verifyOtpValidation), verifyOtp)
router.post('/login', validateBody(loginValidation), login)
router.post('/forgot/password', validateBody(forgotPasswordValidation), forgotPassword)

router.put('/profile/setup', authenticateToken, validateBody(setUpProfileValidation), setUpProfile)

export default router;