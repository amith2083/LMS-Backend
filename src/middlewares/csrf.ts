import csurf from "csurf";
import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

export const csrfProtection = csurf({ cookie: true });

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts, please try again later.",
});

export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many refresh attempts, please try again later.",
});