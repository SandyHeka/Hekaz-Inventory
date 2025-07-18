import type { StatusType } from "./StatusTypes";

export type Category = {
  _id: string;
  name: string;
  status: StatusType;
};
