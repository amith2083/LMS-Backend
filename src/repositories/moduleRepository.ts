import { IModuleRepository } from "../interfaces/module/IModuleRepository";
import { IModule } from "../interfaces/module/IModule";
import { Course } from "../models/course";
import { Module } from "../models/module";
import mongoose from "mongoose";

export class ModuleRepository implements IModuleRepository {
  async createModule(data: Partial<IModule>): Promise<string> {
    const createdModule = await Module.create(data);
    return createdModule._id.toString();
  }

  async getModule(moduleId: string): Promise<IModule | null> {
    return await Module.findById(moduleId).populate("lessonIds").lean().exec();
  }

  async updateModule(
    moduleId: string,
    data: Partial<IModule>
  ): Promise<IModule | null> {
    return await Module.findByIdAndUpdate(moduleId, data, { new: true })
      .lean()
      .exec();
  }
 async addLessonToModule(moduleId: string, lessonId: string): Promise<void> {
       const result =await Module.findByIdAndUpdate(
        moduleId,
        { $addToSet: { lessonIds:lessonId } },
        { new: true }
      ).lean();
      return result
    }
     async removeLessonFromModule(moduleId: string, lessonId: string): Promise<void> {
        await Module.findByIdAndUpdate(
          moduleId,
          { $pull: { lessonIds: lessonId } },
          { new: true }
        );
      }
  async deleteModule(moduleId: string): Promise<void> {
       await Module.findByIdAndDelete(moduleId);
  }

  async findByTitleAndCourse(
    title: string,
    courseId: string
  ): Promise<IModule | null> {
    return await Module.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      courseId,
    })
      .lean()
      .exec();
  }
  // async saveModule(module: IModule): Promise<void> {
  //   await (module as any).save();
  // }
}
