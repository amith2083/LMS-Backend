
import { ICourse } from '../interfaces/course/ICourse';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { Course } from '../models/course';

export class CourseRepository implements ICourseRepository {
  async getCourses(params: {
    search?: string;
    category?: string;
    price?: string;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const {
      search,
      category = '',
      price = '',
      sort = '',
      page = 1,
      limit = 2,
    } = params;

    const match: any = { status: true, isApproved: true };

    if (search) {
      match.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) match.category = category;
    if (price === 'free') match.price = 0;
    if (price === 'paid') match.price = { $gt: 0 };

    const totalCount = await Course.countDocuments(match);

    const sortObj: any = {};
    if (sort === 'price-asc') sortObj.price = 1;
    if (sort === 'price-desc') sortObj.price = -1;

    const skip = (page - 1) * limit;

    const courses = await Course.find(match)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('instructor category modules')
      .lean();

    const totalPages = Math.ceil(totalCount / limit);

    return { courses, totalCount, currentPage: page, totalPages };
  }

  async getCourse(id: string): Promise<ICourse | null> {
    return await Course.findById(id)
      .populate('instructor category')
      .populate({
        path: 'modules',
        populate: { path: 'lessonIds', model: 'Lesson' },
      })
      .lean();
  }
  async getCoursesByCategoryId(categoryId: string): Promise<ICourse[]> {
  return Course.find({ category: categoryId }).lean().exec();
}
async getCoursesByQuizsetId(quizsetId: string): Promise<ICourse[]> {
  return Course.find({ quizSet: quizsetId }).lean().exec();
}

  async getCoursesByInstructorId(instructorId: string): Promise<ICourse[]> {
    return await Course.find({ instructor: instructorId })
      .populate('instructor category modules')
      .lean();
  }

  async getCoursesForAdmin(): Promise<ICourse[]> {
    return await Course.find({ status: true })
      .populate('instructor category modules')
      .sort({ createdOn: -1 })
      .lean();
  }

  async createCourse(data: Partial<ICourse>): Promise<ICourse> {
    const course = new Course(data);
    return await course.save();
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async deleteCourse(id: string): Promise<void> {
    await Course.findByIdAndDelete(id);
  }
}