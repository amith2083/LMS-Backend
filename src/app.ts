import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import dotenv from "dotenv";
import morganMiddleware from "./middlewares/morgan";
import logger from "./utils/logger";
import { dbConnect } from "./config/dbConnect";
import cors from "cors";
import cookieParser from "cookie-parser";
import courseRouter from "./routes/courseRoute";
import moduleRouter from "./routes/moduleRoute";
import lessonRouter from "./routes/lessonRoute";
import categoryRouter from "./routes/categoryRoute";
import userRouter from "./routes/userRoute";
import quizRouter from "./routes/quizRoute";
import enrollmentRouter from "./routes/enrollmentRoute";
import watchRouter from "./routes/watchRoute";
import reportRouter from "./routes/reportRoute";
import testimonialRouter from "./routes/testimonialRoute";
import certificateRouter from "./routes/certificateRoute";
import assessmentRouter from "./routes/assessmentRoute";
import payoutRouter from "./routes/payoutRoute";
import chatRouter from "./routes/chatbotRoute";
import { AppError } from "./utils/asyncHandler";
import { redisClient } from "./config/redis";
import mongoose from "mongoose";
import { VectorSearchRepository } from "./repositories/vectorRepository";
import OpenAI from "openai";
import { ChatbotService } from "./services/chatbotService";
import { ChatController } from "./controllers/chatbotController";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(morganMiddleware);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Routes
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/quizsets", quizRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/watch", watchRouter);
app.use("/api/report", reportRouter);
app.use("/api/testimonial", testimonialRouter);
app.use("/api/certificate", certificateRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/payout", payoutRouter);
app.use("/api/chat", chatRouter);
// Centralized error-handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

app.use(errorHandler);

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    // Connect MongoDB
    await dbConnect();
    console.log("MongoDB connected");
    const mongoClient = mongoose.connection.getClient();
    const vectorRepository = new VectorSearchRepository(mongoClient);
   
    const chatbotService = new ChatbotService(vectorRepository);
    const chatController = new ChatController(chatbotService);

    // Optional: store in app.locals so routes can access without globals
    app.locals.chatbotController = chatController;

    // Connect Redis
    await redisClient.connect();
    console.log("Redis connected");

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
