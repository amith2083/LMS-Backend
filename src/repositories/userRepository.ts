
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { IUserDocument, User } from '../models/user';
import { IUser } from '../types/IUser';


export class UserRepository implements IUserRepository {
 async getUsers(): Promise<IUserDocument[]> {
    return User.find({ role: { $ne: 'admin' } }).select('-password');
  }

  async getUserById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ email });
  }

  async createUser(data: Partial<IUser>): Promise<IUserDocument> {
    return await User.create(data);
  
  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(userId, data, { new: true });
  }
}