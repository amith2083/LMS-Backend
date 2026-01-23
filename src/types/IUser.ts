import mongoose from "mongoose";


export interface IUser  {

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
  isEmailVerified:boolean,
    createdAt: Date;
  updatedAt: Date;
 
}