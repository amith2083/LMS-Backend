
import { AppError } from '../utils/asyncHandler';
import { ITestimonialService } from '../interfaces/Testimonial/ITestimonialService';
import { ITestimonialRepository } from '../interfaces/Testimonial/ITestimonialRepository';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { STATUS_CODES } from '../constants/http';
import { ITestimonial } from '../interfaces/Testimonial/ITestimonial';


export class TestimonialService implements ITestimonialService {
  constructor(
    private testimonialRepository: ITestimonialRepository,
    private courseRepository: ICourseRepository // ← Use repo, not service
  ) {}

  async createTestimonial(
    data: { review: string; rating: number },
    userId: string,
    courseId: string
  ): Promise<ITestimonial> {
    if (!data.review || !data.rating) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Review and rating are required');
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Rating must be between 1 and 5');
    }

    // Validate course exists
    const course = await this.courseRepository.getCourse(courseId);
    if (!course) throw new AppError(STATUS_CODES.NOT_FOUND, 'Course not found');

    const testimonial = await this.testimonialRepository.create({
      content: data.review,
      rating: data.rating,
      user: userId,
      course: courseId,
    });

    // Update course testimonials array
    await this.courseRepository.updateCourse(courseId, {
      $push: { testimonials: testimonial._id },
    });

    return testimonial;
  }
}