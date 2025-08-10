import mongoose, { Schema, Document } from "mongoose";

export interface IPurchaseOrder extends Document {
  supplierId: mongoose.Types.ObjectId;
  orderNumber: string;
  status: "Draft" | "Ordered" | "Completed" | "Cancelled";
  totalAmount: number;
  date: Date;
  stockApplied: boolean;
}

const PurchaseOrderSchema: Schema = new Schema(
  {
    supplierId: { type: Schema.Types.ObjectId, ref: "Dealer", required: true },
    orderNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Draft", "Ordered", "Completed", "Cancelled"],
      default: "Draft",
    },
    totalAmount: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now },
    stockApplied: { type: Boolean, default: false },
  },
  { timestamps: true }
);
PurchaseOrderSchema.index({ createdAt: -1 });
PurchaseOrderSchema.index({ supplierId: 1 });
export default mongoose.model<IPurchaseOrder>(
  "PurchaseOrder",
  PurchaseOrderSchema
);
