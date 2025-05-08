import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import bcrypt from 'bcryptjs';
import memoryStore from './memoryStore';
import sendVerificationEmail from './mailSender';

const preCheck = async (req: Request, res: Response) => {
  try {
    const { username, fullname, password, email } = req.body;

    if (!username || !fullname || !password || !email) {
      res.json({ message: "Missing required fields" });
      return;
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.json({ message: "Username already exists" });
      return;
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.json({ message: "Email already exists" });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationEmail(email, code);

    await memoryStore.set(`prechecked:${email}`, JSON.stringify({
      email,
      username,
      password,
      fullname,
      code
    }));
console.log(memoryStore);

    res.json({ message: "Verification code sent to email" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal server error" });
  }
};

export default preCheck;
