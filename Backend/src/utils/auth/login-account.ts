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
      res.status(404).send({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).send({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email , username : user.username , phone : user.phone },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "6h",
      }
    );

    res.status(200).send({ message: "Login successful" , token});
  } catch (error) {
    next(error);
  }
};

export default loginAccount;
