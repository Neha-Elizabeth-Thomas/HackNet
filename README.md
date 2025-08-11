# SyllabIQ( AI Syllabus Tracker)

The **SyllabIQ** is a full-stack web application designed to help faculty members automate the process of creating and tracking course schedules. By leveraging the Google Gemini API, this tool can parse a syllabus document (PDF or image), extract the curriculum, and generate a dynamic, day-by-day teaching plan.

The application provides a visual timeline for tracking progress, allowing faculty to mark topics as complete. It also includes an automated notification system that sends email reminders for upcoming or overdue topics, ensuring the course stays on schedule.

## Core Features ✨

* **AI-Powered Scheduling**: Upload a syllabus file, and the application automatically extracts topics and generates a detailed schedule based on the course start date and weekly hour allocation.
* **Visual Progress Tracking**: A modern, interactive timeline visually represents the course schedule, allowing faculty to easily track their progress.
* **One-Click Updates**: Mark topics as "Completed" with a simple checkbox toggle, which automatically updates the course progress bar.
* **Automated Email Notifications**: A scheduled backend job runs daily to send email reminders to faculty for topics that are approaching their due date or are already overdue.
* **Secure Authentication**: User authentication is handled securely using JWTs stored in HTTP-only cookies.
* **Course Management**: Faculty can create, view, and delete courses from their personal dashboard.

## Sample Teaching Plan

The application is designed to understand structured syllabus documents like the one below. The AI can extract modules, topics, and lecture hours to build the schedule.

![Sample Teaching Plan](https://github.com/Neha-Elizabeth-Thomas/HackNet/blob/main/DBMS%20syllabus.pdf)

## Technology Stack 🛠️

### **Backend**

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose
* **Authentication**: JSON Web Tokens (JWT) with HTTP-Only Cookies
* **AI Integration**: Google Gemini API (`@google/generative-ai`)
* **Email Notifications**: Nodemailer
* **Scheduled Jobs**: node-cron
* **File Handling**: Multer

### **Frontend**

* **Framework**: React (with Vite)
* **Styling**: Tailwind CSS
* **Routing**: React Router
* **API Communication**: Axios

## Local Setup and Installation 🚀

To run this project locally, you will need to set up both the backend and frontend servers.

### **1. Backend Setup**

1.  **Clone the repository and navigate to the `Backend` directory.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the root of the `Backend` directory and add the following environment variables:
    ```ini
    # Server Configuration
    PORT=3000

    # MongoDB Connection String
    MONGO_URI=your_mongodb_connection_string

    # JWT Secret Key
    JWT_SECRET=a_very_strong_and_random_secret_key

    # Google Gemini API Key
    GEMINI_API_KEY=your_google_ai_studio_api_key

    # Email Credentials (for Nodemailer)
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-gmail-app-password
    ```
4.  **Start the backend server:**
    ```bash
    npm run dev  # Or nodemon server.js
    ```
    The server should be running on `http://localhost:3000`.

### **2. Frontend Setup**

1.  **Navigate to the `Frontend` directory in a new terminal.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The application should be accessible at `http://localhost:5173`.

## Project Structure

The project is organized into two main folders: `Backend` and `Frontend`.

### **Backend Structure**

```
/Backend
|-- controllers/  # Logic for handling routes
|-- middleware/   # Auth and file upload middleware
|-- models/       # Mongoose database schemas
|-- routes/       # API route definitions
|-- services/     # Email and cron job services
|-- .env          # Environment variables
|-- server.js     # Main server entry point
```

### **Frontend Structure**

```
/Frontend
|-- src/
|   |-- components/ # Reusable React components
|   |-- contexts/   # AuthContext for global state
|   |-- pages/      # Page-level components
|   |-- services/   # Centralized API (Axios) service
|   |-- App.jsx     # Main component with routing
|   |-- main.jsx    # Application entry point
