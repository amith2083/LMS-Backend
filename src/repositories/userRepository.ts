import { User } from "../models/user";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUser } from "../interfaces/user/IUser";
import { AppError } from "../utils/asyncHandler";

export class UserRepository implements IUserRepository {
  async getUsers(): Promise<IUser[]> {
    const users = await User.find({ role: { $ne: "admin" } });
    return users;
  }

  async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    return user;
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = await User.create(data);
    return user.toObject();
  }

  async updateUser(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    const updated = await User.findByIdAndUpdate(userId, data, {
      new: true,
    });
    if (!updated) throw new AppError(404, "User not found");
    return updated;
  }
}