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
