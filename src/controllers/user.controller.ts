import { AuthorizedRequest } from "../types/user.d";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { createUser, getUserByEmail } from "../services/user.service";
import { encryptPassword, generateUniqueUsername } from "../utils/helpers/general";

export const signUp = async (req: AuthorizedRequest, res: Response) => {
    const bodyData = req.body;
    try {
        const email = bodyData?.email?.toLowerCase();

        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists.' });

        // Encrypt Password
        const newPassword = await encryptPassword(bodyData?.password);

        // Create Username
        const newUserName = await generateUniqueUsername(email);

        await createUser({...bodyData, email: email, password: newPassword, username: newUserName});

        res.status(StatusCodes.CREATED).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}