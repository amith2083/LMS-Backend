import { IPayout } from "../../models/payout";


export interface IPayoutRepository {
  createPayout(data:Partial<IPayout>): Promise<IPayout>;
  getPendingPayoutsForInstructor(instructorId: string): Promise<IPayout[]>;
  getTotalEarnings(instructorId: string): Promise<number>;
  getTotalEarningsForAdmin(): Promise<number>;


}