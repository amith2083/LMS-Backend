import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
  name: string;
  password?: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  doc?: string;
  bio?: string;
  phone?: number;
  website?: string;
  profilePicture?: string;
  designation?: string;
  isGoogleUser?: boolean;
  isBlocked?: boolean;
  isVerified?: boolean;
  resetOtp?: number;
  resetOtpExpiry?: Date;
}