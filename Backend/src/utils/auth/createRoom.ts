import { Request, Response } from 'express';
import room from '../../models/chatroomModel'
const createRoom =async (req: Request, res: Response) => {


    const data = req.body
    const newRoom = new room({
        name: data[0].name,
        participants: data.map((user: { id: string; name: string }) => ({
            _id: user.id,
            username: user.name,
        })),
    }

    )
    await newRoom.save();
    res.send('room created')



}
export default createRoom
// import { Request, Response } from 'express';
// import room from '../../models/chatroomModel';

// const createRoom = async (req: Request, res: Response) => {
//   try {
//     const data = req.body;

//     if (!Array.isArray(data) || data.length === 0) {
//        res.status(400).json({ error: 'Participants list is required' });
//        return
//     }

//     const newRoom = new room({
//       name: data[0].name, // or another way to get room name
//       participants: data.map((user: { id: string }) => user.id), // just the IDs
//     });

//     await newRoom.save();
//     res.status(201).json({ message: 'Room created', room: newRoom });
//   } catch (error) {
//     console.error("Error creating room:", error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// export default createRoom;
