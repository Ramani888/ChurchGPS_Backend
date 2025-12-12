import { TempUser } from "../models/tempUser.model";
import { User } from "../models/user.model";
import { ITempUser, IUser } from "../types/user";
import { ObjectId } from 'mongodb';

export const getUserByEmail = async (email: string) => {
    try {
        const updatedEmail = email?.toLowerCase();
        const result = await User?.findOne({ email: updatedEmail });
        return result?.toObject();
    } catch (err) {
        throw err;
    }
}

export const getUserById = async (id: string) => {
    try {
        const objectId = new ObjectId(id);
        const result = await User?.findById(objectId);
        return result?.toObject();
    } catch (err) {
        throw err;
    }
}

export const createUser = async (userData: IUser) => {
    try {
        const user = new User(userData);
        await user.save();
        return user.toObject();
    } catch (err) {
        throw err;
    }
}

export const updateUser = async (data: IUser) => {
    try {
        const objectId = new ObjectId(data?._id?.toString());
        const result = await User.findByIdAndUpdate(objectId, data, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const createTempUser = async (userData: ITempUser) => {
    try {
        const user = new TempUser(userData);
        await user.save();
        return user.toObject();
    } catch (err) {
        throw err;
    }
}

export const getUserByGoogleId = async (googleId: string) => {
    try {
        const result = await User?.findOne({ googleId });
        return result?.toObject();
    } catch (err) {
        throw err;
    }
}

export const getTempUserByEmail = async (email: string) => {
    try {
        const updatedEmail = email?.toLowerCase();
        const result = await TempUser?.findOne({ email: updatedEmail });
        return result?.toObject();
    } catch (err) {
        throw err;
    }
}

export const updateTempUser = async (data: ITempUser) => {
    try {
        const result = await TempUser?.findOneAndUpdate(
            { email: data.email.toLowerCase() },
            { $set: { otp: data.otp } },
            { new: true, upsert: true }
        );
        return result?.toObject();
    } catch (err) {
        throw err;
    }
}
