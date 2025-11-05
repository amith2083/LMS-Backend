import { Request, Response } from "express";
import { ICourseController } from "../interfaces/course/ICourseController";
import { ICourseService } from "../interfaces/course/ICourseService";
import { STATUS_CODES } from "../constants/http";
import { ERROR_MESSAGES } from "../constants/messages";
export class CourseController implements ICourseController {
  private courseService: ICourseService;

  constructor(courseService: ICourseService) {
    this.courseService = courseService;
  }

 async getCourses(req: Request, res: Response): Promise<void> {
  const {
    search,
    categories: categoriesRaw,
    price: priceRaw,
    sort = '',
    page = '1',
    limit = '10',
  } = req.query;

  // Parse categories: Handle array or comma-separated string, filter empties
  let categories: string[] = [];
  if (categoriesRaw) {
    if (Array.isArray(categoriesRaw)) {
      categories = categoriesRaw.filter((c: string) => c && c.trim());
    } else {
      categories = (categoriesRaw as string).split(',').map((c: string) => c.trim()).filter(Boolean);
    }
  }

  // Parse price: Same as above
  let price: string[] = [];
  if (priceRaw) {
    if (Array.isArray(priceRaw)) {
      price = priceRaw.filter((p: string) => p && p.trim());
    } else {
      price = (priceRaw as string).split(',').map((p: string) => p.trim()).filter(Boolean);
    }
  }

  const params = {
    search: search as string,
    categories,
    price,
    sort: sort as string,
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  };

  const result = await this.courseService.getCourses(params);
  res.status(STATUS_CODES.OK).json(result);
}
  async getCourse(req: Request, res: Response): Promise<void> {
    const course = await this.courseService.getCourse(req.params.id);
    if (!course) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.NOT_FOUND });
      return;
    }
    res.status(STATUS_CODES.OK).json(course);
  }
async getCoursesByInstructorId(req: Request, res: Response): Promise<void> {
    const instructorId = req.params.instructorId;
    const courses = await this.courseService.getCoursesByInstructorId(instructorId);
    res.status(STATUS_CODES.OK).json(courses);
  }

 
  async getCourseForAdminById(req: Request, res: Response): Promise<void> {
    const course = await this.courseService.getCourseForAdminById(req.params.id);
    if (!course) {
      res.status(STATUS_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.NOT_FOUND });
      return;
    }
    res.status(STATUS_CODES.OK).json(course);
  }
  async createCourse(req: Request, res: Response): Promise<void> {
    const course = await this.courseService.createCourse(req.body);
    res.status(STATUS_CODES.CREATED).json(course);
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    const updated = await this.courseService.updateCourse(
      req.params.id,
      req.body
    );
    res.status(STATUS_CODES.OK).json(updated);
  }
  async updateCourseImage(req: Request, res: Response): Promise<void> {
    const file = req.file;

    const courseId = req.params.id;

    if (!file) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }

    const updatedCourse = await this.courseService.updateCourseImage(
      courseId,
      file
    );
    res.status(STATUS_CODES.OK).json(updatedCourse);
  }
  async deleteCourse(req: Request, res: Response): Promise<void> {
    await this.courseService.deleteCourse(req.params.id);
    res.status(STATUS_CODES.OK).send();
  }
}