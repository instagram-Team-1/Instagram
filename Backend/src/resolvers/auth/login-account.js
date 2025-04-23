import { User } from "../../models/userModel.js"
import bcrypt from 'bcrypt'

export const loginAccount=async(req,res)=>{
const {login,password} = req.body
const user = await User.findOne({
    $or: [
      { email: login },
      { username: login },
      { phone: login }
    ]
  })
  if (!user) {
    return res.json({ message: 'User not found' })
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.json({ message: 'Invalid password' })
  }
  res.json({ message: 'Login successful', user })
}
