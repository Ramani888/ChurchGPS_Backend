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
    email: 'email|required',
    password: 'string|required'
};

export const forgotPasswordValidation = {
    email: 'email|required',
    password: 'string|required'
};

export const setUpProfileValidation = {
    profileName: 'string',
    bio: 'string',
    denomination: 'string|required',
    protestantDenomination: 'string',
    otherDenomination: 'string',
    questionnaire: 'array|required'
}