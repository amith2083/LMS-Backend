import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";





const router = Router();



router.post(
  "/",
  (req, res, next) => {
    const controller = req.app.locals.chatbotController;
    if (!controller) {
      return next(new Error("Chat controller not initialized"));
    }
    return asyncHandler(controller.chat.bind(controller))(req, res, next);
  }
);

export default router;
