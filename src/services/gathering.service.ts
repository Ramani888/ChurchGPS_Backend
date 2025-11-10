import { Gathering } from "../models/gathering.model";
import { IGathering } from "../types/gathering";
import { ObjectId } from 'mongodb';

export const createGatheringData = async (data: IGathering) => {
    try {
        const gathering = new Gathering(data);
        await gathering.save();
        return gathering.toObject();
    } catch (err) {
        throw err;
    }
}

export const getGatheringById = async (id: string) => {
    try {
        const gathering = await Gathering.findById(id);
        return gathering?.toObject();
    } catch (err) {
        throw err;
    }
}

export const updateGatheringData = async (data: IGathering) => {
    try {
        const objectId = new ObjectId(data?._id?.toString());
        const result = await Gathering.findByIdAndUpdate(objectId, data, {
            new: true,
            runValidators: true
        });
        return result;
    } catch (err) {
        throw err;
    }
}

export const getGatheringByUserId = async (userId: string) => {
    try {
        const gathering = await Gathering.find({ userId: userId?.toString() }).lean();

        const modifiedGatherings = gathering?.map((g) => {
            const primaryCategory = g?.categories?.[0] ?? null;
            const isChurchLeader = g?.locationTypes?.includes("Church Building");
            return {
                ...g,
                primaryCategory,
                isChurchLeader
            };
        });

        return modifiedGatherings;
    } catch (err) {
        throw err;
    }
}