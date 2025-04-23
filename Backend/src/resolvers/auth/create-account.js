import { User } from '../../models/userModel.js'
import bcrypt from 'bcrypt'
export const createAccount = async (req, res) => {
  try {
    const { username, fullname, password, email, phone } = req.body

    if (!username || !fullname || !password || (!email && !phone)) {
      return res.json({ message: "Missing required fields" })
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.json({ message: "Username already exists" })
    }

    if (email) {
      const existingEmail = await User.findOne({ email })
      if (existingEmail) {
        return res.json({ message: "Email already exists" })
      }
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone })
      if (existingPhone) {
        return res.json({ message: "Phone number already exists" })
      }
    }
    const Hashedpassword = await bcrypt.hash(password, 10);
console.log(Hashedpassword);

    const newUser = new User({ username, fullname, password:Hashedpassword, email, phone })

    await newUser.save()

    res.json({ message: "Account created successfully", user: newUser })
  } catch (error) {
    res.json({ message: "Internal server error" })
  }
}
