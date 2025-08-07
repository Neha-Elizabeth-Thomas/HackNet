import nodemailer from 'nodemailer';

// Configure the email transporter using credentials from .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a notification email to a faculty member.
 * @param {string} facultyEmail - The recipient's email address.
 * @param {string} facultyName - The recipient's name.
 * @param {object} course - The course object.
 * @param {array} topics - An array of topic objects that are overdue or approaching.
 * @param {string} type - The type of notification ('overdue' or 'upcoming').
 */
export const sendSyllabusNotification = async (facultyEmail, facultyName, course, topics, type) => {
  const subject = type === 'overdue' 
    ? `Action Required: Syllabus Lag Detected for ${course.courseCode}`
    : `Reminder: Upcoming Topics for ${course.courseCode}`;

  // Create a simple HTML list of the topics
  const topicsHtml = topics.map(topic => 
    `<li><b>${topic.title}</b> (Module: ${topic.module}) - Due: ${new Date(topic.targetDate).toLocaleDateString()}</li>`
  ).join('');

  const htmlBody = `
    <p>Hello Dr. ${facultyName},</p>
    <p>This is a notification regarding your course: <b>${course.courseName} (${course.courseCode})</b>.</p>
    <p>The following topics are ${type === 'overdue' ? '<b>past their scheduled completion date</b>' : 'approaching their deadline'}:</p>
    <ul>
      ${topicsHtml}
    </ul>
    <p>Please log in to the AI Syllabus Tracker to update their status.</p>
    <p>Thank you!</p>
  `;

  const mailOptions = {
    from: `"AI Syllabus Tracker" <${process.env.EMAIL_USER}>`,
    to: facultyEmail,
    subject: subject,
    html: htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${facultyEmail} for course ${course.courseCode}`);
  } catch (error) {
    console.error(`Failed to send email to ${facultyEmail}:`, error);
  }
};
