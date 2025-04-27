import { Request, Response } from 'express'
import {User} from '../../models/userModel'
import mongoose from 'mongoose'

// // GET /api/users/:username
const getUserByUsername = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params
  try {
    const user = await User.findOne({ username })
    if (!user) res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

export default getUserByUsername

// // GET /api/users/:id/followers
// export const getUserFollowers = async (req: Request, res: Response) => {
//   const { id } = req.params
//   try {
//     const user = await User.findById(id).populate('followers', 'username avatar')
//     if (!user) return res.status(404).json({ message: 'User not found' })
//     res.json(user.followers)
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// }

// // GET /api/users/:id/following
// export const getUserFollowing = async (req: Request, res: Response) => {
//   const { id } = req.params
//   try {
//     const user = await User.findById(id).populate('following', 'username avatar')
//     if (!user) return res.status(404).json({ message: 'User not found' })
//     res.json(user.following)
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// }

// // GET /api/users/me
// export const getCurrentUser = async (req: Request, res: Response) => {
//   const userId = req.user?.id // JWT-аар дамжуулж ирсэн ID гэж үзье
//   try {
//     const user = await User.findById(userId).select('-password')
//     if (!user) return res.status(404).json({ message: 'User not found' })
//     res.json(user)
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// }

// // POST /api/users/:id/avatar
// export const uploadAvatar = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { avatar } = req.body // Cloudinary URL гэж үзье
//   try {
//     const user = await User.findByIdAndUpdate(id, { avatar }, { new: true })
//     res.json(user)
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// }

// // POST /api/users/:id/follow
// export const followUser = async (req: Request, res: Response) => {
//   const currentUserId = req.user?.id
//   const { id } = req.params

//   if (!currentUserId) {
//     return res.status(401).json({ message: 'Unauthorized' })
//   }

//   if (currentUserId === id) {
//     return res.status(400).json({ message: "Can't follow yourself" })
//   }

//   try {
//     const [userToFollow, currentUser] = await Promise.all([
//       User.findById(id),
//       User.findById(currentUserId),
//     ])

//     if (!userToFollow || !currentUser) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     if (!userToFollow.followers.includes(currentUserId)) {
//       userToFollow.followers.push(currentUserId)
//       currentUser.following.push(userToFollow._id)
//       await Promise.all([userToFollow.save(), currentUser.save()])
//     }
//     console.log('currentUserId:', currentUserId)
//     console.log('id param:', id)


//     res.json({ message: 'Followed successfully' })
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// }


// // DELETE /api/users/:id/unfollow
// export const unfollowUser = async (req: Request, res: Response) => {
//   const currentUserId = req.user?.id
//   const { id } = req.params // Unfollow хийх хэрэглэгчийн ID

//   try {
//     const userToUnfollow = await User.findById(id)
//     const currentUser = await User.findById(currentUserId)

//     if (!userToUnfollow || !currentUser) return res.status(404).json({ message: 'User not found' })

//     userToUnfollow.followers = userToUnfollow.followers.filter(
//       (followerId) => !followerId.equals(currentUserId)
//     )
//     currentUser.following = currentUser.following.filter(
//       (followingId) => !followingId.equals(userToUnfollow._id)
//     )

//     await userToUnfollow.save()
//     await currentUser.save()

//     res.json({ message: 'Unfollowed successfully' })
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// }

// // PUT /api/users/:id
// export const updateUser = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const updates = req.body
//   try {
//     const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password')
//     res.json(user)
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' })
//   }
// }
