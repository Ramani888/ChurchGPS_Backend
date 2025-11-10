"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGathering = exports.uploadGatheringProfile = exports.createGathering = void 0;
const http_status_codes_1 = require("http-status-codes");
const gathering_service_1 = require("../services/gathering.service");
const uploadConfig_1 = require("../routes/uploadConfig");
const general_1 = require("../utils/constants/general");
const createGathering = async (req, res) => {
    try {
        const userId = req?.user?.userId;
        const body = req.body;
        const data = await (0, gathering_service_1.createGatheringData)({
            ...body,
            userId
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: data, message: 'Gathering created successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.createGathering = createGathering;
const uploadGatheringProfile = async (req, res) => {
    try {
        const userId = req?.user?.userId;
        const { gatheringId } = req?.query;
        if (!req.file)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'No file uploaded.' });
        const gathering = await (0, gathering_service_1.getGatheringById)(gatheringId.toString());
        if (!gathering)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'Gathering not found.' });
        const groupPicture = await (0, uploadConfig_1.uploadToS3)(req.file, general_1.CHURCHGPS_IMAGES_V1_BUCKET_NAME);
        const data = await (0, gathering_service_1.updateGatheringData)({
            ...gathering,
            _id: gathering?._id.toString(),
            groupPicture,
            protestantDenomination: gathering.protestantDenomination ?? undefined,
            otherDenomination: gathering.otherDenomination ?? undefined,
            coordinates: gathering.coordinates ?? { latitude: 0, longitude: 0 }
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: data, message: 'Gathering profile image uploaded successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.uploadGatheringProfile = uploadGatheringProfile;
const getGathering = async (req, res) => {
    try {
        const userId = req?.user?.userId;
        const gathering = await (0, gathering_service_1.getGatheringByUserId)(userId);
        if (!gathering)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ success: false, message: 'Gathering not found.' });
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: gathering, message: 'Gathering fetched successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error });
    }
};
exports.getGathering = getGathering;
