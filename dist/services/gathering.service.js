"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGatheringByUserId = exports.updateGatheringData = exports.getGatheringById = exports.createGatheringData = void 0;
const gathering_model_1 = require("../models/gathering.model");
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
    }
    catch (err) {
        throw err;
    }
};
exports.getGatheringByUserId = getGatheringByUserId;
