import 'dotenv/config'; // Loads environment variables
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRoutes from './routes/index.js'; // Import the central router

const app = express();

// Middleware
app.use(cors()); // Allows cross-origin requests from our frontend
app.use(express.json()); // Allows the server to accept JSON in the request body

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// All routes will be prefixed with /api
app.use('/api', apiRoutes);

// --- Basic Route ---
app.get('/', (req, res) => {
  res.send('AI Syllabus Tracker API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
