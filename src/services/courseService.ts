import { AppError } from "../utils/asyncHandler";
import mongoose from "mongoose";
import { ICourseService } from "../interfaces/course/ICourseService";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { IFileUploadService } from "../interfaces/file/IFileUploadService";
import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import { ICourseDocument } from "../models/course";
import {
  CreateCourseResponseDTO,
  UpdateCourseImageResponse,
  UpdateCourseResponseDTO,
} from "../dtos/courseDto";
import {
  mapCourseDocumentToCreateCourseResponDto,
  mapCourseDocumentToUpdateCourseResponDto,
} from "../mappers/courseMapper";
import { ICourse } from "../types/course";
import { generateCourseTextForEmbedding } from "../utils/generateCourseTextForEmbedding";
import { openai } from "../config/openai";

export class CourseService implements ICourseService {
  constructor(
    private courseRepository: ICourseRepository,
    private categoryRepository: ICategoryRepository,
    private fileUploadService: IFileUploadService,
  ) {}

  async getCourses(params?: {
    search?: string;
    category?: string;
    price?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    // Validate category exists
    if (params?.category) {
      const cat = await this.categoryRepository.getCategory(params.category);
      if (!cat) throw new AppError(404, "Category not found");
    }

    return this.courseRepository.getCourses(params);
  }

  async getCourse(id: string): Promise<ICourseDocument> {
    const course = await this.courseRepository.getCourse(id);
    if (!course) throw new AppError(404, "Course not found");
    return course;
  }

  async getCoursesByInstructorId(
    instructorId: string,
  ): Promise<ICourseDocument[]> {
    const courses =
      await this.courseRepository.getCoursesByInstructorId(instructorId);
    return courses;
  }

  async getCoursesForAdmin(): Promise<ICourseDocument[]> {
    const courses = await this.courseRepository.getCoursesForAdmin();
    return courses;
  }
  async getRelatedCourses(currentCourseId: string): Promise<ICourseDocument[]> {
    const currentCourse =
      await this.courseRepository.getCourse(currentCourseId);

    if (!currentCourse || !currentCourse.category) return [];

    return await this.courseRepository.getRelatedCourses(
      currentCourse.category._id.toString(),
      currentCourseId,
    );
  }

  async createCourse(
    data: Partial<ICourse>,
  ): Promise<CreateCourseResponseDTO | null> {
    const result = await this.courseRepository.createCourse(data);
    return result ? mapCourseDocumentToCreateCourseResponDto(result) : null;
  }

  async updateCourse(
    id: string,
    data: Partial<ICourse>,
  ): Promise<UpdateCourseResponseDTO | null> {
    const updated = await this.courseRepository.updateCourse(id, data);
    if (!updated) throw new AppError(404, "Course not found");
    return updated ? mapCourseDocumentToUpdateCourseResponDto(updated) : null;
  }

  async updateCourseImage(
    courseId: string,
    file: Express.Multer.File,
  ): Promise<UpdateCourseImageResponse> {
    if (!file) throw new AppError(400, "Image file is required");

    const imageUrl = await this.fileUploadService.uploadFile(
      file,
      "lms/courses",
    );
    const updated = await this.courseRepository.updateCourse(courseId, {
      thumbnail: imageUrl,
    });

    if (!updated?.thumbnail) {
      throw new AppError(500, "Course image update failed");
    }

    return {
      _id: updated._id.toString(),
      thumbnail: updated.thumbnail,
    };
  }

  async deleteCourse(id: string): Promise<void> {
    const course = await this.courseRepository.getCourse(id);
    if (!course) throw new AppError(404, "Course not found");
    await this.courseRepository.deleteCourse(id);
  }

  /**
   * Refresh all course embeddings.
   *
   * Steps:
   * 1. Fetch active courses
   * 2. Delete embeddings of removed courses
   * 3. Generate new embeddings
   * 4. Upsert them into MongoDB
   */
  async refreshCourseEmbeddings(): Promise<{
  upserted: number;
  deleted: number;
}> {

  const activeCourses =
    await this.courseRepository.getAllCourseForEmbedding();

  const client = mongoose.connection.getClient();
  const db = client.db("lms");
  const chunksColl = db.collection("course_chunks");

  const activeCourseIds = activeCourses.map((c: any) =>
    c._id.toString()
  );

  // Delete old embeddings
  const deleteResult = await chunksColl.deleteMany({
    "metadata.type": "course",
    "metadata.courseId": { $nin: activeCourseIds },
  });

  // ----------------------------
  //  Generate all texts first
  // ----------------------------
  const courseData = activeCourses
    .map((course: any) => {
      const text = generateCourseTextForEmbedding(course);
      if (text.length < 20) return null;

      return {
        course,
        text,
      };
    })
    .filter(Boolean) as { course: any; text: string }[];

  if (courseData.length === 0) {
    return { upserted: 0, deleted: deleteResult.deletedCount };
  }

  // ----------------------------
  //  Create embeddings in BATCH
  // ----------------------------
  const texts = courseData.map((item) => item.text);

  let embeddings: number[][] = [];

  try {
    const response = await openai.embeddings.create({
      model: "BAAI/bge-m3",
      input: texts,   //  Batch input
    });

    embeddings = response.data.map((d) => d.embedding);

  } catch (err) {
    console.error("Batch embedding failed:", err);
    return { upserted: 0, deleted: deleteResult.deletedCount };
  }

  // ----------------------------
  //  Upsert with embeddings
  // ----------------------------
  let upsertedCount = 0;

  for (let i = 0; i < courseData.length; i++) {

    const { course, text } = courseData[i];
    const embedding = embeddings[i];
    const courseIdStr = course._id.toString();

    const filter = {
      "metadata.courseId": courseIdStr,
      "metadata.type": "course",
    };

    const update = {
      $set: {
        text,
        embedding,
        metadata: {
          courseId: courseIdStr,
          type: "course",
          title: course.title,
          price: course.price ?? 0,
          isFree: !course.price || course.price === 0,
          updatedAt: course.updatedAt,
        },
      },
    };

    await chunksColl.updateOne(filter, update, { upsert: true });
    upsertedCount++;
  }

  return {
    upserted: upsertedCount,
    deleted: deleteResult.deletedCount,
  };
}
}
