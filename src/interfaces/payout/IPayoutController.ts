import { Request, Response } from "express";

export interface IPayoutController {
  getTotalEarnings(req: Request, res: Response): Promise<void>;
  getTotalEarningsForAdmin(req: Request, res: Response): Promise<void>;

}