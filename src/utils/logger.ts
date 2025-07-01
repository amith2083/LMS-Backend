
import path from "path";
import fs from "fs";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const logDir = path.join(__dirname, "../../logs");

// Ensure the logs folder exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

// Daily rotating log file for all logs
const dailyLogTransport = new transports.DailyRotateFile({
    filename: path.join(logDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "10m",
    maxFiles: "14d", // Keep logs for 14 days
    zippedArchive: true,
});

// Daily rotating log file for errors
const errorLogTransport = new transports.DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    level: "error",
    datePattern: "YYYY-MM-DD",
    maxSize: "5m",
    maxFiles: "30d", // Keep error logs for 30 days
    zippedArchive: true,
});

const logger = createLogger({
    level: "info",
    format: logFormat,
    transports: [
        dailyLogTransport,
        errorLogTransport,
    ],
});

// Show logs in the terminal in development
if (process.env.NODE_ENV !== "production") {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            logFormat
        )
    }));
}

export default logger;
