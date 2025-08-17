import { Request, Response } from "express";
import { Product } from "../models/Product";
import fs from "fs";
import path from "path";
import { canSoftDeleteProduct } from "../utils/deleteGuards";
import SalesOrderItem from "../models/SalesOrderItem";
import PurchaseOrderItem from "../models/PurchaseOrderItem";
import mongoose from "mongoose";
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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      console.warn("DELETE product invalid id", id);
      return res.status(400).json({ error: "Invalid product id" });
    }

    const prod = await Product.findOne({ _id: id, deletedAt: null });
    if (!prod) {
      console.warn("DELETE product not found or already deleted", id);
      return res
        .status(404)
        .json({ error: "Product not found or already deleted" });
    }

    if (Number(prod.currentStock) > 0) {
      console.warn("DELETE blocked: stock on hand", {
        id,
        currentStock: prod.currentStock,
      });
      return res
        .status(400)
        .json({ error: "Cannot delete: product has stock on hand" });
    }

    const pid = new mongoose.Types.ObjectId(id);

    // Completed POs?
    const usedInCompletedPO = await PurchaseOrderItem.aggregate([
      { $match: { productId: pid } },
      {
        $lookup: {
          from: "purchaseorders",
          localField: "purchaseOrderId",
          foreignField: "_id",
          as: "po",
        },
      },
      { $unwind: "$po" },
      { $match: { "po.status": "Completed" } },
      { $limit: 1 },
    ]);
    if (usedInCompletedPO.length > 0) {
      console.warn("DELETE blocked: used in completed PO", { id });
      return res
        .status(400)
        .json({
          error: "Cannot delete: product is used in a completed Purchase Order",
        });
    }

    // Completed SOs?
    const usedInCompletedSO = await SalesOrderItem.aggregate([
      { $match: { productId: pid } },
      {
        $lookup: {
          from: "salesorders",
          localField: "salesOrderId",
          foreignField: "_id",
          as: "so",
        },
      },
      { $unwind: "$so" },
      { $match: { "so.status": "Completed" } },
      { $limit: 1 },
    ]);
    if (usedInCompletedSO.length > 0) {
      console.warn("DELETE blocked: used in completed SO", { id });
      return res
        .status(400)
        .json({
          error: "Cannot delete: product is used in a completed Sales Order",
        });
    }

    // Soft delete
    await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          deletedAt: new Date(),
          deletedBy: (req as any).user?._id ?? null,
        },
      },
      { new: true }
    );

    console.info("DELETE product soft-deleted", id);
    return res.json({ message: "Product soft-deleted" });
  } catch (err) {
    console.error("deleteProduct error:", err);
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
