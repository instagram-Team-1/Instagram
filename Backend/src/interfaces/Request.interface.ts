import { Request } from "express";

export interface MyRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}
