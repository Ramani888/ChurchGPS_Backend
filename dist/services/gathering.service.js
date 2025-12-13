"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAllSavedGatheringData = exports.removeSavedGatheringData = exports.createGatheringSaveData = exports.getSavedGatheringsByUserId = exports.getGatheringByUserId = exports.updateGatheringData = exports.getGatheringById = exports.createGatheringData = void 0;
const gathering_model_1 = require("../models/gathering.model");
const gatheringSave_model_1 = require("../models/gatheringSave.model");
const mongodb_1 = require("mongodb");
const createGatheringData = async (data) => {
    try {
        const gathering = new gathering_model_1.Gathering(data);
        await gathering.save();
        return gathering.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.createGatheringData = createGatheringData;
const getGatheringById = async (id) => {
    try {
        const gathering = await gathering_model_1.Gathering.findById(id);
        return gathering?.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.getGatheringById = getGatheringById;
const updateGatheringData = async (data) => {
    try {
        const objectId = new mongodb_1.ObjectId(data?._id?.toString());
        const result = await gathering_model_1.Gathering.findByIdAndUpdate(objectId, data, {
            new: true,
            runValidators: true
        });
        return result;
    }
    catch (err) {
        throw err;
    }
};
exports.updateGatheringData = updateGatheringData;
const getGatheringByUserId = async (userId) => {
    try {
        const gathering = await gathering_model_1.Gathering.find({ userId: userId?.toString() }).lean();
        // Get all saved gatherings for this user
        const savedGatherings = await gatheringSave_model_1.GatheringSave.find({ userId: userId?.toString() }).lean();
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
    }
    catch (err) {
        throw err;
    }
};
exports.getGatheringByUserId = getGatheringByUserId;
const getSavedGatheringsByUserId = async (userId) => {
    try {
        const gathering = await gathering_model_1.Gathering.find({ userId: userId?.toString() }).lean();
        // Get all saved gatherings for this user
        const savedGatherings = await gatheringSave_model_1.GatheringSave.find({ userId: userId?.toString() }).lean();
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
        const filteredGatherings = modifiedGatherings?.filter(g => g.isSaved);
        return filteredGatherings;
    }
    catch (err) {
        throw err;
    }
};
exports.getSavedGatheringsByUserId = getSavedGatheringsByUserId;
const createGatheringSaveData = async (data) => {
    try {
        const gatheringSave = new gatheringSave_model_1.GatheringSave(data);
        await gatheringSave.save();
        return gatheringSave.toObject();
    }
    catch (err) {
        throw err;
    }
};
exports.createGatheringSaveData = createGatheringSaveData;
const removeSavedGatheringData = async (gatheringId, userId) => {
    try {
        await gatheringSave_model_1.GatheringSave.deleteOne({ gatheringId: gatheringId?.toString(), userId: userId?.toString() });
    }
    catch (err) {
        throw err;
    }
};
exports.removeSavedGatheringData = removeSavedGatheringData;
const removeAllSavedGatheringData = async (userId) => {
    try {
        await gatheringSave_model_1.GatheringSave.deleteMany({ userId: userId?.toString() });
    }
    catch (err) {
        throw err;
    }
};
exports.removeAllSavedGatheringData = removeAllSavedGatheringData;
