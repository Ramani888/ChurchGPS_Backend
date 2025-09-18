type AuthorizedRequest = Express.Request & ?({ headers: { authorization: string } } & ?{ userData: JwtSign });

declare namespace Express {
  type Request = AuthorizedRequest;
}

export interface IUser {
  _id?: ObjectId;
  email: string;
  userName: string;
  password: string;
  dob: Date;
  acceptedTnC: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}