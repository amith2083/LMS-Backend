import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import dotenv from "dotenv";
import morganMiddleware from "./middlewares/morgan";
import logger from "./utils/logger";
import { dbConnect } from "./config/dbConnect";
import cors from 'cors'
import csrfRouter from "./routes/csrfRoute";
import cookieParser from "cookie-parser";
import courseRouter from "./routes/courseRoute";
import moduleRouter from "./routes/moduleRoute";
import lessonRouter from "./routes/lessonRoute";
import categoryRouter from "./routes/categoryRoute";
import userRouter from "./routes/userRoute";
import quizRouter from "./routes/quizRoute";
import enrollmentRouter from "./routes/enrollmentRoute";
import { AppError } from "./utils/asyncHandler";

dotenv.config();

const app = express();
dbConnect();
app.use(cookieParser());
app.use(express.json());
app.use(morganMiddleware);
app.use(cors({
  origin: "http://localhost:3000", 
  // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Explicitly allow PATCH
  //   allowedHeaders: ["Content-Type", "X-CSRF-Token"], // Allow CSRF token header
  credentials: true
}));

// Routes
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/quizsets", quizRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/", csrfRouter);

// Centralized error-handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

// Attach after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
