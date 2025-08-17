import { Request, Response } from "express";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import mongoose from "mongoose";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, status } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const newCategory = await Category.create({ name, status });
    res.status(201).json(newCategory);
  } catch (err) {
    console.log("Category Creation error: ", err);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const getAllCategorys = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const [category, total] = await Promise.all([
      Category.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Category.countDocuments(),
    ]);
    const totalPage = Math.ceil(total / limit);
    res.json({ category, totalPage, page });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(400).json({ error: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Catgeory not found" });
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    if (!mongoose.isValidObjectId(categoryId)) {
      console.warn("DELETE category invalid id", categoryId);
      return res.status(400).json({ error: "Invalid category id" });
    }
    const category = await Category.findOne({
      _id: categoryId,
      deletedAt: null,
    });
    if (!category) {
      return res
        .status(404)
        .json({ error: "Category not found or already deleted" });
    }
    // Is this category referenced by any active (not soft-deleted) products?
    const inUse = await Product.exists({
      category: categoryId,
      deletedAt: null,
    });
    if (inUse) {
      return res.status(400).json({
        error: "Cannot delete: Category is associated with existing products.",
      });
    }

    await Category.findByIdAndUpdate(
      categoryId,
      {
        $set: {
          deletedAt: new Date(),
          deletedBy: (req as any).user?._id ?? null,
        },
      },
      { new: true }
    );

    res.json({ message: "Category soft-deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
