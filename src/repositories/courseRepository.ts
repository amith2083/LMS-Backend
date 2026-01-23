
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { Course, ICourseDocument } from "../models/course";
import { ICourse } from "../types/course";

export class CourseRepository implements ICourseRepository {
  async getCourses(
    params: {
      search?: string;
      category?: string;
      price?: string;
      sort?: string;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const {
      search,
      category = "",
      price = "",
      sort = "",
      page = 1,
      limit = 6,
    } = params;

    const match: any = { status: true, isApproved: true };

    if (search) {
      match.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) match.category = category;
    if (price === "free") match.price = 0;
    if (price === "paid") match.price = { $gt: 0 };

    const totalCount = await Course.countDocuments(match);

    // Determine sorting
    const sortObj: any = {};
    if (sort === "price-asc") sortObj.price = 1;
    else if (sort === "price-desc") sortObj.price = -1;
    else sortObj.createdAt = -1; // Default: latest courses first;

    const skip = (page - 1) * limit;

    // const courses = await Course.find(match)
    //   .sort(sortObj)
    //   .skip(skip)
    //   .limit(limit)
    //   .populate('instructor category modules');
    const courses = await Course.find(match)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .select({
        title: 1,
        description: 1,
        thumbnail: 1,
        price: 1,
        category: 1,
        instructor: 1,
        modules: 1, // only to get length
      })
      .populate({
        path: "instructor",
        select: "name", 
      })
      .populate({
        path: "category",
        select: "title",
      })
      .populate({
        path: "modules",
        select: "_id",
      });
    // console.log('course',courses)

    const totalPages = Math.ceil(totalCount / limit);

    return { courses, totalCount, currentPage: page, totalPages };
  }

  async getCourse(id: string): Promise<ICourseDocument | null> {
    return await Course.findById(id)
      .populate({
        path: "instructor",
        select: "_id name email profilePicture designation", 
      })
      .populate({
        path: "category",
        select: "_id title", 
      })
      .populate({
        path: "modules",
        populate: { path: "lessonIds", model: "Lesson" },
      })
      .populate({
        path: "quizSet",
        populate: { path: "quizIds", model: "Quiz" },
      })
      .populate({
      path: 'testimonials',
      populate: {
        path: 'user',
        model: 'User',
        select: '_id name email profilePicture', 
      },
    
    })
      .sort({ createdOn: -1 });
  }
  async getCoursesByCategoryId(categoryId: string): Promise<ICourseDocument[]> {
    return await Course.find({ category: categoryId });
  }
  async getCoursesByQuizsetId(quizsetId: string): Promise<ICourseDocument[]> {
    return await Course.find({ quizSet: quizsetId });
  }

  async getCoursesByInstructorId(instructorId: string): Promise<ICourseDocument[]> {
    return await Course.find({ instructor: instructorId })
      .populate("instructor category modules")
      .sort({ createdOn: -1 });
  }

  async getCoursesForAdmin(): Promise<ICourseDocument[]> {
    return await Course.find({ status: true })
      .populate("instructor category modules")
      .sort({ createdOn: -1 });
  }
  async getRelatedCourses(
    categoryId: string,
    excludeId: string
  ): Promise<ICourseDocument[]> {
    return await Course.find({
      category: categoryId,
      _id: { $ne: excludeId }, // ← excludes current course
      status: true,
      isApproved: true,
    }).select('_id title thumbnail price')
      .sort({ createdAt: -1 })
      .limit(6)
      .populate({
      path: 'category',
      select: 'title', 
    })
  }
  async createCourse(data: Partial<ICourse>): Promise<ICourseDocument> {
    return await Course.create(data);
  }

  async updateCourse(
    id: string,
    data: Partial<ICourse>
  ): Promise<ICourseDocument | null> {
   return await Course.findByIdAndUpdate(id, data, { new: true });


  }
  async addModuleToCourse(courseId: string, moduleId: string): Promise<void> {
    const result = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { modules: moduleId } },
      { new: true }
    );
    return result;
  }

async addTestimonialToCourse(
  courseId: string,
  testimonialId: string
): Promise<void> {
  await Course.findByIdAndUpdate(courseId, {
    $push: { testimonials: testimonialId },
  });
}


  async removeModuleFromCourse(
    courseId: string,
    moduleId: string
  ): Promise<void> {
    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { modules: moduleId } },
      { new: true }
    );
  }

  async deleteCourse(id: string): Promise<void> {
    await Course.findByIdAndDelete(id);
  }
}
