"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityValidation = exports.createCommunityValidation = void 0;
exports.createCommunityValidation = {
    description: 'string|required',
    'coordinates.latitude': 'numeric|required',
    'coordinates.longitude': 'numeric|required',
};
exports.getCommunityValidation = {
    lat: 'numeric|required',
    lng: 'numeric|required',
};
