import { Document, Types } from 'mongoose';
import { IUser } from '../user/IUser';

export interface IOtp extends Document {
  _id: Types.ObjectId;
  email: string;
  otp: number;
  expiresAt: number;
  purpose: 'verification' | 'reset';
  userData?: Partial<IUser>;
}