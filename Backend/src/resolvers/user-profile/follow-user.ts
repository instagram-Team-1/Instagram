import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const followUser = async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.id;
  const { id } = req.params;

  if (!currentUserId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (currentUserId === id) {
    return res.status(400).json({ message: "Can't follow yourself" });
  }

  try {
    const [userToFollow, currentUser] = await Promise.all([
      User.findById(id),
      User.findById(currentUserId),
    ]);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(userToFollow.followers)) {
      userToFollow.followers = [];
    }
    if (!Array.isArray(currentUser.following)) {
      currentUser.following = [];
    }

    const alreadyFollowing = userToFollow.followers.some(
      (followerId) => followerId.toString() === currentUserId
    );

    if (!alreadyFollowing) {
      userToFollow.followers.push(new mongoose.Types.ObjectId(currentUserId));
      currentUser.following.push(userToFollow._id as mongoose.Types.ObjectId);

      await Promise.all([userToFollow.save(), currentUser.save()]);
    }

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    console.error('Follow user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default followUser;
