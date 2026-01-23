

export interface IPayoutService {
  getTotalEarnings(instructorId: string): Promise<number>;
  getTotalEarningsForAdmin(): Promise<number>;
}
