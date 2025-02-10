import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const checkOwnership = (model, fieldName = 'organizer') => async (req, res, next) => {
  const doc = await model.findById(req.params.id);
  
  if (!doc) {
    return res.status(404).json({ message: 'Document not found' });
  }

  if (doc[fieldName].toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to modify this resource' });
  }
  
  next();
};