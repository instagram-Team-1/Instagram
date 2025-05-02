import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Room from '../../models/chatroomModel';

const allChat = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ error: 'Invalid user ID' });
       return
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const rooms = await Room.find({ participants: objectId })
      .populate('participants', 'username _id')
    

    res.status(200).json(rooms);
    console.log(rooms);
    
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

export default allChat;
