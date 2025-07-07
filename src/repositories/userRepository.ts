import { User } from '../models/user';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { IUser } from '../interfaces/user/IUser';
import { AppError } from '../utils/asyncHandler';

export class UserRepository implements IUserRepository {
  async getUsers(): Promise<IUser[]> {
    const users = await User.find({ role: { $ne: 'admin' } }).lean();
    return users;
  }

  async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId).lean();
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).lean();
    return user;
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    console.log('userdatarespository',data)
    const user = await User.create(data);
    console.log('user',user.toObject())
    return user.toObject();
  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    const updated = await User.findByIdAndUpdate(userId, data, { new: true }).lean();
    if (!updated) throw new AppError(404, 'User not found');
    return updated;
  }

  async deleteUser(userId: string): Promise<void> {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) throw new AppError(404, 'User not found');
  }
}



// import { User } from "../models/user";
// import path from "path";
// import fs from "fs";
// import bcrypt from 'bcrypt'
// import { IUserRepository } from "../interfaces/user/IUserRepository";
// import { IUser } from "../interfaces/user/IUser";
// import { Otp } from "../models/otp";
// import { UpdateUserDTO } from "../DTOs/updateUserDTO";
// import cloudinary from "../utils/cloudinary";

// export class UserRepository implements IUserRepository {
//   async getUsers(): Promise<IUser[]> {
//     const users = await User.find({ role: { $ne: "admin" } })
//     return users;
//   }

//   async getUserById(userId: string): Promise<IUser | null> {
//     const user = await User.findById(userId).lean();
//     return user
//   }

//   async getUserByEmail(email: string): Promise<IUser | null> {
//     const user = await User.findOne({ email }).lean();
//     return user 
//   }
 

//  async createUser(
//     data: Partial<IUser>,
//     verificationDoc?: Express.Multer.File
//   ): Promise<IUser> {
//     if (data.password) {
//       data.password = await bcrypt.hash(data.password, 10);
//     }

//     if (verificationDoc) {
//       const base64String = `data:${verificationDoc.mimetype};base64,${verificationDoc.buffer.toString("base64")}`;
//       const uploadResult = await cloudinary.uploader.upload(base64String, {
//         folder: "verification-docs",
//         public_id: path.parse(verificationDoc.originalname).name,
//         resource_type: "auto",
//       });

//       data.doc = uploadResult.secure_url;
//     }

//     const user = await User.create(data);
//     return user.toObject();
//   }

//   async updateUser(userId: string, data: UpdateUserDTO): Promise<IUser | null> {
//     if (data.oldPassword) {
//       const user = await User.findById(userId);
//       if (!user) throw new Error("User not found");
//       const isMatch = await bcrypt.compare(data.oldPassword, user.password);
//       if (!isMatch) throw new Error("Old password is incorrect");
//       user.password = await bcrypt.hash(data.newPassword!, 10);
//       return  user.save().toObject();
//     } else {
//       const updated = await User.findByIdAndUpdate(userId, data, { new: true }).lean();
//       return updated 
//     }
//   }

//   async deleteUser(userId: string): Promise<void> {
//     const deleted = await User.findByIdAndDelete(userId);
//     if (!deleted) throw new Error("User not found");
//   }

//   // src/repositories/userRepository.ts
// async verifyOtp(email: string, otp: number): Promise<boolean> {
//   const otpDocument = await Otp.findOne({ email });
//   if (!otpDocument) {
//     const error = new Error('OTP not found');
//     (error as any).statusCode = 404; // Add status code
//     throw error;
//   }

//     if (Date.now() > otpDocument.expiresAt) {
//     const error = new Error('OTP has expired');
//     (error as any).statusCode = 400; // Bad request for expired OTP
//     throw error;
//   }
//   if (otpDocument.otp !== otp) {
//     const error = new Error('Invalid OTP');
//     (error as any).statusCode = 400; // Bad request for invalid OTP
//     throw error;
//   }

//   await Otp.deleteOne({ email });
//   const user = await User.findOne({ email });
//   if (user) {
//     user.isVerified = true; // Assuming verification sets isVerified to true
//     await user.save();
//   }
//   return true;
// }

//   async resetPassword(email: string, otp: number, newPassword: string): Promise<void> {
//     const otpDocument = await Otp.findOne({ email });
//     if (!otpDocument) throw new Error("OTP not found");
//     if (otpDocument.otp !== otp) throw new Error("Invalid OTP");
//     if (Date.now() > otpDocument.expiresAt) throw new Error("OTP has expired");
//     const user = await User.findOne({ email });
//     if (!user) throw new Error("User not found");
//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();
//     await Otp.deleteOne({ email });
//   }
// }
