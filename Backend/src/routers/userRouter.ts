import express from 'express'
import { RequestHandler } from 'express'

import getUserByUsername from '../resolvers/user-profile/get-userByUsername'
import followUser  from '../resolvers/user-profile/follow-user'
import { get } from 'mongoose'
// import { followUser } from '../resolvers/user-profile/page'

import { getUsers } from '../controller/User/GetUser'
import { updateUser } from '../controller/User/UpdateUser'

const userRouter = express.Router()

// router.get('/me', getCurrentUser)
userRouter.get('/:username', getUserByUsername)
// router.get('/:id/followers', getUserFollowers)
userRouter.post('/:id/follow', followUser as RequestHandler)
// router.delete('/:id/unfollow', unfollowUser)
// router.put('/:id', updateUser)

userRouter.get("/:username", getUsers);

userRouter.put("/Update/:id", updateUser);


export default userRouter
