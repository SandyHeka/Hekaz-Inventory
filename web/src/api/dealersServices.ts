import API from "./axios";

export const getAllDealer = async (limit = 20): Promise<any> => {
  const res = await API.get(`dealers/limit=${limit}`);
  return res.data;
};
