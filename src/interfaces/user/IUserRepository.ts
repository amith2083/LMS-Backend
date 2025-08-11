import { IUser } from './IUser';

export interface IUserRepository {
  getUsers(): Promise<IUser[]>;
  getUserById(userId: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(data: Partial<IUser>): Promise<IUser>;
  updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null>;
  // deleteUser(userId: string): Promise<void>;
}




// import { IUser } from './IUser';


// export interface IUserRepository {
//   getUsers(): Promise<IUser[]>;
//   getUserById(userId: string): Promise<IUser | null>;
//   getUserByEmail(email: string): Promise<IUser | null>;
//   createUser(data: Partial<IUser>,   verificationDoc?: Express.Multer.File
// ): Promise<IUser>;
//   updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null>;
//   deleteUser(userId: string): Promise<void>;
//   verifyOtp(email: string, otp: number): Promise<boolean>;
//   resetPassword(email: string, otp: number, newPassword: string): Promise<void>;
// }