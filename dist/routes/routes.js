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
var RouteSource;
(function (RouteSource) {
    RouteSource[RouteSource["Body"] = 0] = "Body";
    RouteSource[RouteSource["Query"] = 1] = "Query";
    RouteSource[RouteSource["Params"] = 2] = "Params";
})(RouteSource || (RouteSource = {}));
const router = express_1.default.Router();
router.post('/signUp', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.signUpValidation), user_controller_1.signUp);
router.post('/send/otp', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.sendOtpValidation), user_controller_1.sendOtp);
router.post('/verify/otp', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.verifyOtpValidation), user_controller_1.verifyOtp);
router.post('/login', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.loginValidation), user_controller_1.login);
router.post('/forgot/password', (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.forgotPasswordValidation), user_controller_1.forgotPassword);
router.put('/profile/setup', general_1.authenticateToken, (0, bodyvalidate_middleware_1.validateBody)(user_validate_1.setUpProfileValidation), user_controller_1.setUpProfile);
exports.default = router;
