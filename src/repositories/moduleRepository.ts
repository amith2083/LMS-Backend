
import { IModuleRepository } from '../interfaces/module/IModuleRepository';
import { IModule } from '../interfaces/module/IModule';
import { Course } from '../models/course';
import { Module } from '../models/module';
import mongoose from 'mongoose';

export class ModuleRepository implements IModuleRepository {
  async createModule(data: Partial<IModule>): Promise<IModule> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [createdModule] = await Module.create([data], { session });
      const course = await Course.findById(data.courseId).session(session);
      if (!course) throw new Error('Course not found');

      course.modules = course.modules || [];
      course.modules.push(createdModule._id);
      await course.save({ session });

      await session.commitTransaction();
      return createdModule.toObject();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getModule(moduleId: string): Promise<IModule | null> {
    return await Module.findById(moduleId).populate('lessonIds').lean().exec();
  }

  async updateModule(moduleId: string, data: Partial<IModule>): Promise<IModule | null> {
    return await Module.findByIdAndUpdate(moduleId, data, { new: true }).lean().exec();
  }

  async deleteModule(moduleId: string, courseId: string): Promise<void> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    course.modules = (course.modules || []).filter(id => id.toString() !== moduleId);
    await course.save();

    const deleted = await Module.findByIdAndDelete(moduleId);
    if (!deleted) throw new Error('Module not found');
  }

  async findByTitleAndCourse(title: string, courseId: string): Promise<IModule | null> {
    return await Module.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      courseId,
    }).lean().exec();
  }
  async saveModule(module: IModule): Promise<void> {
    await (module as any).save(); 
  }
}