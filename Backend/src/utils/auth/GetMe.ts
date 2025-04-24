import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/userModel";

const getMe = async (req: Request, res: Response ) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
     return; 
  }
   

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("username email _id");
    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

     res.status(200).json(user);
     return;
  } catch (err) {
     res.status(401).json({ message: "Invalid token" });
     return;
  }
};

export default getMe;
