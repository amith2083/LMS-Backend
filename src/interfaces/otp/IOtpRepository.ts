export interface IOtp {
  email: string;
  otp: number;
  expiresAt: number;
}

export interface IOtpRepository {
  saveOtp(email: string, otp: number, expiresAt: number): Promise<void>;
  getOtpByEmail(email: string): Promise<IOtp | null>;
  deleteOtp(email: string): Promise<void>;
}