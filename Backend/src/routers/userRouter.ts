import express from 'express'

import { getUsers } from '../controller/User/GetUser'
import { updateUser } from '../controller/User/UpdateUser'
import { getFeedPosts } from '../controller/POST/GetFollowingPost'
import getUserByUsername from '../controller/user-profile/get-userByUsername'
import { searchUser } from '../controller/SearchUser/SearchUser'

const userRouter = express.Router()

userRouter.get("/search", searchUser);
userRouter.get("/:id", getUsers);
userRouter.get("/", getUsers);
userRouter.put("/update/:id", updateUser);
userRouter.get("/username/:username", getUserByUsername)
userRouter.get("/feed/:id", getFeedPosts);


export default userRouter
