import type { StatusType } from "./StatusTypes";

export type Brand = {
  _id: string;
  name: string;
  imageUrl?: string;
  status: StatusType;
};
