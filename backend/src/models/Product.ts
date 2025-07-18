import mongoose, { Document, Schema } from "mongoose";

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

export const Product = mongoose.model<IProduct>("Product", productSchema);
