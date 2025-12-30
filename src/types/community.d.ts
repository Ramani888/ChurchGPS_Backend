export interface ICommunity {
  _id?: string;
  userId: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}