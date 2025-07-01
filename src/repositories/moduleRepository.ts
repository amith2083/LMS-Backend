import { IModuleRepository } from "../interfaces/module/IModuleRepository";
import { IModule } from "../interfaces/module/IModule";
import { Course } from "../models/course";
import mongoose from "mongoose";
import { Module } from "../models/module";


export class ModuleRepository implements IModuleRepository {
  async createModule(data: Partial<IModule>){
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const createdModules = await Module.create([data], { session });
      const createdModule = createdModules[0];

      const course = await Course.findById(data.courseId).session(session);
      if (!course) throw new Error("Course not found");

     (course.modules ??= []).push(createdModule._id);
      await course.save({ session });

      await session.commitTransaction();
      session.endSession();
    //   return JSON.parse(JSON.stringify(createdModule));
   return createdModule.toObject();

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getModule(moduleId: string): Promise<IModule | null> {
    const moduleWithLesson = await Module.findById(moduleId)
      .lean();
    return moduleWithLesson 
  }

  async updateModule(
    moduleId: string,
    data: Partial<IModule>
  ): Promise<IModule | null> {
    const updatedModule = await Module.findByIdAndUpdate(moduleId, data, { new: true }).lean();
    return updatedModule 
  }

  async changeModulePublishState(moduleId: string): Promise<boolean> {
    const module = await Module.findById(moduleId);
    if (!module) throw new Error("Module not found");

    module.status = !module.status;
    await module.save();
    return module.status;
  }

  async deleteModule(moduleId: string, courseId: string): Promise<void> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    course.modules =(course.modules ??= []).filter((id) => id.toString() !== moduleId);
    await course.save();

    const deleted = await Module.findByIdAndDelete(moduleId);
    if (!deleted) throw new Error("Module not found or failed to delete");
  }

  async findByTitleAndCourse(title: string, courseId: string): Promise<IModule | null> {
  return Module.findOne({
    // title: { $regex: `^${title}$`, $options: "i" },
    title: { $regex: new RegExp(`^${title}$`, "i") },
    courseId,
  }).lean();
}

}
