import {
  GetEmailUserResponseDTO,
  LoginUserResponseDTO,
  UpdateUserResponseDTO,
  UserResponseDTO,
} from "../dtos/userDto";
import { IUserDocument } from "../models/user";

export const mapUserDocumentToDTO = (user: IUserDocument): UserResponseDTO => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isBlocked: user.isBlocked,
  isVerified: user.isVerified,
  profilePicture: user.profilePicture,
  bio: user.bio,
  createdAt: user.createdAt,
});

export const mapUserDocumentToGetEmailResponseDTO = (
  user: IUserDocument
): GetEmailUserResponseDTO => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  password: user.password,
  role: user.role,
  isBlocked: user.isBlocked,
  isEmailVerified: user.isEmailVerified,
  isVerified: user.isVerified,
});

export const mapUserDocumentToLoginUserResponeDto = (
  user: IUserDocument
): LoginUserResponseDTO => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isBlocked: user.isBlocked,
  isVerified: user.isVerified,
  profilePicture: user.profilePicture,
});

export const mapUserDocumentToUpdateUserResponDto = (
  user: IUserDocument
): UpdateUserResponseDTO => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isBlocked: user.isBlocked,
  profilePicture: user?.profilePicture,
  updatedAt :user.updatedAt
});


