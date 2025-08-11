import { ICourse } from "../interfaces/course/ICourse";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { Course } from "../models/course";

export class CourseRepository implements ICourseRepository {
  async getCourses(): Promise<ICourse[]> {
    return Course.find({status:true}).populate("instructor category modules").lean();
  }

  async getCourse(id: string): Promise<ICourse | null> {
    return Course.findById(id).populate("instructor category modules").lean();
  }

  async createCourse(data: Partial<ICourse>): Promise<ICourse> {
    const course = new Course(data);
    return await course.save(); 
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return Course.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async deleteCourse(id: string): Promise<void> {
    await Course.findByIdAndDelete(id);
  }
}