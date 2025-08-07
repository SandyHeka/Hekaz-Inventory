export interface PurchaseOrderItemForm {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderForm {
  supplierId: string;
  items: PurchaseOrderItemForm[];
}

export interface PurchaseOrder {
  _id: string;
  supplierId: string;
  supplierName?: string;
  orderNumber: string;
  status: "Draft" | "Ordered" | "Received" | "Completed";
  total: number;
  date: string;
  createdAt: string;
}
