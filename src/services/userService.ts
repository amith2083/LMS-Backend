import { IUser } from "../interfaces/user/IUser";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUserService } from "../interfaces/user/IUserService";
import bcrypt from 'bcrypt'
import { sendOtpEmail } from "../utils/sendOtpEmail";
import { generateOtpForEmail } from "../utils/generateOtp";


export class UserService implements IUserService {
    private userRepository: IUserRepository;
  
    constructor(userRepository: IUserRepository) {
      this.userRepository = userRepository;
    }

  async getUsers(): Promise<IUser[]> {
    return this.userRepository.getUsers();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return this.userRepository.getUserById(userId);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.getUserByEmail(email);
  }

  // async getLoggedInUser(): Promise<IUser | null> {
  //   const session = await auth();
  //   if (!session?.user?.email) return null;
  //   return this.userRepository.getUserByEmail(session.user.email);
  // }

  async createUser(
    data: Partial<IUser>,
    verificationDoc?: File
  ): Promise<IUser> {
    const existing = await this.userRepository.getUserByEmail(data.email!);
    if (existing) throw new Error("This email is already registered.");

    const userData: Partial<IUser> = {
      ...data,
      isVerified: data.role === "instructor" ? false : true,
    };

    let docData: { buffer: Buffer; fileName: string } | undefined;

    if (verificationDoc && data.role === "instructor") {
      const buffer = Buffer.from(await verificationDoc.arrayBuffer());
      docData = { buffer, fileName: verificationDoc.name };
    }

    const user = await this.userRepository.createUser(userData, docData);

    const otp = await generateOtpForEmail(data.email!);
    await sendOtpEmail(data.email!, otp);

    return user;
  }

  async updateUser(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.userRepository.updateUser(userId, data);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.userRepository.deleteUser(userId);
  }

  async verifyOtp(email: string, otp: number): Promise<boolean> {
    return this.userRepository.verifyOtp(email, otp);
  }

  async resendOtp(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const otp = await generateOtpForEmail(email);
    await sendOtpEmail(email, otp);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const otp = await generateOtpForEmail(email);
    await sendOtpEmail(email, otp);
  }

  async resetPassword(
    email: string,
    otp: number,
    newPassword: string
  ): Promise<void> {
    return this.userRepository.resetPassword(email, otp, newPassword);
  }
}
