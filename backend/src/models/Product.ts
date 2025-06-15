import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  dealer: mongoose.Types.ObjectId;
  barcode: string;
  imageUrl?: string;
}

const productSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    dealer: { type: Schema.Types.ObjectId, ref: "Dealer", required: true },
    barcode: { type: String, required: true, unique: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
