import { AuthorizedRequest, IUser } from "../types/user.d";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { createGatheringData, createGatheringSaveData, getGatheringById, getGatheringByUserId, removeAllSavedGatheringData, removeSavedGatheringData, updateGatheringData } from "../services/gathering.service";
import { uploadToS3 } from "../routes/uploadConfig";
import { CHURCHGPS_IMAGES_V1_BUCKET_NAME } from "../utils/constants/general";

export const createGathering = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId;
        const body = req.body;

        const data = await createGatheringData({
            ...body,
            userId
        });

        res.status(StatusCodes.OK).json({ success: true, data: data, message: 'Gathering created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const uploadGatheringProfile = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId;
        const { gatheringId } = req?.query;

        if (!req.file) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'No file uploaded.' });

        const gathering = await getGatheringById(gatheringId.toString());
        if (!gathering) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Gathering not found.' });

        const groupPicture = await uploadToS3(req.file, CHURCHGPS_IMAGES_V1_BUCKET_NAME);

        const data = await updateGatheringData({
            ...gathering,
            _id: gathering?._id.toString(),
            groupPicture,
            protestantDenomination: gathering.protestantDenomination ?? undefined,
            otherDenomination: gathering.otherDenomination ?? undefined,
            coordinates: gathering.coordinates ?? { latitude: 0, longitude: 0 }
        });

        res.status(StatusCodes.OK).json({ success: true, data: data, message: 'Gathering profile image uploaded successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const getGathering = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId;

        const gathering = await getGatheringByUserId(userId);
        if (!gathering) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Gathering not found.' });

        res.status(StatusCodes.OK).json({ success: true, data: gathering, message: 'Gathering fetched successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const createGatheringSave = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId;
        const { gatheringId } = req.body;
        
        const gathering = await getGatheringById(gatheringId);
        if (!gathering) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Gathering not found.' });

        await createGatheringSaveData({
            userId,
            gatheringId
        });

        res.status(StatusCodes.OK).json({ success: true, message: 'Gathering saved successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const removeSavedGathering = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId;
        const { gatheringId } = req?.query;

        // Assuming there's a service function to remove gathering save by its ID and userId
        await removeSavedGatheringData(gatheringId.toString(), userId);

        res.status(StatusCodes.OK).json({ success: true, message: 'Removed saved gathering successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const removeAllSavedGathering = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId;

        // Assuming there's a service function to remove all gathering saves for a user
        await removeAllSavedGatheringData(userId);

        res.status(StatusCodes.OK).json({ success: true, message: 'Removed all saved gatherings successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}