export type Product = {
  _id: string;
  name: string;
  description?: string;
  category: string;
  brand: string;
  dealer: string;
  price: number;
  currentStock: number; // ✅ replaces old `quantity`
  lowStockThreshold: number; // ✅ for alerting
  barcode: string;
  imageUrl?: string;
};
