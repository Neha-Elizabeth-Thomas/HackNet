import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @description Middleware to protect routes by verifying JWT
 */
const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the http-only cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
