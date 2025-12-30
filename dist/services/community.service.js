"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityData = exports.createCommunityData = void 0;
const community_model_1 = require("../models/community.model");
const createCommunityData = async (data) => {
    try {
        const community = new community_model_1.Community(data);
        await community.save();
        return community;
    }
    catch (err) {
        throw err;
    }
};
exports.createCommunityData = createCommunityData;
const getCommunityData = async () => {
    try {
        const communities = await community_model_1.Community.find();
        return communities;
    }
    catch (err) {
        throw err;
    }
};
exports.getCommunityData = getCommunityData;
