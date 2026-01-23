export interface IPayout {
  
  instructor: string;
  course: string;
  enrollment: string;
  amount: number;//instructor fee
  platformFee: number;
  totalAmount: number;//course price
  status: "pending" | "paid";
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}