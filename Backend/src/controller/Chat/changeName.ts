import { Request,Response } from "express";
import roomModel from "../../models/roomModel";

const changeName = async(req:Request,res:Response)=>{
const roomId = req.params.roomId
const {newName} = req.body


if (!roomId) {
    res.send('room id not provided')
    return
}
const updated = await roomModel.findByIdAndUpdate(
    roomId,
      { name: newName },
      { new: true } 
)
res.send('group name updated')



}
export default changeName