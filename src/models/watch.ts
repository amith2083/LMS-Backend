import mongoose, { Schema } from "mongoose";
import { IWatch } from "../interfaces/watch/IWatch";

const watchSchema = new Schema<IWatch>({
  state: {
    type: String,
    required: true,
    default: "started",
  },
 
  lesson: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  module: {
    type: Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastTime: {
    type: Number,
    required: true,
    default: 0,
  },
},{ timestamps: true });

// Optional: auto-update modified_at before save
watchSchema.pre("save", function (next) {
  this.modified_at = new Date();
  next();
});

export const Watch = mongoose.models.Watch || mongoose.model<IWatch>("Watch", watchSchema);
