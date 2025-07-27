export type StockOperationPayload = {
  productId: string;
  quantity: number;
  note?: string;
};

export type StockAdjustmentPayload = {
  productId: string;
  newQuantity: number;
  note?: string;
};

export type StockLog = {
  _id: string;
  productId: string;
  type: "stock-in" | "stock-out" | "adjustment";
  quantity: number;
  note?: string;
  createdAt: string;
  userId: { _id: string; name: string };
};
