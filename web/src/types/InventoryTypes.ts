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
