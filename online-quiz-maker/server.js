const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/online_quiz_maker')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Serve static frontend files from the root directory (temporary until moved to a public folder)
// In a full app, it's highly recommended to place your HTML/CSS/JS in a "public" folder and serve that instead.
app.use(express.static(__dirname));

// Import Routes
const quizRoutes = require('./src/routes/quiz.routes');
const authRoutes = require('./src/routes/auth.routes');

// Use Routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/auth', authRoutes);

// Base route for server testing
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the QuizMaker API!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
