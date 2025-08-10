import mongoose, { Schema, Document } from "mongoose";

export interface ISalesOrder extends Document {
  orderNumber: string;
  customerId: mongoose.Types.ObjectId; // assumes you have a Customer collection
  status: "Draft" | "Confirmed" | "Completed" | "Cancelled";
  totalAmount: number;
  date: Date;
  stockApplied: boolean; // prevent double stock deduction
}

const SalesOrderSchema = new Schema<ISalesOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Confirmed", "Completed", "Cancelled"],
      default: "Draft",
    },
    totalAmount: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now },
    stockApplied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SalesOrderSchema.index({ createdAt: -1 });
SalesOrderSchema.index({ customerId: 1 });

export default mongoose.model<ISalesOrder>("SalesOrder", SalesOrderSchema);
