import mongoose, { Document, Schema } from "mongoose";

export enum BrandStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export interface IBrand extends Document {
  name: string;
  imageUrl?: string;
  status: BrandStatus;
}

const brandSchema: Schema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    imageUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(BrandStatus),
      default: BrandStatus.ACTIVE,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Brand = mongoose.model<IBrand>("Brand", brandSchema);
