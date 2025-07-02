import { IUser } from './IUser';


export interface IUserService {
  getUsers(): Promise<IUser[]>;
  getUserById(userId: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  // getLoggedInUser(): Promise<IUser | null>;
  createUser(data: Partial<IUser>, verificationDoc?: File): Promise<IUser>;
  updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null>;
  deleteUser(userId: string): Promise<void>;
  verifyOtp(email: string, otp: number): Promise<boolean>;
  resendOtp(email: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(email: string, otp: number, newPassword: string): Promise<void>;
}
