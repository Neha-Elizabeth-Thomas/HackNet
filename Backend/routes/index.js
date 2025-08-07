import express from 'express';
import authRoutes from './authRoutes.js';
import syllabusRoutes from './syllabusRoutes.js';
import courseRoutes from './courseRoutes.js'; // <-- Import the new course routes

const router = express.Router();

// All auth-related routes will be prefixed with /api/auth
router.use('/auth', authRoutes);

// All syllabus-related routes will be prefixed with /api/syllabus
router.use('/syllabus', syllabusRoutes);

// All course-related routes will be prefixed with /api/courses
router.use('/courses', courseRoutes); // <-- Register the new course routes

export default router;
