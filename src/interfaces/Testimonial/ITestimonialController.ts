import { Response,Request } from "express";


export interface ITestimonialController {
  createTestimonial(
    req: Request,
    res: Response
  ): Promise<void>;
}
