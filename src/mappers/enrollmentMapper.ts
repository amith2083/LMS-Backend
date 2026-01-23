import { ConfirmEnrollmentResponseDTO } from "../dtos/enrollmentDto";
import { ICourseDocument } from "../models/course";
import { IEnrollmentDocument } from "../models/enrollment";
import { IUserDocument } from "../models/user";


export class EnrollmentMapper {
  static toConfirmEnrollmentResponse(
    enrollment: IEnrollmentDocument,
    course: ICourseDocument,
    user: IUserDocument
  ): ConfirmEnrollmentResponseDTO {
    return {
      _id: enrollment._id.toString(),
      status: enrollment.status,
      course: {
        _id: course._id.toString(),
        title: course.title,
        price: Number(course.price),
      },
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }
}

