import { Express } from 'express';
import { IFileUploadService } from '../interfaces/file/IFileUploadService';
import cloudinary from '../utils/cloudinary';
import path from 'path';
import { AppError } from '../utils/asyncHandler';

export class FileUploadService implements IFileUploadService {
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const uploadResult = await cloudinary.uploader.upload(base64String, {
        folder,
        public_id: path.parse(file.originalname).name,
        resource_type: 'auto',
      });
      return uploadResult.secure_url;
    } catch (error) {
      throw new AppError(500, 'Failed to upload file');
    }
  }
}