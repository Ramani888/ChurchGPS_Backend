"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGatheringSaveValidation = exports.createGatheringSaveValidation = exports.uploadGatheringImageValidation = exports.createGatheringValidation = void 0;
exports.createGatheringValidation = {
    categories: 'array|required',
    locationTypes: 'array|required',
    description: 'string|required',
    groupName: 'string|required',
    groupPicture: 'string',
    denomination: 'string|required',
    protestantDenomination: 'string',
    otherDenomination: 'string',
    locationPrivacy: 'string|required',
    radius: 'numeric|required',
    'coordinates.latitude': 'numeric|required',
    'coordinates.longitude': 'numeric|required',
};
exports.uploadGatheringImageValidation = {
    gatheringId: 'string|required'
};
exports.createGatheringSaveValidation = {
    gatheringId: 'string|required'
};
exports.removeGatheringSaveValidation = {
    gatheringId: 'string|required'
};
