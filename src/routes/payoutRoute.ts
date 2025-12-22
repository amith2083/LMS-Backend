import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { PayoutRepository } from "../repositories/payoutRepository";
import { PayouteService } from "../services/payoutService";
import { PayoutController } from "../controllers/payoutController";
import { authenticateToken } from "../middlewares/authenciateToken";

const router = Router();

// DI
const payoutRepo = new PayoutRepository();

const payoutService = new PayouteService(payoutRepo);
const payoutController = new PayoutController(payoutService);

// Routes
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(payoutController.getTotalEarnings.bind(payoutController))
);
router.get(
  "/",
  authenticateToken,
  asyncHandler(payoutController.getTotalEarningsForAdmin.bind(payoutController))
);

export default router;
