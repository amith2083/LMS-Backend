import { IUserDocument } from '../../models/user';
import { IUser } from '../../types/IUser';


export interface IUserRepository {
  getUsers(): Promise<IUserDocument[]>;
  getUserById(id: string): Promise<IUserDocument | null>;
  getUserByEmail(email: string): Promise<IUserDocument | null>;
  createUser(data: Partial<IUser>): Promise<IUserDocument>;
  updateUser(userId: string, data: Partial<IUser>): Promise<IUserDocument | null>;

}



