import { Request, Response } from "express";
import { ITestimonialController } from "../interfaces/Testimonial/ITestimonialController";
import { ITestimonialService } from "../interfaces/Testimonial/ITestimonialService";
import { STATUS_CODES } from "../constants/http";

export class TestimonialController implements ITestimonialController {
  constructor(private testimonialService: ITestimonialService) {}

  async createTestimonial(req: Request, res: Response): Promise<void> {
    const { courseId } = req.params;
    
    const { review, rating } = req.body;

    const testimonial = await this.testimonialService.createTestimonial(
      { review, rating },
      req.user.id,
      courseId
    );

    res.status(STATUS_CODES.CREATED).json(testimonial);
  }
}
