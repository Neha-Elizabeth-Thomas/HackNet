import express from 'express';
import { getAllCourses, getCourseById, deleteCourse } from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Route to get all courses and create a new course
router.route('/').get(getAllCourses);

// Route to get, update, and delete a specific course
router.route('/:id')
    .get(getCourseById)
    .delete(deleteCourse); // <-- Add the delete route

export default router;
