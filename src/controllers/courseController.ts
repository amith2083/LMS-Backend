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
    const courses = await this.courseService.getCourses();
    res.status(STATUS_CODES.OK).json(courses);
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