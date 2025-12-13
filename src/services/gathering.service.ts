import { Gathering } from "../models/gathering.model";
import { GatheringSave } from "../models/gatheringSave.model";
import { IGathering, IGatheringSave } from "../types/gathering";
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

        // Get all saved gatherings for this user
        const savedGatherings = await GatheringSave.find({ userId: userId?.toString() }).lean();
        const savedGatheringIds = new Set(savedGatherings.map(sg => sg.gatheringId?.toString()));

        const modifiedGatherings = gathering?.map((g) => {
            const primaryCategory = g?.categories?.[0] ?? null;
            const isChurchLeader = g?.locationTypes?.includes("Church Building");
            const isSaved = savedGatheringIds.has(g._id?.toString());
            return {
                ...g,
                primaryCategory,
                isChurchLeader,
                isSaved
            };
        });

        return modifiedGatherings;
    } catch (err) {
        throw err;
    }
}

export const createGatheringSaveData = async (data: IGatheringSave) => {
    try {
        const gatheringSave = new GatheringSave(data);
        await gatheringSave.save();
        return gatheringSave.toObject();
    } catch (err) {
        throw err;
    }
}

export const removeSavedGatheringData = async (gatheringId: string, userId: string) => {
    try {
        await GatheringSave.deleteOne({ gatheringId: gatheringId?.toString(), userId: userId?.toString() });
    } catch (err) {
        throw err;
    }
}

export const removeAllSavedGatheringData = async (userId: string) => {
    try {
        await GatheringSave.deleteMany({ userId: userId?.toString() });
    } catch (err) {
        throw err;
    }
}