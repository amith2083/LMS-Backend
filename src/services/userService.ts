import { AppError } from '../utils/asyncHandler';
import { IUser } from '../interfaces/user/IUser';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { IFileUploadService } from '../interfaces/file/IFileUploadService';
import { IOtpService } from '../interfaces/otp/IOtpService';
import bcrypt from 'bcrypt';
import { Express } from 'express';
import { STATUS_CODES } from '../constants/http';
import { IUserService } from '../interfaces/user/IUserService';
import { GetEmailUserResponseDTO, LoginUserResponseDTO, UpdateUserResponseDTO, UserResponseDTO } from '../dtos/userDto';
import { mapUserDocumentToDTO, mapUserDocumentToGetEmailResponseDTO, mapUserDocumentToLoginUserResponeDto, mapUserDocumentToUpdateUserResponDto,  } from '../mappers/userMapper';
import { IUserDocument } from '../models/user';
import { GetEmailResponse } from 'resend';



const usedJtis = new Set<string>(); // In-memory jti blacklist

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private fileUploadService: IFileUploadService,
    private otpService: IOtpService
  ) {}

 async getUsers(): Promise<UserResponseDTO[]> {
  const users = await this.userRepository.getUsers();
  return users.map(mapUserDocumentToDTO);
}

  async getUserById(userId: string): Promise<UserResponseDTO | null> {
   const user = await this.userRepository.getUserById(userId);
 
    return user? mapUserDocumentToDTO(user):null;
  }

  async getUserByEmail(email: string): Promise<GetEmailUserResponseDTO|null> {
    const user = await this.userRepository.getUserByEmail(email);
  return user? mapUserDocumentToGetEmailResponseDTO(user):null;
  }

  async createUser(data: Partial<IUser>, verificationDoc?: Express.Multer.File): Promise<{ message: string }> {
    // if (!data.email || !data.password) {
    //   throw new AppError(STATUS_CODES.BAD_REQUEST, 'Email and password are required');
    // }

    const existing = await this.userRepository.getUserByEmail(data.email!);
    if (existing) throw new AppError(STATUS_CODES.CONFLICT, 'This email is already registered.');

    const hashedPassword = await bcrypt.hash(data.password!, 10);
    let docUrl: string | undefined;
    if (verificationDoc) {
      docUrl = await this.fileUploadService.uploadFile(verificationDoc, 'verification-docs');
    }

  
    await this.userRepository.createUser({
  ...data,
  password: hashedPassword,
  isEmailVerified: false,
  isVerified: data.role === 'instructor' ? false : true,
  doc: docUrl,
});

    await this.otpService.sendOtp(data.email!, 'verification',);
    return { message: 'OTP sent for verification' };
  }

  async updateUser(userId: string, data: Partial<IUser>& { oldPassword?: string; newPassword?: string }): Promise<UpdateUserResponseDTO|null> {
  
    if (data.oldPassword) {
        if (!data.newPassword) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      'New password is required'
    );
  }
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
    // if (!updated) throw new AppError(STATUS_CODES.NOT_FOUND, 'User not found');
    return updated? mapUserDocumentToUpdateUserResponDto(updated):null;
  }

  async login(email: string, password: string): Promise<LoginUserResponseDTO|null> {
    const user = await this.userRepository.getUserByEmail(email);
    
 if (!user) {
    throw new AppError(STATUS_CODES.BAD_REQUEST, 'Invalid credentials');
  }
  if (!user.isEmailVerified) {
  // Auto-resend fresh OTP
  await this.otpService.sendOtp(email, 'verification');

  throw new AppError(
    STATUS_CODES.FORBIDDEN,
    'Email not verified. A new verification code has been sent to your email.'
  );
}
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

    return user? mapUserDocumentToLoginUserResponeDto(user):null;
  }

  async googleSync(email: string, name: string, image: string): Promise<LoginUserResponseDTO|null> {
      // 1. Try to find existing user
  const existingUser = await this.userRepository.getUserByEmail(email);

  // 2. If user exists
  if (existingUser) {
    // Instructor restriction
    if (existingUser.role === 'instructor') {
      throw new AppError(
        STATUS_CODES.FORBIDDEN,
        'Instructors cannot sign in using Google. Please use email & password.'
      );
    }

    // Sync Google data if not already linked
    if (!existingUser.isGoogleUser) {
      const updatedUser = await this.userRepository.updateUser(
        existingUser._id.toString(),
        {
          isGoogleUser: true,
          profilePicture: image,
        }
      );

      // Absolute safety guard
      if (!updatedUser) {
        throw new AppError(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          'Failed to sync Google account'
        );
      }

      return updatedUser? mapUserDocumentToLoginUserResponeDto(updatedUser):null;
    }

    return existingUser? mapUserDocumentToLoginUserResponeDto(existingUser):null;
  }

  // 3. If user does not exist → create
  const newUser = await this.userRepository.createUser({
    email,
    name,
    profilePicture: image,
    isGoogleUser: true,
    isVerified: true,
    isEmailVerified: true,
  });

  return newUser? mapUserDocumentToLoginUserResponeDto(newUser):null;
}

  async checkTokenReuse(jti: string): Promise<boolean> {
    return usedJtis.has(jti);
  }

  async markTokenAsUsed(jti: string): Promise<void> {
    usedJtis.add(jti);
  }
}