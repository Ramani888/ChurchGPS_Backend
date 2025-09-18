import express from "express";
import { validateBody } from "../middleware/bodyvalidate.middleware";
import { sendOtp, signUp, verifyOtp } from "../controllers/user.controller";
import { sendOtpValidation, signUpValidation, verifyOtpValidation } from "../utils/validates/user.validate";

enum RouteSource {
    Body,
    Query,
    Params
}

const router = express.Router();

router.post('/signUp', validateBody(signUpValidation), signUp)
router.post('/send/otp', validateBody(sendOtpValidation), sendOtp)
router.post('/verify/otp', validateBody(verifyOtpValidation), verifyOtp)

export default router;