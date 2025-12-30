export const createCommunityValidation = {
    description: 'string|required',
    'coordinates.latitude': 'numeric|required',
    'coordinates.longitude': 'numeric|required',
}

export const getCommunityValidation = {
    lat: 'numeric|required',
    lng: 'numeric|required',
}