// src/routes/lessonRoute.ts
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { LessonController } from '../controllers/lessonController';
import { LessonService } from '../services/lessonService';
import { LessonRepository } from '../repositories/lessonRepository';
import { ModuleRepository } from '../repositories/moduleRepository';

const router = Router();

const lessonRepo = new LessonRepository();
const moduleRepo = new ModuleRepository();
const lessonService = new LessonService(lessonRepo, moduleRepo);
const lessonController = new LessonController(lessonService);

router.post('/', asyncHandler(lessonController.createLesson.bind(lessonController)));
router.get('/:id', asyncHandler(lessonController.getLesson.bind(lessonController)));
router.get('/slug/:slug', asyncHandler(lessonController.getLessonBySlug.bind(lessonController)));
router.put('/:id', asyncHandler(lessonController.updateLesson.bind(lessonController)));
router.delete('/:id', asyncHandler(lessonController.deleteLesson.bind(lessonController)));
router.post('/upload-url', asyncHandler(lessonController.getUploadSignedUrl.bind(lessonController)));
router.post('/playback-url', asyncHandler(lessonController.getPlaybackSignedUrl.bind(lessonController)));

export default router;