import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Private route - requires a valid JWT to access
router.get('/profile', protect, getUserProfile);

export default router;
