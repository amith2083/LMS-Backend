import {
  CreateCourseResponseDTO,
 
  UpdateCourseImageResponse,
 
  UpdateCourseResponseDTO,
} from "../dtos/courseDto";
import { ICourseDocument } from "../models/course";

export const mapCourseDocumentToCreateCourseResponDto = (
  course: ICourseDocument
): CreateCourseResponseDTO => ({
  _id: course._id.toString(),
  title: course.title,
  description: course.description,
});

export const mapCourseDocumentToUpdateCourseResponDto = (
  course: ICourseDocument
): UpdateCourseResponseDTO => ({
  _id: course._id.toString(),
  title: course.title,
  subtitle: course.subtitle,
  price: course.price,
  description: course.description,
  category: course.category?.toString(),
  quizSet: course.quizSet?.toString(),
  updatedAt: course.updatedAt,
});

export const mapCourseDocumentToUpdateCourseImageResponDto = (
  course: ICourseDocument
): UpdateCourseImageResponse => ({
  _id: course._id.toString(),
  thumbnail:course.thumbnail,
});
