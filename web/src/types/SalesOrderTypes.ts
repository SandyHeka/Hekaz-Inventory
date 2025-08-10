export type SOStatus = "Draft" | "Confirmed" | "Completed" | "Cancelled";

export interface SalesOrderItemForm {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface SalesOrderForm {
  customerId: string;
  items: SalesOrderItemForm[];
}

export interface SalesOrderItem {
  productId: string | { _id: string; name: string };
  quantity: number;
  unitPrice: number;
}

export interface SalesOrder {
  _id: string;
  customerId: string | { _id: string; name: string };
  customerName?: string;
  orderNumber: string;
  status: SOStatus;
  totalAmount: number;
  date: string;
  createdAt: string;
  updatedAt?: string;
  items?: SalesOrderItem[];
}
