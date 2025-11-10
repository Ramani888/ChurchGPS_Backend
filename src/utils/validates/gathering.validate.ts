export const createGatheringValidation = {
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

export const uploadGatheringImageValidation = {
    gatheringId: 'string|required'
};