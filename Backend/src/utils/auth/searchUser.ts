import { Request, Response } from 'express';
import { User } from '../../models/userModel';

const UserByName = async (req: Request, res: Response) => {
    const search = req.params.name;

    try {
        const data = await User.find({
            username: { $regex: search, $options: 'i' }
        })
        .select('username avatarImage _id');
   
        

        if (data.length === 0) {
            res.status(404).json({ message: 'No users found' });
            return;
        }

        res.status(200).json(data.slice(0, 5)); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export default UserByName;