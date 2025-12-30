"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunity = exports.createCommunity = void 0;
const http_status_codes_1 = require("http-status-codes");
const community_service_1 = require("../services/community.service");
const general_1 = require("../utils/helpers/general");
const user_service_1 = require("../services/user.service");
const createCommunity = async (req, res) => {
    try {
        const userId = req?.user?.userId;
        const body = req.body;
        const data = await (0, community_service_1.createCommunityData)({
            ...body,
            userId
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: data, message: 'Community created successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.createCommunity = createCommunity;
const getCommunity = async (req, res) => {
    try {
        const { lat, lng } = req?.query;
        const data = await (0, community_service_1.getCommunityData)();
        const MAX_DISTANCE = 250;
        const allCommunities = await Promise.all(data?.map(async (item) => {
            const distance = (0, general_1.getDistanceMiles)(Number(lat), Number(lng), item?.coordinates?.latitude ?? 0, item?.coordinates?.longitude ?? 0);
            const userData = await (0, user_service_1.getUserById)(item.userId);
            return {
                ...item.toObject(),
                distance: Number(distance.toFixed(2)), // ✅ only number
                userData
            };
        }));
        const nearbyCommunities = allCommunities.filter((item) => item.distance <= MAX_DISTANCE);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: nearbyCommunities, message: 'Communities fetched successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.getCommunity = getCommunity;
