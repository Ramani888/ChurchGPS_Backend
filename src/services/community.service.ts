import { Community } from "../models/community.model";
import { ICommunity } from "../types/community";

export const createCommunityData = async (data: ICommunity) => {
    try {
        const community = new Community(data);
        await community.save();
        return community;
    } catch (err) {
        throw err;
    }
}

export const getCommunityData = async () => {
    try {
        const communities = await Community.find();
        return communities;
    } catch (err) {
        throw err;
    }
}