import API from "./axios";

export const getAllBrand = async (limit = 20): Promise<any> => {
  const res = await API.get(`/brands?limit=${limit}`);
  return res.data;
};
