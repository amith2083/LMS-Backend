import { ICourse } from "../interfaces/course/ICourse";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { Course } from "../models/course";

export class CourseRepository implements ICourseRepository {
  async getCourses(): Promise<ICourse[]> {
    return Course.find({status:true,isApproved:true}).populate("instructor category modules").lean();
  }

 async getCourse(id: string): Promise<ICourse | null> {
  return Course.findById(id)
    .populate("instructor category")
    .populate({
      path: "modules",
      populate: {
        path: "lessonIds", // the field inside module schema
        model: "Lesson",   // make sure the model name matches your Lesson schema
      },
    })
    .lean();
}
  // New method to get courses by instructor ID
  async getCoursesByInstructorId(instructorId: string): Promise<ICourse[]> {
 return await Course.find({ instructor: instructorId })
      .populate("instructor category modules")
      .lean();
    
      
  }

  async getCourseForAdminById(id: string): Promise<ICourse | null> {
    return await Course.find({ _id: id, status: true })
      .populate("instructor category modules")
      .lean();
  }

  async createCourse(data: Partial<ICourse>): Promise<ICourse> {
    const course = new Course(data);
    return await course.save(); 
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    console.log('details',id,data)
    return Course.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async deleteCourse(id: string): Promise<void> {
    await Course.findByIdAndDelete(id);
  }
}