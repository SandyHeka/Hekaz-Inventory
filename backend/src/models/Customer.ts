import mongoose, { Document, Schema } from "mongoose";

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

export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
