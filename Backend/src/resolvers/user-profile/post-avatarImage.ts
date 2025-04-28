// import { Request, Response } from 'express'
// import { User } from '../../models/userModel'

// interface AuthenticatedRequest extends Request {
//     user?: { id: string }
// }

// // POST /api/users/:id/avatar
// export const uploadAvatar = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { avatar } = req.body 
//   try {
//     const user = await User.findByIdAndUpdate(id, { avatar }, { new: true })
//     res.json(user)
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
// export const followUser = async (req: AuthenticatedRequest, res: Response) => {
//     console.error('Follow user error:', err)
//     res.status(500).json({ message: 'Server error' })
//     }