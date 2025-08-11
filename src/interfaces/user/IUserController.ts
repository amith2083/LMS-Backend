import { Request, Response } from 'express';

export interface IUserController {
  getUsers(req: Request, res: Response): Promise<void>;
  getUserById(req: Request, res: Response): Promise<void>;
 
  createUser(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  // deleteUser(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
   login(req: Request, res: Response): Promise<void>;
   googleSync(req: Request, res: Response): Promise<void>;
}