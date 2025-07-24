import API from "./axios";

export const getAllCategory = async (limit = 20): Promise<any> => {
  const res = await API.get(`/category?limit=${limit}}`);
  return res.data;
};
