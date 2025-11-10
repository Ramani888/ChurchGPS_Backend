export interface IGathering {
  _id?: string;
  userId: string;
  categories: string[];
  locationTypes: string[];
  description: string;
  groupName: string;
  groupPicture?: string;
  denomination?: string;
  protestantDenomination?: string;
  otherDenomination?: string;
  locationPrivacy: string;
  radius?: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}