import morgan from "morgan";
import logger from "../utils/logger";

// Add a timestamp token
morgan.token("timestamp", () => new Date().toISOString());

const morganFormat = ":timestamp :method :url :status - :response-time ms";

// Colorize status codes
const colorizeStatus = (status: number): string => {
    if (status >= 500) return `\x1b[31m${status}\x1b[0m`; // Red
    if (status >= 400) return `\x1b[33m${status}\x1b[0m`; // Yellow
    return `\x1b[32m${status}\x1b[0m`; // Green
};

const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: (message: string) => {
            const trimmedMessage = message.trim();
            logger.info(trimmedMessage); // Log to file

            // Extract status and colorize it for terminal display
            const match = trimmedMessage.match(/(\S+)\s+(\S+)\s+(\S+)\s+(\d{3})\s+-\s+([\d.]+)\s+ms/);
            if (match) {
                const [, timestamp, method, url, status, responseTime] = match;
                const coloredStatus = colorizeStatus(Number(status));
                const coloredMessage = `${timestamp} ${method} ${url} ${coloredStatus} - ${responseTime} ms`;
                console.log(coloredMessage);
            }
        }
    }
});

export default morganMiddleware;
