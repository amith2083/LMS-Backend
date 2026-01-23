import { ITestimonialRepository } from '../interfaces/Testimonial/ITestimonialRepository';
import { ITestimonialDocument, Testimonial } from '../models/testimonial'
import { ITestimonial } from '../types/testimonial';

export class TestimonialRepository implements ITestimonialRepository {
  async create(data: Partial<ITestimonial>): Promise<ITestimonialDocument> {
    const testimonial = await Testimonial.create(data);
    return testimonial;


  }
  async findOne(data: Partial<ITestimonial>): Promise<ITestimonialDocument | null> {
  return await Testimonial.findOne(data); 
}
}