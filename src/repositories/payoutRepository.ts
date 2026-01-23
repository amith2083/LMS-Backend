import mongoose from "mongoose";
import {  IPayoutDocument, Payout } from "../models/payout";
import { IPayoutRepository } from "../interfaces/payout/IPayoutRepository";
import { IPayout } from "../types/payout";

export class PayoutRepository implements IPayoutRepository {
  async createPayout(data: Partial<IPayout>): Promise<IPayoutDocument> {
    const payout = await Payout.create(data);
    return payout;
  }

  async getPendingPayoutsForInstructor(
    instructorId: string
  ): Promise<IPayoutDocument[]> {
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
