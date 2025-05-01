import roomModel from '../../models/chatroomModel'
import mongoose from 'mongoose'

const checkMsg = async (roomId: string, userId: string): Promise<boolean> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return false;
    }

    const room = await roomModel.findOne({
      _id: roomId,
      participants: new mongoose.Types.ObjectId(userId),
    });

    return !!room;
  } catch (err) {
    console.error('Error checking participant:', err);
    return false;
  }
};

  

export default checkMsg;
