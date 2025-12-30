import { AuthorizedRequest, IUser } from "../types/user.d";
import { StatusCodes } from "http-status-codes";
import { Response } from 'express';
import { createCommunityData, getCommunityData } from "../services/community.service";
import { getDistanceMiles } from "../utils/helpers/general";
import { getUserById } from "../services/user.service";

export const createCommunity = async (req: AuthorizedRequest, res: Response) => {
    try {
        const userId = req?.user?.userId;
        const body = req.body;

        const data = await createCommunityData({
            ...body,
            userId
        });

        res.status(StatusCodes.OK).json({ success: true, data: data, message: 'Community created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}

export const getCommunity = async (req: AuthorizedRequest, res: Response) => {
    try {
        const { lat, lng } = req?.query;
        const data = await getCommunityData();
        const MAX_DISTANCE = 250;

        const allCommunities = await Promise.all(data?.map(async (item) => {
            const distance = getDistanceMiles(
                Number(lat),
                Number(lng),
                item?.coordinates?.latitude ?? 0,
                item?.coordinates?.longitude ?? 0
            );
            const userData = await getUserById(item.userId) as IUser;

            return {
                ...item.toObject(),
                distance: Number(distance.toFixed(2)), // ✅ only number
                userData
            };
        }));

        const nearbyCommunities = allCommunities.filter((item) => item.distance <= MAX_DISTANCE);
        
        res.status(StatusCodes.OK).json({ success: true, data: nearbyCommunities, message: 'Communities fetched successfully.' });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
}