import mongoose, { Document, Schema } from "mongoose";

export enum DealerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export interface IDealer extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  owner: string;
  status: DealerStatus;
}

const dealerSchema: Schema = new Schema<IDealer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    owner: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(DealerStatus),
      default: DealerStatus.ACTIVE,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Dealer = mongoose.model<IDealer>("Dealer", dealerSchema);
