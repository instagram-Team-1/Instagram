import { Request, Response } from 'express';
import Post from '../../models/PostModel';

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
