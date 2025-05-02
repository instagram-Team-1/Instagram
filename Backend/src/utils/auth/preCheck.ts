import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import bcrypt from 'bcryptjs';
import memoryStore from './memoryStore';
import sendVerificationEmail from './mailSender'
const preCheck = async (req: Request, res: Response)=> {
  

  try {
    const { username, fullname, password, email } = req.body;

    if (!username || !fullname || !password || (!email)) {
       res.json({ message: "Missing required fields" });
       return
   
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
       res.json({ message: "Username already exists" });
       return
    
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
         res.json({ message: "Email already exists" });
         return
      }
 
    }
   
    const code = Math.floor(100000 + Math.random() * 900000);
    await sendVerificationEmail(email, code);
    const data = {
      ...req.body,
      code
    };
  
    
   
    await memoryStore.set(`prechecked`, JSON.stringify(data));



     res.json({ message: "Verification code sent to email" });
     return
   //  const Hashedpassword = await bcrypt.hash(password, 10);

   //  const newUser = new User({ username, fullname, password: Hashedpassword, email });

   //  await newUser.save();

   //   res.json({ message: "Account created successfully", user: newUser });
  } catch (error) {
     res.json({ message: "Internal server error" });
  }
};

export default preCheck;
