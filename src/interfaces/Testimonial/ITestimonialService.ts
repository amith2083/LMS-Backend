import { ITestimonialDocument } from "../../models/testimonial";


export interface ITestimonialService {
  createTestimonial(
    data: { review: string; rating: number },
    userId: string,
    courseId: string
  ): Promise<ITestimonialDocument>;

  
}
