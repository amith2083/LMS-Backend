
import { IUser } from '../interfaces/user/IUser';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { User } from '../models/user';

export class UserRepository implements IUserRepository {
  async getUsers(): Promise<IUser[]> {
    return User.find({ role: { $ne: 'admin' } }).lean().exec();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).lean().exec();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).lean().exec();
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = await User.create(data);
    return user.toObject();
  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, data, { new: true }).lean().exec();
  }
}