import { Router } from "express";
import { CategoryRepository } from "../repositories/categoryRepository";
import { CategoryService } from "../services/categoryService";
import { CategoryController } from "../controllers/categoryController";
import { asyncHandler } from "../utils/asyncHandler";


const router = Router();

const categoryRepo = new CategoryRepository();
const categoryService = new CategoryService(categoryRepo);
const categoryController = new CategoryController(categoryService);

router.post("/", asyncHandler((req, res) => categoryController.createCategory(req, res)));
router.get("/", asyncHandler((req, res) => categoryController.getCategories(req, res)));
router.get("/:id", asyncHandler((req, res) => categoryController.getCategory(req, res)));
router.put("/:id", asyncHandler((req, res) => categoryController.updateCategory(req, res)));
router.patch("/:id/publish", asyncHandler((req, res) => categoryController.changeCategoryPublishState(req, res)));
router.delete("/:id", asyncHandler((req, res) => categoryController.deleteCategory(req, res)));

export default router;
