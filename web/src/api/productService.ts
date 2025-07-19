import type { Product } from "../types/ProductTypes";
import API from "./axios";

export const getAllProducts = async (
  page = 1
): Promise<{ products: Product[]; totalPages: number; page: number }> => {
  const res = await API.get(`/products?page=${page}&limit=10`);
  return {
    products: res.data.products,
    totalPages: res.data.totalPages,
    page: res.data.page,
  };
};
