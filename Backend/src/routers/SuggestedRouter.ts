import express from "express";
import { getSuggestedFollowers } from "../controller/Suggested/Suggested";


const userRouter = express.Router();

userRouter.get("/Suggested/:id", getSuggestedFollowers);


export default userRouter;
