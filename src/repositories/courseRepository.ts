import { ICourse } from "../interfaces/course/ICourse";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { Category } from "../models/category";
import { Course } from "../models/course";

export class CourseRepository implements ICourseRepository {
 async getCourses(params: {
    search?: string;
    categories?: string[];
    price?: string[]; // 'free' | 'paid'
    sort?: string; // 'price-asc' | 'price-desc'
    page?: number;
    limit?: number;
  } = {}): Promise<{
    courses: ICourse[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const {
      search,
      categories = [],
      price = [],
      sort = '',
      page = 1,
      limit = 10,
    } = params;

    // Build match query
    const match: any = { status: true, isApproved: true };

    // Search
    if (search) {
      match.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Categories filter: Map slugs/lowercase titles to ObjectIds
    if (categories.length > 0) {
      // Build OR conditions for case-insensitive exact title match
      const categoryMatchConditions = categories.map(cat => ({
        title: { $regex: `^${cat}$`, $options: 'i' }
      }));

      const catAggregation = await Category.aggregate([
        { $match: { $or: categoryMatchConditions } },
        { $project: { _id: 1 } }
      ]);
     

      const categoryIds = catAggregation.map((cat: any) => cat._id);
      if (categoryIds.length === 0) {
        // No matching categories: Return empty results
        return {
          courses: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0,
        };
      }
      match.category = { $in: categoryIds };
    }

    // Price filter: Use $or for free/paid
    if (price.length > 0) {
      const priceConditions: any[] = [];
      if (price.includes('free')) {
        priceConditions.push({ price: 0 });
      }
      if (price.includes('paid')) {
        priceConditions.push({ price: { $gt: 0 } });
      }
      if (priceConditions.length > 0) {
        match.$or = priceConditions;
      }
    }

    // Count total
    const totalCount = await Course.countDocuments(match);

    // Sort
    const sortObj: any = {};
    if (sort === 'price-asc') {
      sortObj.price = 1;
    } else if (sort === 'price-desc') {
      sortObj.price = -1;
    } // Default: no sort or add 'createdAt: -1' if needed

    // Paginate
    const skip = (page - 1) * limit;

    // Fetch courses
    const courses = await Course.find(match)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("instructor category modules")
      
     

    const totalPages = Math.ceil(totalCount / limit);

    return {
      courses,
      totalCount,
      currentPage: page,
      totalPages,
    };
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