import { ITestimonialRepository } from '../interfaces/Testimonial/ITestimonialRepository';
import { Testimonial } from '../models/testimonial'
import { ITestimonial } from '../interfaces/Testimonial/ITestimonial';
;

export class TestimonialRepository implements ITestimonialRepository {
  async create(data: Partial<ITestimonial>): Promise<ITestimonial> {
    const testimonial = await Testimonial.create(data);
    return testimonial.toObject();
  }
}