import { Request, Response } from "express";
import { Category } from "../models/Category";
import { Product } from "../models/Product";

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
      Category.find().skip(skip).limit(limit),
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
    const usedInProducts = await Product.findOne({ catgegory: categoryId });
    if (usedInProducts) {
      return res.status(400).json({
        error: "Cannot delete: Catgeory is associated with existing products.",
      });
    }

    const deleteCategory = await Category.findByIdAndDelete(categoryId);
    if (!deleteCategory)
      return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
