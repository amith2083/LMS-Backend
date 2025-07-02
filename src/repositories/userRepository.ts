import { User } from "../models/user";
import path from "path";
import fs from "fs";
import bcrypt from 'bcrypt'
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUser } from "../interfaces/user/IUser";
import { Otp } from "../models/otp";
import { UpdateUserDTO } from "../DTOs/updateUserDTO";

export class UserRepository implements IUserRepository {
  async getUsers(): Promise<IUser[]> {
    const users = await User.find({ role: { $ne: "admin" } })
    return users;
  }

  async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId).lean();
    return user
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).lean();
    return user 
  }

  async createUser(data: Partial<IUser>, verificationDoc?: { buffer: Buffer; fileName: string }): Promise<IUser> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    if (verificationDoc) {
      const filePath = path.join("public/uploads/verifications", verificationDoc.fileName);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, verificationDoc.buffer);
      data.doc = verificationDoc.fileName;
    }
    const user = await User.create(data);
    return user.toObject();
  }

  async updateUser(userId: string, data: UpdateUserDTO): Promise<IUser | null> {
    if (data.oldPassword) {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
      const isMatch = await bcrypt.compare(data.oldPassword, user.password);
      if (!isMatch) throw new Error("Old password is incorrect");
      user.password = await bcrypt.hash(data.newPassword!, 10);
      return  user.save().toObject();
    } else {
      const updated = await User.findByIdAndUpdate(userId, data, { new: true }).lean();
      return updated 
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) throw new Error("User not found");
  }

  async verifyOtp(email: string, otp: number): Promise<boolean> {
    const otpDocument = await Otp.findOne({ email });
    if (!otpDocument) throw new Error("OTP not found");
    if (otpDocument.otp !== otp) throw new Error("Invalid OTP");
    if (Date.now() > otpDocument.expiresAt) throw new Error("OTP has expired");
    await Otp.deleteOne({ email });
    const user = await User.findOne({ email });
    if (user) await user.save();
    return true;
  }

  async resetPassword(email: string, otp: number, newPassword: string): Promise<void> {
    const otpDocument = await Otp.findOne({ email });
    if (!otpDocument) throw new Error("OTP not found");
    if (otpDocument.otp !== otp) throw new Error("Invalid OTP");
    if (Date.now() > otpDocument.expiresAt) throw new Error("OTP has expired");
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await Otp.deleteOne({ email });
  }
}
