"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileImageValidation = exports.setUpProfileValidation = exports.forgotPasswordValidation = exports.loginValidation = exports.verifyOtpValidation = exports.sendOtpValidation = exports.signUpValidation = void 0;
exports.signUpValidation = {
    email: 'email|required',
    password: 'string',
    dob: 'date',
    acceptedTnC: 'boolean|required',
    authProvider: 'string',
    googleId: 'string',
    displayName: 'string',
    profilePicture: 'string'
};
exports.sendOtpValidation = {
    email: 'email|required'
};
exports.verifyOtpValidation = {
    email: 'email|required',
    otp: 'numeric|required'
};
exports.loginValidation = {
    email: 'email',
    password: 'string',
    googleId: 'string',
    authProvider: 'string'
};
exports.forgotPasswordValidation = {
    email: 'email|required',
    password: 'string|required'
};
exports.setUpProfileValidation = {
    _id: 'string|required',
    profileName: 'string|required',
    username: 'string|required',
    bio: 'string',
    denomination: 'string',
    protestantDenomination: 'string',
    otherDenomination: 'string',
    questionnaire: 'array'
};
exports.uploadProfileImageValidation = {
    _id: 'string|required'
};
