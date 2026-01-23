import { IPayoutRepository } from "../interfaces/payout/IPayoutRepository";
import { IPayoutService } from "../interfaces/payout/IPayoutService";
import { AppError } from "../utils/asyncHandler";


export class PayouteService implements IPayoutService {
  constructor(
    private payoutRepository: IPayoutRepository,
  
  ) {}


  async getTotalEarnings(instructorId: string): Promise<number> {
    const totalEarnings = await this.payoutRepository.getTotalEarnings(instructorId);
    
    return totalEarnings;
  }
   async getTotalEarningsForAdmin(): Promise<number> {
    const totalEarnings = await this.payoutRepository.getTotalEarningsForAdmin();
    
    return totalEarnings;
  }
  
  
  
}