import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import memoryStore from './memoryStore';
import bcrypt from 'bcryptjs';

const createAccount = async (req: Request, res: Response) => {
  try {
    const {code} = req.body;
    const storedRaw = memoryStore.get('prechecked');
    const stored = typeof storedRaw === 'string' ? JSON.parse(storedRaw) : storedRaw;
    if (!stored) {
       res.status(400).json({ message: "No pending verification found" });
       return
    }
    if (stored.code != code) {   
       res.status(400).json({ message: "Invalid verification code" });
       return
    }
    const hashedPassword = await bcrypt.hash(stored.password, 10);
    const newUser = new User({
      username: stored.username,
      fullname: stored.fullname,
      password: hashedPassword,
      email: stored.email,
      avatarImage: 'https://res.cloudinary.com/dvfl0oxmj/image/upload/v1746372697/gbbju93p0xiwunwz8hie.gif'
    });
    await newUser.save();   
    memoryStore.delete('prechecked');
     res.status(201).json({ message: "Account created successfully", user: newUser });
     return
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: "Internal server error" });
     return
  }
};

export default createAccount;
