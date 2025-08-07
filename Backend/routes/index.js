import express from 'express';
import authRoutes from './authRoutes.js';
// Import other route files here as you create them
import syllabusRoutes from './syllabusRoutes.js';

const router = express.Router();

// All auth-related routes will be prefixed with /api/auth
router.use('/auth', authRoutes);

// All syllabus-related routes will be prefixed with /api/syllabus
router.use('/syllabus', syllabusRoutes);


export default router;
