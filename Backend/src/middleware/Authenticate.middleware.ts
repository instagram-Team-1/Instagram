import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MyRequest } from "../interfaces/Request.interface";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in your .env file");
}

export const Authenticate = (
  req: MyRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization header missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
    };

    // Token-аас авсан хэрэглэгчийн мэдээллийг хадгалах
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid token",
      details: (error as Error).message,
    });
  }
};
