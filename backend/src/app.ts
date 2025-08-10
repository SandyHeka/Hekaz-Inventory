import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import brandRoutes from "./routes/brand.routes";
import dealerRoutes from "./routes/dealer.routes";
import inventoryRoutes from "./routes/inventory.routes";
import userRoutes from "./routes/user.routes";
import customerRoutes from "./routes/customer.routes";
import purchaseOrderRoutes from "./routes/purchaseOrder.routes";
import salesOrderRoutes from "./routes/salesOrder.routes";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/sales-orders", salesOrderRoutes);
app.use("/uploads", express.static("uploads"));
app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "API is healthy " });
});

export default app;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
