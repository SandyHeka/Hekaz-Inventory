import mongoose, { Schema, Document } from "mongoose";

export interface IPurchaseOrder extends Document {
  supplierId: mongoose.Types.ObjectId;
  orderNumber: string;
  status: "Draft" | "ordered" | "Received" | "completed";
  totalAmount: number;
  date: Date;
}

const PurchaseOrderSchema: Schema = new Schema(
  {
    supplierId: { type: Schema.Types.ObjectId, ref: "Dealer", required: true },
    orderNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Draft", "Ordered", "Received", "Completed"],
      default: "Draft",
    },
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IPurchaseOrder>(
  "PurchaseOrder",
  PurchaseOrderSchema
);
