import { ITestimonial } from "./ITestimonial";

export interface ITestimonialRepository {
  create(data: Partial<ITestimonial>): Promise<ITestimonial>;
  findOne(filter: Partial<ITestimonial>): Promise<ITestimonial | null>
  
}
