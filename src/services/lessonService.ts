import { nanoid } from "nanoid";
import { ILesson } from "../interfaces/lesson/ILesson";
import { ILessonRepository } from "../interfaces/lesson/ILessonRepository";
import { ILessonService } from "../interfaces/lesson/ILessonService";
import { IModuleRepository } from "../interfaces/module/IModuleRepository";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../utils/s3";
import { AppError } from "../utils/asyncHandler";

export class LessonService implements ILessonService {
 private lessonRepository: ILessonRepository;
  private moduleRepository: IModuleRepository;

  constructor(
    lessonRepository: ILessonRepository,
    moduleRepository: IModuleRepository
  ) {
    this.lessonRepository = lessonRepository;
    this.moduleRepository = moduleRepository;
  }
async createLesson(data: Partial<ILesson>, moduleId: string): Promise<void> {
    if (!data.title) throw new AppError(400, 'Lesson title is required');

    const existing = await this.lessonRepository.findByTitle(data.title);
    if (existing) throw new AppError(409, 'A lesson with this title already exists.');

    const module = await this.moduleRepository.getModule(moduleId);
    if (!module) throw new AppError(404, 'Module not found');

    const lessonId = await this.lessonRepository.createLesson(data);
    await this.moduleRepository.addLessonToModule(data.courseId, lessonId)

   
  }

  async getLesson(lessonId: string): Promise<ILesson> {
    const lesson = await this.lessonRepository.getLesson(lessonId);
    if (!lesson) throw new AppError(404, 'Lesson not found');
    return lesson;
  }

  async getLessonBySlug(slug: string): Promise<ILesson> {
    const lesson = await this.lessonRepository.getLessonBySlug(slug);
    if (!lesson) throw new AppError(404, 'Lesson not found');
    return lesson;
  }

  async updateLesson(lessonId: string, data: Partial<ILesson>): Promise<ILesson | null> {
    const updated = await this.lessonRepository.updateLesson(lessonId, data);
    if (!updated) throw new AppError(404, 'Lesson not found');
    return updated;
  }

  async deleteLesson(lessonId: string, moduleId: string): Promise<void> {
    await this.moduleRepository.removeLessonFromModule(moduleId, lessonId);
    await this.lessonRepository.deleteLesson(lessonId);
  }

  async getUploadSignedUrl(fileName: string, fileType: string) {
    if (!fileName || !fileType || !fileType.startsWith('video/')) {
      throw new AppError(400, 'Invalid fileName or fileType');
    }

    const extension = fileName.split('.').pop()!;
    const key = `course-videos/${nanoid()}.${extension}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { signedUrl, fileUrl, key };
  }

  async getPlaybackSignedUrl(key: string) {
    if (!key) throw new AppError(400, 'Missing key');

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return { signedUrl };
  }

}
