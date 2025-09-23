import { AuthorizedRequest, IUser } from "../types/user.d";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { createTempUser, createUser, getTempUserByEmail, getUserByEmail, updateTempUser, updateUser } from "../services/user.service";
import { comparePassword, encryptPassword, generateOTP, generateUniqueUsername } from "../utils/helpers/general";
import sendMail from "../utils/helpers/sendMail";
import jwt from 'jsonwebtoken';
const env = process.env;

export const signUp = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const email = bodyData?.email?.toLowerCase();

        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'User already exists.' });

        // Encrypt Password
        const newPassword = await encryptPassword(bodyData?.password);

        // Create Username
        const newUserName = await generateUniqueUsername(email);

        await createUser({...bodyData, email: email, password: newPassword, username: newUserName});

        res.status(StatusCodes.CREATED).json({ success: true, message: 'User created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
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
        const email = bodyData?.email?.toLowerCase();
        const password = bodyData?.password;

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
            ...existingUser, 
            password: String(newPassword), 
            userName: (existingUser as any).userName ?? (existingUser as any).username 
        });

        res.status(StatusCodes.OK).json({ success: true, message: 'Password reset successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}
