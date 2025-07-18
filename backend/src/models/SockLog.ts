import mongoose, { Schema, Document } from "mongoose";

export interface IStockLog extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  type: "stock-in" | "stock-out" | "adjustment";
  userId: mongoose.Types.ObjectId;
  note?: string;
}

const stockLogSchema = new Schema<IStockLog>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    type: {
      type: String,
      enum: ["stock-in", "stock-out", "adjustment"],
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: String,
  },
  { timestamps: true }
);

export const StockLog = mongoose.model<IStockLog>("StockLog", stockLogSchema);
