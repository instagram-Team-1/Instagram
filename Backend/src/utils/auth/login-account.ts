import { Request, Response, NextFunction } from "express";
import { User } from "../../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }, { phone: login }],
    });

    if (!user) {
      res.send({ errUser: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.send({ errPassword: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email , username : user.username , phone : user.phone },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "6h",
      }
    );
    console.log(token);
    
    
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   path: "/",
    //   maxAge: 6 * 60 * 60 * 1000, // 6 цаг
    // });
    // res.cookie("token", token, {
    //   httpOnly: true, // Security: Prevent JavaScript access to the cookie
    //   secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
    //   sameSite: "strict", // Prevent cross-site request forgery
    //   path: "/", // Accessible from all routes
    //   maxAge: 6 * 60 * 60 * 1000, // 6 hours
    // });
    res.status(200).send(token);
  } catch (error) {
    next(error);
  }
};

export default loginAccount;
