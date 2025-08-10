import mongoose, { Schema, Document } from "mongoose";

export interface ISalesOrderItem extends Document {
  salesOrderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

const SalesOrderItemSchema = new Schema<ISalesOrderItem>(
  {
    salesOrderId: {
      type: Schema.Types.ObjectId,
      ref: "SalesOrder",
      required: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

SalesOrderItemSchema.index({ salesOrderId: 1 });
SalesOrderItemSchema.index({ productId: 1 });

export default mongoose.model<ISalesOrderItem>(
  "SalesOrderItem",
  SalesOrderItemSchema
);
