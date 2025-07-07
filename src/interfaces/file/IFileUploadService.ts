import { Express } from 'express';

export interface IFileUploadService {
  uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
}