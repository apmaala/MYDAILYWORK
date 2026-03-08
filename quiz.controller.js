const Quiz = require('../models/quiz.model');

exports.createQuiz = async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        // Basic Validation
        if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Quiz title and at least one question are required.' });
        }

        // Validate each question structure
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length < 2 || typeof q.correctAnswer !== 'number') {
                return res.status(400).json({ error: `Question at index ${i} is invalid. It must have a 'question' string, an 'options' array with at least 2 items, and a 'correctAnswer' number index.` });
            }
        }

        const newQuiz = new Quiz({ title, description, questions });
        await newQuiz.save();

        res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating quiz' });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();

        // Return summarized quizzes, omitting questions/answers for listing page security
        const sanitizedQuizzes = quizzes.map(quiz => ({
            id: quiz._id,
            title: quiz.title,
            description: quiz.description,
            questionCount: quiz.questions.length,
            createdAt: quiz.createdAt
        }));

        res.status(200).json(sanitizedQuizzes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error retrieving quizzes' });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.status(200).json(quiz);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error retrieving quiz' });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const { answers } = req.body; // Expects an array of answer indices

        // Basic Validation
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'An array of answers is required.' });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        if (answers.length !== quiz.questions.length) {
            return res.status(400).json({ error: 'Number of answers does not match the number of questions.' });
        }

        let score = 0;
        const results = [];

        // Compare user answers with correct answers
        for (let i = 0; i < quiz.questions.length; i++) {
            const isCorrect = answers[i] === quiz.questions[i].correctAnswer;
            if (isCorrect) score++;

            results.push({
                questionIndex: i,
                isCorrect: isCorrect,
                correctAnswer: quiz.questions[i].correctAnswer,
                userAnswer: answers[i]
            });
        }

        res.status(200).json({
            message: 'Quiz submitted successfully',
            score: score,
            total: quiz.questions.length,
            results: results
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error submitting quiz' });
    }
};
