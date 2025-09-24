"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpProfileValidation = exports.forgotPasswordValidation = exports.loginValidation = exports.verifyOtpValidation = exports.sendOtpValidation = exports.signUpValidation = void 0;
exports.signUpValidation = {
    email: 'email|required',
    password: 'string|required',
    dob: 'date|required',
    acceptedTnC: 'boolean|required'
};
exports.sendOtpValidation = {
    email: 'email|required'
};
exports.verifyOtpValidation = {
    email: 'email|required',
    otp: 'numeric|required'
};
exports.loginValidation = {
    email: 'email|required',
    password: 'string|required'
};
exports.forgotPasswordValidation = {
    email: 'email|required',
    password: 'string|required'
};
exports.setUpProfileValidation = {
    profileUrl: 'string|required',
    profileName: 'string',
    bio: 'string',
    denomination: 'string|required',
    protestantDenomination: 'string',
    otherDenomination: 'string',
    questionnaire: 'array|required'
};
