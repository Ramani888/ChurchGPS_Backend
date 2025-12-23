import { AuthorizedRequest, IUser } from "../types/user.d";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { createTempUser, createUser, getTempUserByEmail, getUserByEmail, getUserById, updateTempUser, updateUser, getUserByGoogleId } from "../services/user.service";
import { comparePassword, encryptPassword, generateOTP, generateReferralCode, generateUniqueUsername } from "../utils/helpers/general";
import sendMail from "../utils/helpers/sendMail";
import jwt from 'jsonwebtoken';
import { uploadToS3 } from "../routes/uploadConfig";
import { CHURCHGPS_IMAGES_V1_BUCKET_NAME, CHURCHGPS_VIDEOS_V1_BUCKET_NAME } from "../utils/constants/general";
const env = process.env;

export const signUp = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const authProvider = bodyData?.authProvider || 'local';
        const email = bodyData?.email?.toLowerCase();

        // Google Sign-Up
        if (authProvider === 'google') {
            return googleSignUp(req, res, bodyData, email);
        }

        // Local Sign-Up
        return localSignUp(req, res, bodyData, email);
    } catch (error) {
        console.error(error);
        
        // Check if it's a mongoose validation error
        if ((error as any).name === 'ValidationError') {
            // Extract the first validation error message
            const errorObj = error as { errors?: Record<string, { message: string }> };
            const errorMessage = errorObj.errors ? Object.values(errorObj.errors)[0].message : 'Validation error';
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: errorMessage 
            });
        }
        
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

// Local Sign-Up Helper
const localSignUp = async (req: AuthorizedRequest, res: Response, bodyData: any, email: string) => {
    try {
        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: 'User already exists.' 
            });
        }

        // Validate required fields for local signup
        if (!bodyData?.password || !bodyData?.dob) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: 'Password and date of birth are required for local signup.' 
            });
        }

        // Encrypt Password
        const newPassword = await encryptPassword(bodyData.password);

        // Create Username
        const newUserName = await generateUniqueUsername(email);

        // Create Referral Code
        const referralCode = generateReferralCode();

        const user = await createUser({
            ...bodyData, 
            email, 
            password: newPassword, 
            username: newUserName, 
            referralCode,
            authProvider: 'local'
        });

        res.status(StatusCodes.CREATED).json({ 
            user, 
            success: true, 
            message: 'User created successfully.' 
        });
    } catch (error) {
        throw error;
    }
}

// Google Sign-Up Helper
const googleSignUp = async (req: AuthorizedRequest, res: Response, bodyData: any, email: string) => {
    try {
        const googleId = bodyData?.googleId;
        const displayName = bodyData?.displayName;
        const profilePicture = bodyData?.profilePicture;

        // Validate required fields for Google signup
        if (!googleId || !email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: 'Google ID and email are required.' 
            });
        }

        // Check if user already exists by googleId
        let existingUser = await getUserByGoogleId(googleId);
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: 'User account already exists with this Google ID.' 
            });
        }

        // Check if email is already registered
        existingUser = await getUserByEmail(email);
        if (existingUser) {
            // Email exists but no googleId - user can link Google account in settings
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: 'Email already registered. Please login or use a different email.' 
            });
        }

        // Create new user with Google info
        const newUserName = await generateUniqueUsername(email);
        const referralCode = generateReferralCode();

        const user = await createUser({
            email,
            username: newUserName,
            googleId,
            authProvider: 'google',
            profileName: displayName || null,
            profileUrl: profilePicture || null,
            acceptedTnC: bodyData?.acceptedTnC || true,
            referralCode,
            password: null // No password for Google auth
        } as IUser);

        res.status(StatusCodes.CREATED).json({ 
            user, 
            success: true, 
            message: 'User created successfully with Google account.' 
        });
    } catch (error) {
        throw error;
    }
}

export const sendOtp = async (req: AuthorizedRequest, res: Response) => {
    try {
        const email = req.body.email?.toLowerCase();

        // Generate OTP
        const otp = generateOTP();

        const otpTemplate = `
            <h1>Your OTP Code</h1>
            <p>Your OTP code is <strong>${otp}</strong></p>
        `;

        const existingTempUser = await getTempUserByEmail(email);
        if (existingTempUser) {
            await updateTempUser({ email, otp: Number(otp) });
        } else {
            await createTempUser({ email, otp: Number(otp) });
        }

        await sendMail(email, 'OTP Verification', otpTemplate);

        res.status(StatusCodes.OK).json({ success: true, message: 'OTP sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const verifyOtp = async (req: AuthorizedRequest, res: Response) => {
    try {
        const { email, otp } = req.body;

        // Check if the temp user exists
        const tempUser = await getTempUserByEmail(email);
        if (!tempUser) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid email.' });

        // Verify OTP
        if (tempUser.otp !== Number(otp)) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid OTP.' });

        res.status(StatusCodes.OK).json({ success: true, message: 'OTP verified successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const login = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const authProvider = bodyData?.authProvider || 'local';

        // Google Sign-In
        if (authProvider === 'google') {
            const googleId = bodyData?.googleId;
            const email = bodyData?.email?.toLowerCase();
            const displayName = bodyData?.displayName;
            const profilePicture = bodyData?.profilePicture;

            if (!googleId || !email) {
                return res.status(StatusCodes.BAD_REQUEST).json({ 
                    success: false, 
                    message: 'Google ID and email are required.' 
                });
            }

            // Try to find user by Google ID first
            let user = await getUserByGoogleId(googleId);

            // If not found, try to find by email
            if (!user) {
                user = await getUserByEmail(email);
                
                // If user exists but doesn't have googleId, update them
                if (user) {
                    await updateUser({
                        _id: user._id,
                        email: user.email,
                        username: (user as any).username,
                        googleId,
                        authProvider: 'google',
                        profileUrl: profilePicture || user.profileUrl,
                        referralCode: user.referralCode,
                        acceptedTnC: user.acceptedTnC,
                    } as IUser);
                } else {
                    // Create new user with Google info
                    const newUserName = await generateUniqueUsername(email);
                    const referralCode = generateReferralCode();
                    user = await createUser({
                        email,
                        username: newUserName,
                        userName: newUserName,
                        googleId,
                        authProvider: 'google',
                        profileName: displayName,
                        profileUrl: profilePicture,
                        acceptedTnC: true,
                        referralCode
                    } as IUser);
                }
            }

            const SECRET_KEY: any = env.SECRET_KEY;
            const token = jwt.sign(
                { userId: user?._id?.toString(), username: user?.username },
                SECRET_KEY,
                { expiresIn: '30d' }
            );

            return res.status(StatusCodes.OK).json({ 
                user: { ...user, token }, 
                success: true, 
                message: 'Google login successful.' 
            });
        }

        // Local Email/Password Sign-In
        const email = bodyData?.email?.toLowerCase();
        const password = bodyData?.password;

        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false, 
                message: 'Email and password are required for local login.' 
            });
        }

        // Check if the user exists
        const existingUser = await getUserByEmail(email);
        if (!existingUser) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid email.' });

        // Verify Password
        const isPasswordValid = await new Promise((resolve) =>
            comparePassword(password, String(existingUser?.password))
            .then((result) => resolve(result))
            .catch((error) => resolve(false))
        );
        if (!isPasswordValid) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid password.' });

        const SECRET_KEY: any = env.SECRET_KEY;
        const token = jwt.sign(
            { userId: existingUser?._id?.toString(), username: existingUser?.username },
            SECRET_KEY,
            { expiresIn: '30d' } // expires in 30 days
        );

        return res.status(StatusCodes.OK).send({ user: {...existingUser, token}, success: true, message: 'Login successful.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const forgotPassword = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const email = bodyData?.email?.toLowerCase();

        // Check if the user exists
        const existingUser = await getUserByEmail(email);
        if (!existingUser) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid email.' });

        // Encrypt Password
        const newPassword = await encryptPassword(bodyData?.password);

        await updateUser({
            _id: existingUser._id,
            email: existingUser.email,
            username: (existingUser as any).userName ?? (existingUser as any).username,
            password: String(newPassword),
            referralCode: existingUser.referralCode,
            acceptedTnC: existingUser.acceptedTnC,
        } as IUser);

        res.status(StatusCodes.OK).json({ success: true, message: 'Password reset successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const setUpProfile = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req?.body;
    try {
        const userId = req?.user?.userId ?? bodyData?._id?.toString();
        if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });

        // Update user profile
        await updateUser({ ...bodyData, _id: userId });

        res.status(StatusCodes.OK).json({ success: true, message: 'Profile updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const uploadProfileImage = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId ?? req.body?._id?.toString();
        if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'User not found.' });
        if (!req.file) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'No file uploaded.' });

        const profileUrl = await uploadToS3(req.file, CHURCHGPS_IMAGES_V1_BUCKET_NAME);

        const existingUser = await getUserById(userId);
        if (!existingUser) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'User not found.' });

        await updateUser({
            _id: existingUser._id,
            email: existingUser.email,
            username: (existingUser as any).userName ?? (existingUser as any).username,
            profileUrl: profileUrl,
            referralCode: existingUser.referralCode,
            acceptedTnC: existingUser.acceptedTnC,
        } as IUser);

        res.status(StatusCodes.OK).json({ success: true, message: 'Profile image uploaded successfully.', profileUrl });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const uploadProfileVideo = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId;
        if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'User not found.' });
        if (!req.file) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'No file uploaded.' });

        const videoUrl = await uploadToS3(req.file, CHURCHGPS_VIDEOS_V1_BUCKET_NAME);

        const existingUser = await getUserById(userId);
        if (!existingUser) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'User not found.' });

        await updateUser({
            _id: existingUser._id,
            email: existingUser.email,
            username: (existingUser as any).userName ?? (existingUser as any).username,
            videoUrl: videoUrl,
            referralCode: existingUser.referralCode,
            acceptedTnC: existingUser.acceptedTnC,
        } as IUser);

        res.status(StatusCodes.OK).json({ success: true, message: 'Profile video uploaded successfully.', videoUrl });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const getProfile = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId;
        if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
        const user = await getUserById(userId);
        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' });
        res.status(StatusCodes.OK).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}
