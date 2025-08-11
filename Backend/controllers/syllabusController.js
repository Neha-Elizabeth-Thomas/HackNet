import { GoogleGenerativeAI } from '@google/generative-ai';
// import pdf from 'pdf-parse'; // No longer needed
import Course from '../models/Course.js';
import Syllabus from '../models/Syllabus.js';
import { v4 as uuidv4 } from 'uuid';

// Initialize the Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @description Converts a file buffer to a Gemini-readable format
 */
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

/**
 * @description Upload syllabus, process with AI, and create schedule
 * @route   POST /api/syllabus/upload
 * @access  Private
 */
export const uploadAndProcessSyllabus = async (req, res) => {
  try {
    // 1. Validate the request
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    // --- Start of Changed Block ---
    const { courseName, courseCode, startDate, weeklySchedule } = req.body;
    if (!courseName || !courseCode || !startDate || !weeklySchedule) {
        return res.status(400).json({ message: 'Missing required course details or weekly schedule.' });
    }
    const parsedSchedule = JSON.parse(weeklySchedule);
    // --- End of Changed Block ---

    // 2. Prepare the prompt and file for Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); 
    
    // --- Start of Changed Block ---
    // Create a dynamic schedule string for the prompt
    const scheduleString = Object.entries(parsedSchedule)
      .map(([day, hours]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours} hours`)
      .join(', ');

    // The prompt is updated to use the dynamic weekly schedule.
    const userPrompt = `
        You are an expert academic scheduler. Analyze the content of the provided syllabus file (image or PDF).
        Your task is to:
        1. Extract all modules and the topics within each module, including the 'lectureHours' for each topic.
        2. Based on a course start date of ${startDate}, and the following weekly teaching schedule: ${scheduleString}, generate a logical teaching schedule with a specific 'targetDate' for each topic.
        3. Return ONLY a single, clean JSON object. Do not include any text before or after the JSON object. Do not use markdown backticks.
        The JSON object must have this exact structure:
        {
          "topics": [
            {
              "module": "Module Name",
              "title": "Topic Title",
              "lectureHours": 1,
              "targetDate": "YYYY-MM-DD"
            }
          ]
        }
    `;
    // --- End of Changed Block ---

    const filePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

    // 3. Call the Gemini API with the prompt and the file data
    const result = await model.generateContent([userPrompt, filePart]);
    const response = await result.response;
    
    const jsonResponseText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const structuredData = JSON.parse(jsonResponseText);

    // 4. Save the structured data to the database
    const newCourse = await Course.create({
      courseName: courseName,
      courseCode: courseCode,
      facultyId: req.user._id,
      weeklySchedule: parsedSchedule, // Save the schedule to the new course
    });

    const topicsWithIds = Array.isArray(structuredData.topics) ? structuredData.topics.map(topic => ({
        ...topic,
        topicId: uuidv4(),
        description: topic.title,
    })) : [];

    const newSyllabus = await Syllabus.create({
        courseId: newCourse._id,
        topics: topicsWithIds,
    });

    newCourse.syllabusId = newSyllabus._id;
    await newCourse.save();

    // 5. Send a success response
    res.status(201).json({
      message: 'Syllabus processed and schedule created successfully!',
      course: newCourse,
    });

  } catch (error) {
    console.error('Syllabus Processing Error:', error);
    res.status(500).json({ message: 'Server Error: Could not process syllabus.' });
  }
};

/**
 * @description Update the completion status of a topic
 * @route   PUT /api/syllabus/:syllabusId/topics/:topicId
 * @access  Private
 */
export const updateTopicStatus = async (req, res) => {
  try {
    const { syllabusId, topicId } = req.params;
    const { isCompleted } = req.body;

    const syllabus = await Syllabus.findById(syllabusId);

    if (!syllabus) {
      return res.status(404).json({ message: 'Syllabus not found' });
    }

    const course = await Course.findById( syllabus.courseId);
    if (course.facultyId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to update this syllabus' });
    }

    const topic = syllabus.topics.find(t => t.topicId === topicId);

    if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
    }

    topic.isCompleted = isCompleted;

    await syllabus.save();

    res.json({ message: 'Topic status updated successfully', syllabus });

  } catch (error) {
    console.error('Error updating topic status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
