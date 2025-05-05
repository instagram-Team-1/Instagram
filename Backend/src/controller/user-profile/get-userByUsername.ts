import { Request, Response } from 'express';
import { User } from '../../models/userModel';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// GET /api/users/:username
const getUserByUsername = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default getUserByUsername;
