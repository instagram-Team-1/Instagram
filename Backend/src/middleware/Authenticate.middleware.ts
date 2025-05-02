import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MyRequest } from "../interfaces/Request.interface";

export const Authenticate = (
  req: MyRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key") as {
      id: string;
      username: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token", details: error });
    return;
  }
};
