"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyvalidate_middleware_1 = require("../middleware/bodyvalidate.middleware");
const user_controller_1 = require("../controllers/user.controller");
const user_validate_1 = require("../utils/validates/user.validate");
const general_1 = require("../utils/helpers/general");
const uploadConfig_1 = __importDefault(require("./uploadConfig"));
const gathering_controller_1 = require("../controllers/gathering.controller");
const gathering_validate_1 = require("../utils/validates/gathering.validate");
var RouteSource;
(function (RouteSource) {
    RouteSource[RouteSource["Body"] = 0] = "Body";
    RouteSource[RouteSource["Query"] = 1] = "Query";
    RouteSource[RouteSource["Params"] = 2] = "Params";
})(RouteSource || (RouteSource = {}));
const router = express_1.default.Router();
// Temporary test route to verify large file uploads locally (unprotected)
// Remove this route after verification.
router.post('/test-upload', uploadConfig_1.default.single('file'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    return res.status(200).json({ success: true, message: 'File received', size: req.file.size || null, filename: req.file.originalname });
});
router.post('/signUp', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.signUpValidation), user_controller_1.signUp);
router.post('/send/otp', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.sendOtpValidation), user_controller_1.sendOtp);
router.post('/verify/otp', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.verifyOtpValidation), user_controller_1.verifyOtp);
router.post('/login', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.loginValidation), user_controller_1.login);
router.post('/forgot/password', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.forgotPasswordValidation), user_controller_1.forgotPassword);
router.put('/profile/setup', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.setUpProfileValidation), user_controller_1.setUpProfile);
router.get('/profile', general_1.authenticateToken, user_controller_1.getProfile);
router.put('/profile/image/upload', uploadConfig_1.default.single('image'), (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.uploadProfileImageValidation), user_controller_1.uploadProfileImage);
router.put('/profile/video/upload', general_1.authenticateToken, uploadConfig_1.default.single('video'), user_controller_1.uploadProfileVideo);
router.post('/gathering', general_1.authenticateToken, (0, bodyvalidate_middleware_1.validateBody)(gathering_validate_1.createGatheringValidation), gathering_controller_1.createGathering);
router.post('/gathering/profile/upload', general_1.authenticateToken, uploadConfig_1.default.single('image'), (0, bodyvalidate_middleware_1.validateBody)(gathering_validate_1.uploadGatheringImageValidation, RouteSource.Query), gathering_controller_1.uploadGatheringProfile);
router.get('/gathering', general_1.authenticateToken, gathering_controller_1.getGathering);
exports.default = router;
