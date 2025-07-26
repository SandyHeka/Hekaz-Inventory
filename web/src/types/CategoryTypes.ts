import type { StatusType } from "./StatusTypes";

export type Category = {
  _id: string;
  name: string;
  status: StatusType;
};

export type CategoryFormData = Omit<Category, "_id">;
