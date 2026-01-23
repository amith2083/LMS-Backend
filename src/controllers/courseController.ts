
import { Request, Response } from 'express';
import { ICourseController } from '../interfaces/course/ICourseController';
import { ICourseService } from '../interfaces/course/ICourseService';
import { STATUS_CODES } from '../constants/http';

export class CourseController implements ICourseController {
  constructor(private courseService: ICourseService) {}

  async getCourses(req: Request, res: Response): Promise<void> {
    const {
      search,
      category,
      price,
      sort,
      page = '1',
      limit = '8',
    } = req.query;

    const params = {
      search: search as string | undefined,
      category: category as string | undefined,
      price: price as string | undefined,
      sort: sort as string,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const result = await this.courseService.getCourses(params);
  
    res.json(result);
  }

  async getCourse(req: Request, res: Response): Promise<void> {
    const course = await this.courseService.getCourse(req.params.id);
    res.json(course); // ← Service throws 404
  }

  async getCoursesByInstructorId(req: Request, res: Response): Promise<void> {
    const courses = await this.courseService.getCoursesByInstructorId(req.params.instructorId);
    res.json(courses);
  }

  async getCoursesForAdmin(req: Request, res: Response): Promise<void> {
    const courses = await this.courseService.getCoursesForAdmin();
    res.json(courses);
  }
async getRelatedCourses(req: Request, res: Response): Promise<void> {
  const { courseId } = req.params;
  const courses = await this.courseService.getRelatedCourses(courseId);
  res.json(courses);
}

  async createCourse(req: Request, res: Response): Promise<void> {
    const course = await this.courseService.createCourse(req.body);
    res.status(STATUS_CODES.CREATED).json(course);
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    const{id} =req.params
 
    const updated = await this.courseService.updateCourse(id, req.body);
    res.json(updated);
  }

  async updateCourseImage(req: Request, res: Response): Promise<void> {
    const file = req.file;
    const updated = await this.courseService.updateCourseImage(req.params.id, file!);
    res.json(updated);
  }

  async deleteCourse(req: Request, res: Response): Promise<void> {
    await this.courseService.deleteCourse(req.params.id);
    res.status(STATUS_CODES.OK).json({ message: 'Course deleted' });
  }
}