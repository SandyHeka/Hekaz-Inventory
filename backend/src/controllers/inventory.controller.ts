import { Request, Response } from "express";
import { Product } from "../models/Product";
import { StockLog } from "../models/SockLog";

export const stockIn = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, note } = req.body;
    const userId = req.user._id;
    if (!productId || quantity <= 0)
      return res.status(400).json({ error: "Invalid input" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.currentStock += quantity;
    await product.save();

    await StockLog.create({
      productId,
      quantity,
      type: "stock-in",
      userId,
      note,
    });

    res.json({
      message: "Stock updated Successfully",
      currentStock: product.currentStock,
    });
  } catch (err) {
    console.error("Stock-In Error", err);
    res.status(500).json({ error: "Stock-in Failed" });
  }
};

export const stockOut = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, note } = req.body;
    const userId = req.user._id;
    if (!productId || quantity <= 0) {
      return res.status(400).json({ error: "Invalid Input" });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product Not Found" });

    if (product.currentStock < quantity) {
      return res
        .status(400)
        .json({ error: "Insufficient stock for this operation" });
    }

    product.currentStock -= quantity;
    await product.save();

    await StockLog.create({
      productId,
      quantity,
      type: "stock-out",
      userId,
      note,
    });

    res.json({
      message: "Stock-out successfully",
      currentStock: product.currentStock,
    });
  } catch (err) {
    console.error("Stock-out Error: ", err);
    res.status(500).json({ error: "Stock-out failed" });
  }
};

export const adjustStock = async (req: Request, res: Response) => {
  try {
    const { productId, newQuantity, note } = req.body;
    const userId = req.user._id;
    if (!productId || newQuantity < 0) {
      return res.status(400).json({ error: "Invalid Input" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product Not Found" });

    const difference = newQuantity - product.currentStock;

    product.currentStock = newQuantity;
    await product.save();

    await StockLog.create({
      productId,
      quantity: Math.abs(difference),
      type: "adjustment",
      userId,
      note: note || `Manual adjustment to ${newQuantity}`,
    });

    res.json({
      message: "Stock adjustment successfully",
      currentStock: product.currentStock,
    });
  } catch (err) {
    console.error("Adjust-Stock Failed : ", err);
    res.status(500).json({ error: "Adjust-Stock Failed" });
  }
};

export const getLowStock = async (req: Request, res: Response) => {
  try {
    const lowStockProduct = await Product.find({
      $expr: { $lt: ["$currentStock", "$lowStockThreshold"] },
    }).select("name cuurentStock lowStockThreshold");
    res.json({ lowStockProduct });
  } catch (err) {
    console.error("Low Stock Check Error: ", err);
    res.status(500).json({ error: "Failed to Fetch Low Stock Products" });
  }
};
