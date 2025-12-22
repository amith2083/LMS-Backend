import mongoose from "mongoose";
import { IPayout, Payout } from "../models/payout";
import { IPayoutRepository } from "../interfaces/payout/IPayoutRepository";

export class PayoutRepository implements IPayoutRepository {
  async createPayout(data: Partial<IPayout>): Promise<IPayout> {
    const payout = await Payout.create(data);
    return payout;
  }

  async getPendingPayoutsForInstructor(
    instructorId: string
  ): Promise<IPayout[]> {
    return Payout.find({ instructor: instructorId, status: "pending" })
      .populate("course", "title price")
      .populate("enrollment")
      .sort({ createdAt: -1 });
  }

  async getTotalEarnings(instructorId: string): Promise<number> {
    const result = await Payout.aggregate([
      { $match: { instructor: new mongoose.Types.ObjectId(instructorId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    return result[0]?.total || 0;
  }
  async getTotalEarningsForAdmin(): Promise<number> {
    const result = await Payout.aggregate([
      // No $match stage needed, since we want ALL payouts

      {
        $group: {
          _id: null, // Group all documents together
          totalPlatformFee: { $sum: "$platformFee" }, // Sum the platformFee field
        },
      },
    ]);

    return result[0]?.totalPlatformFee || 0;
  }
}
