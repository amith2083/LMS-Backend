
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../middlewares/upload';
import { CategoryController } from '../controllers/categoryController';
import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { FileUploadService } from '../services/fileUploadService';
import { CourseRepository } from '../repositories/courseRepository';

const router = Router();

// DI
const categoryRepo = new CategoryRepository();
const fileUploadService = new FileUploadService();
const courseRepo = new CourseRepository();

const categoryService = new CategoryService(categoryRepo, fileUploadService,courseRepo);
const categoryController = new CategoryController(categoryService);

// Routes
router.post('/', asyncHandler(categoryController.createCategory.bind(categoryController)));
router.get('/', asyncHandler(categoryController.getCategories.bind(categoryController)));
router.get('/:id', asyncHandler(categoryController.getCategory.bind(categoryController)));
router.put('/:id', asyncHandler(categoryController.updateCategory.bind(categoryController)));
router.put('/:id/image', upload.single('image'), asyncHandler(categoryController.updateCategoryImage.bind(categoryController)));
router.patch('/:id/publish', asyncHandler(categoryController.changeCategoryPublishState.bind(categoryController)));
router.delete('/:id', asyncHandler(categoryController.deleteCategory.bind(categoryController)));

export default router;