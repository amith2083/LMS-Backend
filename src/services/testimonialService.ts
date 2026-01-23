
import { AppError } from '../utils/asyncHandler';
import { ITestimonialService } from '../interfaces/Testimonial/ITestimonialService';
import { ITestimonialRepository } from '../interfaces/Testimonial/ITestimonialRepository';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { STATUS_CODES } from '../constants/http';
import { ITestimonialDocument } from '../models/testimonial';



export class TestimonialService implements ITestimonialService {
  constructor(
    private testimonialRepository: ITestimonialRepository,
    private courseRepository: ICourseRepository 
  ) {}

  async createTestimonial(
    data: { review: string; rating: number },
    userId: string,
    courseId: string
  ): Promise<ITestimonialDocument> {
    if (!data.review || !data.rating) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Review and rating are required');
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Rating must be between 1 and 5');
    }
// PREVENT DUPLICATE REVIEW: Check if user already reviewed this course
  const existingTestimonial = await this.testimonialRepository.findOne({
    user: userId,
    courseId: courseId,
  });

  if (existingTestimonial) {
    throw new AppError(
      STATUS_CODES.BAD_REQUEST,
      'You have already submitted a review for this course'
    );
  }
    // Validate course exists
    const course = await this.courseRepository.getCourse(courseId);
    if (!course) throw new AppError(STATUS_CODES.NOT_FOUND, 'Course not found');

    

    const testimonial = await this.testimonialRepository.create({
      content: data.review,
      rating: data.rating,
      user: userId,
      courseId,
    });

    // Update course testimonials array
    await this.courseRepository.addTestimonialToCourse(
  courseId,
  testimonial._id.toString()
);

    return testimonial;
  }
}