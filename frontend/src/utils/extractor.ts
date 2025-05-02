import jwt from 'jsonwebtoken';

const extractUserFromToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET! || 'secret'); 
    return decoded;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};
export default extractUserFromToken