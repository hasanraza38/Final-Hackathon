import jwt from 'jsonwebtoken';
import User from '../models/auth.models.js';

async function authenticateToken(req, res, next) {
   
  const token = req.cookies.accessToken;

  // console.log('Token from cookies:', token);
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    // console.log('Decoded token:', decoded);

    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token: User ID missing' });
    }

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

export { authenticateToken, isAdmin };