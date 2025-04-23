import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import bcrypt from 'bcryptjs';

const createAccount = async (req: Request, res: Response)=> {
    
  try {
    const { username, fullname, password, email } = req.body;

    if (!username || !fullname || !password || (!email)) {
       res.json({ message: "Missing required fields" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
       res.json({ message: "Username already exists" });
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
         res.json({ message: "Email already exists" });
      }
    }


    const Hashedpassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, fullname, password: Hashedpassword, email });

    await newUser.save();

     res.json({ message: "Account created successfully", user: newUser });
  } catch (error) {
     res.json({ message: "Internal server error" });
  }
};

export default createAccount;
