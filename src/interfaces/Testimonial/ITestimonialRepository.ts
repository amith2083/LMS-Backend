import { ITestimonial } from "./ITestimonial";

export interface ITestimonialRepository {
  create(data: Partial<ITestimonial>): Promise<ITestimonial>;
  
}
