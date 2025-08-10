import { Request, Response } from "express";
import mongoose from "mongoose";
import SalesOrder from "../models/SalesOrder";
import SalesOrderItem from "../models/SalesOrderItem";
import { Product } from "../models/Product";

const FLOW = ["Draft", "Confirmed", "Completed", "Cancelled"] as const;
type SOStatus = (typeof FLOW)[number];
const rank = (s: SOStatus) => FLOW.indexOf(s);

// CREATE
export const createSalesOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, items } = req.body;

    if (!customerId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const orderNumber = `SO-${Date.now()}`;
    const totalAmount = items.reduce(
      (acc: number, it: any) =>
        acc + Number(it.quantity) * Number(it.unitPrice),
      0
    );

    const [order] = await SalesOrder.create(
      [{ customerId, orderNumber, totalAmount, status: "Draft" }],
      { session }
    );

    const rows = items.map((it: any) => ({
      salesOrderId: order._id,
      productId: it.productId,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unitPrice),
    }));

    await SalesOrderItem.insertMany(rows, { session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ message: "Sales order created", orderId: order._id });
  } catch (err) {
    console.error("createSalesOrder error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// LIST (paginated)
export const getAllSalesOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      SalesOrder.find()
        .skip(skip)
        .limit(limit)
        .populate("customerId", "name")
        .sort({ createdAt: -1 }),
      SalesOrder.countDocuments(),
    ]);

    res.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DETAILS
export const getSalesOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await SalesOrder.findById(id).populate("customerId", "name");
    if (!order) return res.status(404).json({ error: "Order not found" });

    const items = await SalesOrderItem.find({ salesOrderId: id }).populate(
      "productId",
      "name"
    );
    res.json({ order, items });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// STATUS UPDATE (decrement stock on first move to Completed)
export const updateSalesOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const nextStatus = String(req.body.status) as SOStatus;

    if (!FLOW.includes(nextStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const so = await SalesOrder.findById(id);
    if (!so) return res.status(404).json({ error: "Order not found" });

    // no going backwards
    if (rank(nextStatus) < rank(so.status)) {
      return res.status(400).json({ error: "Cannot move status backwards" });
    }
    // cancelled is terminal
    if (so.status === "Cancelled" && nextStatus !== "Cancelled") {
      return res.status(400).json({ error: "Cancelled orders cannot change" });
    }

    // Move to Completed → decrement stock once
    if (nextStatus === "Completed" && !so.stockApplied) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const items = await SalesOrderItem.find({
          salesOrderId: so._id,
        }).session(session);

        // Optional safety: check availability before decrement
        for (const it of items) {
          const prod = await Product.findById(it.productId).session(session);
          if (!prod) throw new Error("Product not found");
          if (prod.currentStock < it.quantity) {
            throw new Error(
              `Insufficient stock for product ${String(prod._id)}`
            );
          }
        }

        for (const it of items) {
          await Product.updateOne(
            { _id: it.productId },
            { $inc: { currentStock: -it.quantity } },
            { session }
          );
        }

        so.stockApplied = true;
        so.status = nextStatus;
        await so.save({ session });

        await session.commitTransaction();
        session.endSession();
      } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error("Failed to apply stock on completion:", e);
        return res
          .status(400)
          .json({ error: (e as Error).message || "Failed to apply stock" });
      }
    } else {
      so.status = nextStatus;
      await so.save();
    }

    const updated = await SalesOrder.findById(id).populate(
      "customerId",
      "name"
    );
    res.json({ message: "Status updated", order: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
