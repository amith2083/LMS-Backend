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
    //fetching active courses
    const activeCourses =
      await this.courseRepository.getAllCourseForEmbedding();

    //  Reuse existing mongoose connection
    const client = mongoose.connection.getClient();
    const db = client.db("lms");
    const chunksColl = db.collection("course_chunks");

    // Collect all active course IDs
    const activeCourseIds = activeCourses.map((c: any) => c._id.toString());
    // Delete embeddings where courseId NOT in active list
    const deleteResult = await chunksColl.deleteMany({
      "metadata.type": "course",
      "metadata.courseId": { $nin: activeCourseIds },
    });

    // 2. Upsert active ones
    let upsertedCount = 0;

    for (const course of activeCourses) {
      const courseIdStr = course._id.toString();
      // Convert full course into structured text
      const text = generateCourseTextForEmbedding(course);
      if (text.length < 20) continue; // skip almost empty
      let embedding: number[] = [];
      try {
        const res = await openai.embeddings.create({
          model: "BAAI/bge-m3",
          input: text,
        });
        embedding = res.data[0].embedding;
      } catch (err) {
        console.error(`Embedding failed for course ${course.title}:`, err);
        continue;
      }
 // Filter to check if document already exists
      const filter = {
        "metadata.courseId": courseIdStr,
        "metadata.type": "course",
      };
    // Update data
      const update = {
        $set: {
          text,// Full searchable text
          embedding, // Vector embedding
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
 // Insert if not exists, update if exists
      await chunksColl.updateOne(filter, update, { upsert: true });
      upsertedCount++;
    }

    // await client.close();

    return {
      upserted: upsertedCount,
      deleted: deleteResult.deletedCount,
    };
  }
}
