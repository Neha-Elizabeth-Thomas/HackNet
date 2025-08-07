import express from 'express';
import { getAllCourses, getCourseById } from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Route to get all courses for the logged-in user
router.route('/').get(getAllCourses);

// Route to get a specific course by its ID
router.route('/:id').get(getCourseById);

export default router;
