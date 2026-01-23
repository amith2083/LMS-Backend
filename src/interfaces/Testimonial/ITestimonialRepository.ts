import { ITestimonialDocument } from "../../models/testimonial";
import { ITestimonial } from "../../types/testimonial";


export interface ITestimonialRepository {
  create(data: Partial<ITestimonial>): Promise<ITestimonialDocument>;
  findOne(data: Partial<ITestimonial>): Promise<ITestimonialDocument | null>
  
}
