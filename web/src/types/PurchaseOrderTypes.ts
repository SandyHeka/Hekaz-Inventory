export interface PurchaseOrderItemForm {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderForm {
  supplierId: string;
  items: PurchaseOrderItemForm[];
}
export interface PurchaseOrderItem {
  productId: string | { _id: string; name: string };
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  _id: string;
  supplierId: string | { _id: string; name: string };
  supplierName?: string;
  orderNumber: string;
  status: "Draft" | "Ordered" | "Received" | "Completed";
  totalAmount: number;
  date: string;
  createdAt: string;
  updatedAt?: string;
  items?: PurchaseOrderItem[]; // ✅ added items here so you can access order.items
}
