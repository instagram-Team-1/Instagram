import express from 'express'
import {
  // getUserByUsername,
  // getUserFollowers,
  // getUserFollowing,
  // getCurrentUser,
  // uploadAvatar,
  // followUser,
  // unfollowUser,
  // updateUser,
} from '../resolvers/user-profile/page'
import getUserByUsername  from '../resolvers/user-profile/page'

const userRouter = express.Router()

// router.get('/me', getCurrentUser)
userRouter.get('/:username', getUserByUsername)
// router.get('/:id/followers', getUserFollowers)
// router.get('/:id/following', getUserFollowing)
// router.post('/:id/avatar', uploadAvatar)
// router.post('/:id/follow', followUser)
// router.delete('/:id/unfollow', unfollowUser)
// router.put('/:id', updateUser)

export default userRouter
