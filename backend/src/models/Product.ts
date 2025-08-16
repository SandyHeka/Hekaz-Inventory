import mongoose, { Document, Schema } from "mongoose";
import softDelete from "../plugins/softDelete";

export interface IProduct extends Document {
  name: string;
  description: string;
  currentStock: number;
  price: number;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  dealer: mongoose.Types.ObjectId;
  barcode: string;
  imageUrl?: string;
  lowStockThreshold: number;
  // soft-delete fields (added by plugin)
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;

  // plugin helpers
  softDelete?: (userId?: string) => Promise<IProduct>;
  restore?: () => Promise<IProduct>;
}

const productSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    currentStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    dealer: { type: Schema.Types.ObjectId, ref: "Dealer", required: true },
    barcode: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true }
);
// 🔌 apply plugin
productSchema.plugin(softDelete);

// 🔎 helpful indexes
productSchema.index({ deletedAt: 1 });
productSchema.index({ dealer: 1, deletedAt: 1 });
productSchema.index({ brand: 1, deletedAt: 1 });
productSchema.index({ category: 1, deletedAt: 1 });

// ✅ make barcode unique **only** among non-deleted docs
productSchema.index(
  { barcode: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
