
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../middlewares/upload';
import { CourseController } from '../controllers/courseController';
import { CourseService } from '../services/courseService';
import { CourseRepository } from '../repositories/courseRepository';
import { FileUploadService } from '../services/fileUploadService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { CategoryService } from '../services/categoryService';
import { authenticateToken } from '../middlewares/authenciateToken';

const router = Router();
const courseRepo = new CourseRepository()
const categoryRepo = new CategoryRepository();
const fileUploadService = new FileUploadService();


const courseService = new CourseService(courseRepo,  categoryRepo,fileUploadService,);
const courseController = new CourseController(courseService);

router.get('/', asyncHandler(courseController.getCourses.bind(courseController)));
router.get('/admin', asyncHandler(courseController.getCoursesForAdmin.bind(courseController)));
router.get('/:id', asyncHandler(courseController.getCourse.bind(courseController)));
router.get('/instructor/:instructorId', asyncHandler(courseController.getCoursesByInstructorId.bind(courseController)));
  router.get("/related/:courseId", asyncHandler(courseController.getRelatedCourses.bind(courseController)));


router.post('/', asyncHandler(courseController.createCourse.bind(courseController)));
router.put('/:id', asyncHandler(courseController.updateCourse.bind(courseController)));
router.put('/:id/image', upload.single('image'), asyncHandler(courseController.updateCourseImage.bind(courseController)));
router.delete('/:id', asyncHandler(courseController.deleteCourse.bind(courseController)));

export default router;