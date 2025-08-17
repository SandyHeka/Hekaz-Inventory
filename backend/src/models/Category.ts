import mongoose, { Schema, Document } from "mongoose";
import softDelete from "../plugins/softDelete";

export enum CategoryStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export interface ICategory extends Document {
  name: string;
  status: CategoryStatus;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
}

const categorySchema: Schema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(CategoryStatus),
      default: CategoryStatus.ACTIVE,
      required: true,
    },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  }
);
// soft-delete
categorySchema.plugin(softDelete);

// helpful indexes
categorySchema.index({ deletedAt: 1 });
export const Category = mongoose.model<ICategory>("Category", categorySchema);
