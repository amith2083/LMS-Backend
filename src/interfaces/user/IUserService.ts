import { Express } from "express";
import { GetEmailUserResponseDTO,  LoginUserResponseDTO,  UpdateUserResponseDTO,  UserResponseDTO } from "../../dtos/userDto";
import { IUser } from "../../types/IUser";



export interface IUserService {
  getUsers(): Promise<UserResponseDTO[]>;
  getUserById(id: string): Promise<UserResponseDTO | null>;
  getUserByEmail(email: string): Promise<GetEmailUserResponseDTO| null>;
  createUser(
    data: Partial<IUser>,
    verificationDoc?: Express.Multer.File
  ): Promise<{ message: string }>;
  updateUser(userId: string, data: Partial<IUser>): Promise<UpdateUserResponseDTO | null>;
  login(email: string, password: string): Promise<LoginUserResponseDTO|null>;
  googleSync(email: string, name: string, image: string): Promise<LoginUserResponseDTO|null>;
  checkTokenReuse(jti: string): Promise<boolean>;
  markTokenAsUsed(jti: string): Promise<void>;
}
