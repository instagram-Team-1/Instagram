import express from 'express'

import { getUsers } from '../controller/User/GetUser'
import { updateUser } from '../controller/User/UpdateUser'

const userRouter = express.Router()



userRouter.get("/:username", getUsers);

userRouter.put("/Update/:id", updateUser);


export default userRouter
