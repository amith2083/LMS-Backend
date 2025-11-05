import { Types } from "mongoose";

export interface IWatch {
   
  state: string;
  created_at: Date;
  modified_at: Date;
  lesson: Types.ObjectId;
  module: Types.ObjectId;
  user: Types.ObjectId;
  lastTime: number;
}
