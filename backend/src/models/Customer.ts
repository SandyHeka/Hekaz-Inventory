import mongoose, { Document, Schema } from "mongoose";
import softDelete from "../plugins/softDelete";

export enum CustomerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export interface ICustomer extends Document {
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  status: CustomerStatus;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    email: { type: String },
    status: {
      type: String,
      enum: Object.values(CustomerStatus),
      default: CustomerStatus.ACTIVE,
      required: true,
    },
  },
  { timestamps: true }
);
// soft-delete
customerSchema.plugin(softDelete);

// helpful indexes
customerSchema.index({ deletedAt: 1 });

export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
