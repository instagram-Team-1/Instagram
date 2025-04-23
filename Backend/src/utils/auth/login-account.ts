import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/userModel';
import bcrypt from 'bcryptjs';

const loginAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }, { phone: login }],
    });

    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).send({ message: 'Invalid password' });
      return;
    }

    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    next(error);
  }
};

export default loginAccount;