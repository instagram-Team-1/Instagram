import express from 'express'

import { getUsers } from '../controller/User/GetUser'
import { updateUser } from '../controller/User/UpdateUser'
import { getFeedPosts } from '../controller/POST/GetFollowingPost'
import { searchUser } from '../controller/SearchUser/SearchUser'

const userRouter = express.Router()

userRouter.get("/search", searchUser);

userRouter.get("/:id", getUsers);

userRouter.get("/", getUsers);

userRouter.put("/Update/:id", updateUser);

userRouter.get("/feed/:id", getFeedPosts);




export default userRouter
