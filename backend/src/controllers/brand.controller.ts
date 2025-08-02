import { Request, Response } from "express";
import { Brand } from "../models/Brand";
import path from "path";
import fs from "fs";
import { Product } from "../models/Product";
export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, status = "active" } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Brand name is required" });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const brand = await Brand.create({
      name,
      status,
      imageUrl,
    });
    res.status(201).json(brand);
  } catch (err) {
    console.error("Brand creation error:", err);
    res.status(500).json({ error: "Failed to create brand " });
  }
};

export const getAllBrand = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    const [brands, total] = await Promise.all([
      Brand.find().skip(skip).limit(limit),
      Brand.countDocuments(),
    ]);
    const totalPage = Math.ceil(total / limit);
    res.json({ brands, totalPage, page });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch brand" });
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to fecth brand" });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    let imageUrl = brand.imageUrl;
    if (req.file) {
      if (imageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          path.basename(imageUrl)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const { name, status } = req.body;
    const updated = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name: name ?? brand.name,
        status: status ?? brand.status,
        imageUrl,
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update brand" });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brandId = req.params.id;
    const usedInProducts = await Product.findOne({ brand: brandId });
    if (usedInProducts) {
      return res.status(400).json({
        error: "Cannot delete: Brand is associated with existing products.",
      });
    }
    const deleted = await Brand.findByIdAndDelete(brandId);

    if (!deleted) return res.status(404).json({ error: "Brand not found" });
    res.json({ message: "Brand deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete brand" });
  }
};
