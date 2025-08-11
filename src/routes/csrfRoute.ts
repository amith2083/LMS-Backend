import { Router, Request, Response } from "express";
import { csrfProtection } from "../middlewares/csrf";


const router = Router();

router.get("/csrf-token", csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default router;