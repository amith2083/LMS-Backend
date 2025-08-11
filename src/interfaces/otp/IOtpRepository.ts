import { IUser } from "../user/IUser";
import { IOtp } from "./IOtp";



export interface IOtpRepository {
  saveOtp(email: string, otp: number, expiresAt: number,purpose: "verification" | "reset",
  userData?: Partial<IUser>): Promise<void>;
  getOtpByEmail(email: string): Promise<IOtp | null>;
  deleteOtp(email: string): Promise<void>;
}