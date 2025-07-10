import { Router } from "express";


import { ModuleController } from "../controllers/moduleController";
import { ModuleService } from "../services/moduleService";
import { ModuleRepository } from "../repositories/moduleRepository";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Dependency Injection
const moduleRepo = new ModuleRepository();
const moduleService = new ModuleService(moduleRepo);
const moduleController = new ModuleController(moduleService);

// Routes
router.post("/", asyncHandler((req, res) => moduleController.createModule(req, res)));
router.get("/:id", asyncHandler((req, res) => moduleController.getModule(req, res)));
router.put("/:id", asyncHandler((req, res) => moduleController.updateModule(req, res)));
// router.patch("/:id/publish", asyncHandler((req, res) => moduleController.changeModulePublishState(req, res)));
router.delete("/:id", asyncHandler((req, res) => moduleController.deleteModule(req, res)));

export default router;
