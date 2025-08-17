import mongoose, { Document, Schema } from "mongoose";
import softDelete from "../plugins/softDelete";

export enum BrandStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export interface IBrand extends Document {
  name: string;
  imageUrl?: string;
  status: BrandStatus;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
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
// soft-delete
brandSchema.plugin(softDelete);

// helpful indexes
brandSchema.index({ deletedAt: 1 });
export const Brand = mongoose.model<IBrand>("Brand", brandSchema);
