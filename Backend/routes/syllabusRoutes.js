import express from 'express';
import { uploadAndProcessSyllabus } from '../controllers/syllabusController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/syllabus/upload
// @desc    Upload a syllabus, process with AI, and save to DB
// @access  Private (only authenticated faculty can access)
router.post(
  '/upload',
  protect, // First, ensure the user is logged in
  upload.single('syllabusFile'), // Then, process the file upload
  uploadAndProcessSyllabus // Finally, run the controller logic
);

export default router;
