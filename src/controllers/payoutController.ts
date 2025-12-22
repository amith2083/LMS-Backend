import { Request, Response } from 'express';
import { IPayoutService } from '../interfaces/payout/IPayoutService';
import { STATUS_CODES } from '../constants/http';
import { IPayoutController } from '../interfaces/payout/IPayoutController';


export class PayoutController implements IPayoutController {
  constructor(private payoutService: IPayoutService) {}

  async getTotalEarnings(req: Request, res: Response): Promise<void> {
    const totalEarnings = await this.payoutService.getTotalEarnings(req.params.id);
    res.json(totalEarnings);
  }
   async getTotalEarningsForAdmin(req: Request, res: Response): Promise<void> {
    const totalEarnings = await this.payoutService.getTotalEarningsForAdmin();
    res.json(totalEarnings);
  }
}
