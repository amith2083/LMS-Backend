import { Request, Response } from "express";
import { ILessonController } from "../interfaces/lesson/ILessonController";
import { ILessonService } from "../interfaces/lesson/ILessonService";
import { STATUS_CODES } from "../constants/http";
import { ERROR_MESSAGES } from "../constants/messages";
import { nanoid } from "nanoid";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../utils/s3";

export class LessonController implements ILessonController {
  constructor(private lessonService: ILessonService) {}

  async createLesson(req: Request, res: Response): Promise<void> {
    const lesson = await this.lessonService.createLesson(
      req.body,
      req.query.moduleId as string
    );
    res.status(STATUS_CODES.CREATED).json(lesson);
  }

  async getLesson(req: Request, res: Response): Promise<void> {
    const lesson = await this.lessonService.getLesson(req.params.id);
    if (!lesson) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.NOT_FOUND });
      return;
    }
    res.status(STATUS_CODES.OK).json(lesson);
  }

  async updateLesson(req: Request, res: Response): Promise<void> {
    const updated = await this.lessonService.updateLesson(
      req.params.id,
      req.body
    );
    res.status(STATUS_CODES.OK).json(updated);
  }

  // async changeLessonPublishState(req: Request, res: Response): Promise<void> {
  //   const status = await this.lessonService.changeLessonPublishState(
  //     req.params.id
  //   );
  //   res.status(STATUS_CODES.OK).json({ status });
  // }

  async deleteLesson(req: Request, res: Response): Promise<void> {
    await this.lessonService.deleteLesson(
      req.params.id,
      req.query.moduleId as string
    );
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Lesson deleted successfully" });
  }
  async getUploadSignedUrl(req: Request, res: Response): Promise<void> {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      res.status(400).json({ error: "Missing fileName or fileType" });
      return;
    }

    const key = `course-videos/${nanoid()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket:process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({ signedUrl, fileUrl, key });
  }

  async getPlaybackSignedUrl(req: Request, res: Response): Promise<void> {
    const { key } = req.body;
    if (!key) {
      res.status(400).json({ error: "Missing key" });
      return;
    }

    const command = new GetObjectCommand({
      Bucket:process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
    res.status(200).json({ signedUrl });
  }
}
