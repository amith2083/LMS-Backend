import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const connStr = process.env.MONGODB_CONNECTION_STRING;
    if (!connStr) throw new Error("MONGODB_CONNECTION_STRING is undefined");
    console.log("Connecting to:", connStr); 

    await mongoose.connect(connStr);
    console.log(" MongoDB connected");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};
