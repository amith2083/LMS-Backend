import { AppError } from '../utils/asyncHandler';
import { IUser } from '../interfaces/user/IUser';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { IFileUploadService } from '../interfaces/file/IFileUploadService';
import { IOtpService } from '../interfaces/otp/IOtpService';
import bcrypt from 'bcrypt';
import { Express } from 'express';
import { STATUS_CODES } from '../constants/http';
import { IUserService } from '../interfaces/user/IUserService';


const usedJtis = new Set<string>(); // In-memory jti blacklist

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private fileUploadService: IFileUploadService,
    private otpService: IOtpService
  ) {}

  async getUsers(): Promise<IUser[]> {
    return this.userRepository.getUsers();
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new AppError(STATUS_CODES.NOT_FOUND, 'User not found');
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new AppError(STATUS_CODES.NOT_FOUND, 'User not found');
    return user;
  }

  async createUser(data: Partial<IUser>, verificationDoc?: Express.Multer.File): Promise<{ message: string }> {
    if (!data.email || !data.password) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Email and password are required');
    }

    const existing = await this.userRepository.getUserByEmail(data.email);
    if (existing) throw new AppError(STATUS_CODES.CONFLICT, 'This email is already registered.');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    let docUrl: string | undefined;
    if (verificationDoc) {
      docUrl = await this.fileUploadService.uploadFile(verificationDoc, 'verification-docs');
    }

    const userData: Partial<IUser> = {
      ...data,
      password: hashedPassword,
      isVerified: data.role === 'instructor' ? false : true,
      isEmailVerified: false,
      doc: docUrl,
    };

    await this.otpService.sendOtp(data.email, 'verification', userData);
    return { message: 'OTP sent for verification' };
  }

  async updateUser(userId: string, data: Partial<IUser>& { oldPassword?: string; newPassword?: string }): Promise<IUser> {
  
    if (data.oldPassword) {
      const user = await this.userRepository.getUserById(userId);
      if (!user || !user.password) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'User or password not found');
    }
      const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Incorrect old password');
    }
      data.password = await bcrypt.hash(data.newPassword, 10);
      // Clean up temporary fields
    delete (data as any).oldPassword;
    delete (data as any).newPassword;
    }
    const updated = await this.userRepository.updateUser(userId, data);
    if (!updated) throw new AppError(STATUS_CODES.NOT_FOUND, 'User not found');
    return updated;
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user || !user.password) throw new AppError(STATUS_CODES.BAD_REQUEST, 'Invalid credentials');
    if (user.isBlocked) throw new AppError(STATUS_CODES.FORBIDDEN, 'Your account has been blocked by the admin.');

    if (!user.isEmailVerified) {
      await this.otpService.resendOtp(email);
      throw new AppError(STATUS_CODES.FORBIDDEN, 'Email not verified. A new OTP has been sent.');
    }

    if (user.role === 'instructor' && !user.isVerified) {
      throw new AppError(STATUS_CODES.FORBIDDEN, 'Instructor account not approved by admin.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError(STATUS_CODES.BAD_REQUEST, 'Invalid credentials');

    return user;
  }

  async googleSync(email: string, name: string, image: string): Promise<IUser> {
    let user = await this.userRepository.getUserByEmail(email);
    // 1. Check if account is blocked
  // if (user.isBlocked) {
  //     throw new AppError(
  //       STATUS_CODES.FORBIDDEN,
  //       'Your account has been blocked by the admin.'
  //     );
  //   }

   // 2. Instructor trying to use Google login
if (user.role === 'instructor') {
  throw new AppError(
    STATUS_CODES.FORBIDDEN,
    'Instructors cannot sign in using Google. Please use the email and password login method.'
  );
}

    if (!user) {
      user = await this.userRepository.createUser({
        email,
        name,
        profilePicture: image,
        isGoogleUser: true,
        isVerified: true,
        isEmailVerified: true,
      });
    } else if (!user.isGoogleUser) {
      user = await this.userRepository.updateUser(user._id.toString(), {
        isGoogleUser: true,
        profilePicture: image,
      });
    }

    return user;
  }

  async checkTokenReuse(jti: string): Promise<boolean> {
    return usedJtis.has(jti);
  }

  async markTokenAsUsed(jti: string): Promise<void> {
    usedJtis.add(jti);
  }
}