export const signUpValidation = {
    email: 'email|required',
    password: 'string|required',
    dob: 'date|required',
    acceptedTnC: 'boolean|required'
};

export const sendOtpValidation = {
    email: 'email|required'
};

export const verifyOtpValidation = {
    email: 'email|required',
    otp: 'numeric|required'
};

export const loginValidation = {
    email: 'email',
    password: 'string',
    googleId: 'string',
    authProvider: 'string'
};

export const forgotPasswordValidation = {
    email: 'email|required',
    password: 'string|required'
};

export const setUpProfileValidation = {
    _id: 'string|required',
    profileName: 'string|required',
    username: 'string|required',
    bio: 'string',
    denomination: 'string',
    protestantDenomination: 'string',
    otherDenomination: 'string',
    questionnaire: 'array'
}

export const uploadProfileImageValidation = {
    _id: 'string|required'
};