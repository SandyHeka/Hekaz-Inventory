import { Request, Response } from "express";
import mongoose from "mongoose";
import PurchaseOrder from "../models/PurchaseOrder";
import PurchaseOrderItem from "../models/PurchaseOrderItem";
import SalesOrder from "../models/SalesOrder";
import SalesOrderItem from "../models/SalesOrderItem";
import { Product } from "../models/Product";

// Helper for date range
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// KPI overview
export const getOverview = async (_req: Request, res: Response) => {
  try {
    const [poCompleted, soCompleted, lowStockCount, stockValAgg] =
      await Promise.all([
        PurchaseOrder.aggregate([
          { $match: { status: "Completed" } },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
              count: { $sum: 1 },
            },
          },
        ]),
        SalesOrder.aggregate([
          { $match: { status: "Completed" } },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
              count: { $sum: 1 },
            },
          },
        ]),
        Product.countDocuments({
          $expr: { $gt: ["$lowStockThreshold", "$currentStock"] },
        }),
        Product.aggregate([
          { $project: { v: { $multiply: ["$currentStock", "$price"] } } },
          { $group: { _id: null, value: { $sum: "$v" } } },
        ]),
      ]);

    res.json({
      purchasesCompletedAmount: poCompleted[0]?.total ?? 0,
      purchasesCompletedCount: poCompleted[0]?.count ?? 0,
      salesCompletedAmount: soCompleted[0]?.total ?? 0,
      salesCompletedCount: soCompleted[0]?.count ?? 0,
      lowStockCount,
      stockValuation: stockValAgg[0]?.value ?? 0,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to load overview" });
  }
};

// Sales $ per day (default last 30)
export const getSalesByDay = async (req: Request, res: Response) => {
  try {
    const days = Math.max(
      1,
      Math.min(180, parseInt(String(req.query.days || 30)))
    );
    const start = daysAgo(days);

    const rows = await SalesOrder.aggregate([
      { $match: { status: "Completed", createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]);

    const series = rows.map((r) => ({
      date: new Date(r._id.y, r._id.m - 1, r._id.d).toISOString(),
      total: r.total,
    }));

    res.json({ days, series });
  } catch {
    res.status(500).json({ error: "Failed to load sales by day" });
  }
};

// Top sold products by qty (from SO items)
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const limit = Math.max(
      1,
      Math.min(50, parseInt(String(req.query.limit || 10)))
    );
    const rows = await SalesOrderItem.aggregate([
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
      {
        $group: {
          _id: "$productId",
          totalQty: { $sum: "$quantity" },
          revenue: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          totalQty: 1,
          revenue: 1,
        },
      },
    ]);

    res.json({ items: rows });
  } catch {
    res.status(500).json({ error: "Failed to load top products" });
  }
};

// Low stock list
export const getLowStock = async (req: Request, res: Response) => {
  try {
    const limit = Math.max(
      1,
      Math.min(100, parseInt(String(req.query.limit || 10)))
    );
    const rows = await Product.find(
      { $expr: { $gt: ["$lowStockThreshold", "$currentStock"] } },
      { name: 1, currentStock: 1, lowStockThreshold: 1 }
    )
      .sort({ currentStock: 1 })
      .limit(limit);

    res.json({ items: rows });
  } catch {
    res.status(500).json({ error: "Failed to load low stock" });
  }
};

// Current stock valuation ($)
export const getStockValuation = async (_req: Request, res: Response) => {
  try {
    const rows = await Product.aggregate([
      { $project: { value: { $multiply: ["$currentStock", "$price"] } } },
      { $group: { _id: null, total: { $sum: "$value" } } },
    ]);
    res.json({ total: rows[0]?.total ?? 0 });
  } catch {
    res.status(500).json({ error: "Failed to compute stock valuation" });
  }
};

// Spend by supplier (Completed POs)
export const getSupplierSpend = async (_req: Request, res: Response) => {
  try {
    const rows = await PurchaseOrder.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: "$supplierId", spend: { $sum: "$totalAmount" } } },
      { $sort: { spend: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "dealers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          supplierId: "$_id",
          name: "$supplier.name",
          spend: 1,
        },
      },
    ]);
    res.json({ items: rows });
  } catch {
    res.status(500).json({ error: "Failed to load supplier spend" });
  }
};

// Revenue by customer (Completed SOs)
export const getCustomerRevenue = async (_req: Request, res: Response) => {
  try {
    const rows = await SalesOrder.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: "$customerId", revenue: { $sum: "$totalAmount" } } },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          customerId: "$_id",
          name: "$customer.name",
          revenue: 1,
        },
      },
    ]);
    res.json({ items: rows });
  } catch {
    res.status(500).json({ error: "Failed to load customer revenue" });
  }
};
