import cron from 'node-cron';
import Syllabus from '../models/Syllabus.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { sendSyllabusNotification } from './emailService.js';

const checkSyllabusDeadlines = async () => {
  console.log('Running scheduled job: Checking syllabus deadlines...');
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the start of the day

  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

  try {
    // Find all syllabi that have topics that are not completed
    const syllabi = await Syllabus.find({ 'topics.isCompleted': false }).populate({
        path: 'courseId',
        populate: {
            path: 'facultyId',
            model: 'User'
        }
    });

    for (const syllabus of syllabi) {
      const course = syllabus.courseId;
      const faculty = course.facultyId;

      if (!faculty) continue;

      const overdueTopics = [];
      const upcomingTopics = [];

      for (const topic of syllabus.topics) {
        if (!topic.isCompleted) {
          const targetDate = new Date(topic.targetDate);
          
          // Check for overdue topics
          if (targetDate < today) {
            overdueTopics.push(topic);
          } 
          // Check for topics due in the next 3 days
          else if (targetDate >= today && targetDate <= threeDaysFromNow) {
            upcomingTopics.push(topic);
          }
        }
      }

      // Send emails if there are topics that match the criteria
      if (overdueTopics.length > 0) {
        await sendSyllabusNotification(faculty.email, faculty.name, course, overdueTopics, 'overdue');
      }
      if (upcomingTopics.length > 0) {
        await sendSyllabusNotification(faculty.email, faculty.name, course, upcomingTopics, 'upcoming');
      }
    }
  } catch (error) {
    console.error('Error in scheduled job:', error);
  }
};

// Schedule the job to run once every day at 8:00 AM
export const startCronJobs = () => {
  cron.schedule('0 8 * * *', checkSyllabusDeadlines, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
  console.log('Notification cron job scheduled to run every day at 8:00 AM IST.');
};
