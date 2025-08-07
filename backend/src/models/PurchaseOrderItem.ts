import mongoose, { Schema } from "mongoose";

export interface IPurchaseOrderItem extends Document {
  purchaseOrderId: mongoose.Types.ObjectId;
  ProductId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

const PurchaseOrderItemSchema: Schema = new Schema(
  {
    purchaseOrderId: {
      type: Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      required: true,
    },
    ProductId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPurchaseOrderItem>(
  "PurchaseOrderItem",
  PurchaseOrderItemSchema
);
