import express, { Request, Response, NextFunction } from "express";
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

dotenv.config();

const app = express();
dbConnect();
app.use(cookieParser());
app.use(express.json());
app.use(morganMiddleware);
app.use(cors({
  origin: "http://localhost:3001", 
  credentials: true
}));

// Routes
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/quiz", quizRouter);
app.use("/", csrfRouter);

// Centralized error-handling middleware
app.use(
  (
    err: Error & { status?: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.error(err.stack || err.message); // Logs the error

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
