"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpValidation = void 0;
exports.signUpValidation = {
    email: 'required|email',
    password: 'required|string',
    dob: 'required|date',
    acceptedTnC: 'required|boolean'
};
