import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morganMiddleware from "./middlewares/morgan";
import logger from "./utils/logger";
import { dbConnect } from "./config/dbConnect";
import courseRouter from "./routes/courseRoute";
import moduleRouter from "./routes/moduleRoute";
import lessonRouter from "./routes/lessonRoute";

dotenv.config();

const app = express();
dbConnect();

app.use(express.json());
app.use(morganMiddleware);

// Routes
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/lessons", lessonRouter);

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
