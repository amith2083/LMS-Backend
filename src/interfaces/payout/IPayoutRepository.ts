import { IPayoutDocument } from "../../models/payout";
import { IPayout } from "../../types/payout";



export interface IPayoutRepository {
  createPayout(data:Partial<IPayout>): Promise<IPayoutDocument>;
  getPendingPayoutsForInstructor(instructorId: string): Promise<IPayoutDocument[]>;
  getTotalEarnings(instructorId: string): Promise<number>;
  getTotalEarningsForAdmin(): Promise<number>;


}