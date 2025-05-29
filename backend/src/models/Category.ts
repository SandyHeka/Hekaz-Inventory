import mongoose, { Schema, Document } from "mongoose";

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export interface ICategory extends Document {
  name: string;
  status: CategoryStatus;
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

export const Category = mongoose.model<ICategory>("Category", categorySchema);
