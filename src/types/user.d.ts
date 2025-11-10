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
  isProfileSetup?: boolean;
  profileUrl?: string | null;
  videoUrl?: string | null;
  profileName?: string | null;
  bio?: string | null;
  denomination?: string | null;
  protestantDenomination?: string | null;
  otherDenomination?: string | null;
  questionnaire?: Array<{
    questionId: number;
    answer: string;
  }>;
  referralCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITempUser {
  _id?: ObjectId;
  email: string;
  otp: number;
  createdAt?: Date;
  updatedAt?: Date;
}