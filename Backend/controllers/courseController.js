import Course from '../models/Course.js';

/**
 * @description Get all courses for the logged-in faculty
 * @route   GET /api/courses
 * @access  Private
 */
export const getAllCourses = async (req, res) => {
  try {
    // Find all courses associated with the logged-in user's ID
    const courses = await Course.find({ facultyId: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @description Get a single course by ID with full syllabus details
 * @route   GET /api/courses/:id
 * @access  Private
 */
export const getCourseById = async (req, res) => {
  try {
    // Find the course by its ID and use .populate() to automatically include
    // the full syllabus document instead of just its ID.
    const course = await Course.findById(req.params.id).populate('syllabusId');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Security check: Ensure the user requesting the course is the one who owns it
    if (course.facultyId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to view this course' });
    }

    res.json(course);
  } catch (error)
    {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
