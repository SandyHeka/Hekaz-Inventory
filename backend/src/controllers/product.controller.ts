import { Request, Response } from "express";
import { Product } from "../models/Product";

// CREATE
export const createProduct = async (req: Request, res: Response) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const product = await Product.create({ ...req.body, imageUrl });
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Product creation error:", err); // 👈 Add this
    res.status(500).json({ error: "Failed to create product" });
  }
};

// READ ALL
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// READ ONE
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
