export type Product = {
  _id: string;
  name: string;
  description?: string;
  category: string;
  brand: string;
  dealer: string;
  price: number;
  quantity: number;
  barcode: string;
  imageUrl?: string;
};
