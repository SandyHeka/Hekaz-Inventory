import { Request, Response } from "express";
import { Product } from "../models/Product";
import fs from "fs";
import path from "path";
// CREATE
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, currentStock, price, category, brand, dealer, barcode } =
      req.body;

    if (
      !name ||
      !currentStock ||
      !price ||
      !category ||
      !brand ||
      !dealer ||
      !barcode
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const product = await Product.create({
      name,
      currentStock,
      price,
      category,
      brand,
      dealer,
      barcode,
      imageUrl,
      description: req.body.description || "",
    });
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Product creation error:", err); // 👈 Add this
    res.status(500).json({ error: "Failed to create product" });
  }
};

// READ ALL
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find()
        .skip(skip)
        .limit(limit)
        .populate("brand", "name")
        .populate("category", "name")
        .populate("dealer", "name"),
      Product.countDocuments(),
    ]);

    res.json({ products, total, page, totalPages: Math.ceil(total / limit) });
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
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    //handle image

    let imageUrl = product.imageUrl;
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

    const updatedData = {
      ...req.body,
      imageUrl,
    };

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );
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

export const getProductsByDealer = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { dealerId } = req.params;
    const [products, total] = await Promise.all([
      Product.find({ dealer: dealerId })
        .skip(skip)
        .limit(limit)
        .populate("category", "name")
        .populate("brand", "name")
        .populate("dealer", "name"),
      Product.countDocuments({ dealer: dealerId }),
    ]);
    res.status(200).json({
      products,
      totalPage: Math.ceil(total / limit),
      page,
      dealer: products[0]?.dealer || null,
    });
  } catch (err) {
    console.log("Error fetching products by dealer", err);
    res.status(500).json({ message: "Server Error" });
  }
};
