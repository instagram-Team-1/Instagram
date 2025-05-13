// import { Request, Response } from 'express';
// import room from '../../models/roomModel'
// const createRoom =async (req: Request, res: Response) => {


//     const data = req.body
//     const newRoom = new room({
//         name: data[0].name,
//         participants: data.map((user: { id: string; name: string }) => ({
//             _id: user.id,
//             username: user.name,
//         })),
//     }

//     )
//     await newRoom.save();
//     res.send('room created', )



// }
// export default createRoom
import { Request, Response } from 'express';
import room from '../../models/roomModel';

const createRoom = async (req: Request, res: Response) => {
  const data = req.body;


  const newRoom = new room({
    name: 'test',
    participants: data.map((user: { id: string; name: string }) => ({
      _id: user.id,
      username: user.name,
    })),
  });

  try {
   
    const savedRoom = await newRoom.save();


    res.status(201).json({
      message: 'Room created successfully',
      roomId: savedRoom._id,  
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Error creating room', error });
  }
};

export default createRoom;
