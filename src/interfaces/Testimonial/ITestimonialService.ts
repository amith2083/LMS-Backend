import { ITestimonial } from "./ITestimonial";

export interface ITestimonialService {
  createTestimonial(
    data: { review: string; rating: number },
    userId: string,
    courseId: string
  ): Promise<ITestimonial>;

  
}
