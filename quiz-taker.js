document.addEventListener('DOMContentLoaded', async () => {
    // State
    let quizData = null;
    let currentQuestionIndex = 0;
    let selectedOptionIndex = null;
    let userAnswers = [];

    // Extract Quiz ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    // DOM Elements
    const quizHeaderTitle = document.getElementById('quizHeaderTitle');
    const quizHeaderDesc = document.getElementById('quizHeaderDesc');
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    const questionTitle = document.getElementById('questionTitle');
    const optionsList = document.getElementById('optionsList');
    const nextBtn = document.getElementById('nextBtn');

    const quizCard = document.getElementById('quizCard');
    const resultsCard = document.getElementById('resultsCard');
    const scoreText = document.getElementById('scoreText');
    const totalText = document.getElementById('totalText');
    const feedbackText = document.getElementById('feedbackText');
    const answersReview = document.getElementById('answersReview');

    if (!quizCard) return;

    if (!quizId) {
        quizCard.innerHTML = '<h2>Error: No Quiz ID provided in URL.</h2><a href="index.html" class="btn-primary mt-4">Go Back</a>';
        return;
    }

    // Fetch quiz data from backend
    try {
        const response = await fetch(`/api/quizzes/${quizId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch quiz');
        }
        quizData = await response.json();
        initQuiz();
    } catch (err) {
        console.error(err);
        quizCard.innerHTML = '<h2>Error: Could not load the quiz. It might have been deleted.</h2><a href="index.html" class="btn-primary" style="margin-top: 2rem;">Go Back</a>';
    }

    // Initialize Quiz
    function initQuiz() {
        quizHeaderTitle.textContent = quizData.title;
        quizHeaderDesc.textContent = quizData.description || '';
        loadQuestion();
    }

    function loadQuestion() {
        // Reset state for new question
        selectedOptionIndex = null;
        nextBtn.disabled = true;
        optionsList.innerHTML = '';

        const currentQ = quizData.questions[currentQuestionIndex];
        const totalQ = quizData.questions.length;

        // Update header & progress UI
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${totalQ}`;
        progressBar.style.width = `${(currentQuestionIndex / totalQ) * 100}%`;
        questionTitle.textContent = currentQ.question;

        // Render options
        currentQ.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn fade-in-up';
            btn.style.animationDelay = `${index * 0.1}s`;

            const letter = String.fromCharCode(65 + index); // A, B, C, D...

            btn.innerHTML = `
                <span class="option-letter">${letter}</span>
                <span class="option-text">${optText}</span>
            `;

            btn.addEventListener('click', () => selectOption(index, btn));
            optionsList.appendChild(btn);
        });

        // Update button text if it's the last question
        if (currentQuestionIndex === totalQ - 1) {
            nextBtn.textContent = 'Submit Quiz';
        } else {
            nextBtn.textContent = 'Next Question';
        }
    }

    function selectOption(index, btnElement) {
        selectedOptionIndex = index;
        nextBtn.disabled = false;

        // Remove 'selected' from all buttons
        const allBtns = optionsList.querySelectorAll('.option-btn');
        allBtns.forEach(btn => btn.classList.remove('selected'));

        // Add 'selected' to the clicked button
        btnElement.classList.add('selected');
    }

    async function handleNext() {
        if (selectedOptionIndex === null) return;

        // Track the user's answer
        userAnswers.push(selectedOptionIndex);

        // Move to next question or submit
        if (currentQuestionIndex < quizData.questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            await submitQuiz();
        }
    }

    async function submitQuiz() {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Submitting...';

        try {
            const response = await fetch(`/api/quizzes/${quizId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: userAnswers })
            });

            if (!response.ok) {
                throw new Error('Failed to submit quiz');
            }

            const resultData = await response.json();
            showResults(resultData);
        } catch (err) {
            console.error(err);
            alert('Error submitting quiz. Please try again.');
            nextBtn.disabled = false;
            nextBtn.textContent = 'Submit Quiz';
        }
    }

    function showResults(data) {
        // Complete the progress bar
        progressBar.style.width = '100%';

        // Hide quiz card, show results
        quizCard.style.display = 'none';
        resultsCard.style.display = 'block';

        // Update results UI
        scoreText.textContent = data.score;
        totalText.textContent = data.total;

        const percentage = (data.score / data.total) * 100;

        if (percentage === 100) {
            feedbackText.textContent = "Perfect! You nailed it. 🌟";
        } else if (percentage >= 75) {
            feedbackText.textContent = "Great job! You know your stuff. 👍";
        } else if (percentage >= 50) {
            feedbackText.textContent = "Not bad, but room for improvement! 🤔";
        } else {
            feedbackText.textContent = "Keep practicing! You'll get it next time. 📚";
        }

        // Generate Answers Review from Backend Data
        if (answersReview && data.results) {
            let reviewHTML = '<h3>Answers Review</h3>';
            data.results.forEach((r, index) => {
                const q = quizData.questions[index];
                const isCorrect = r.isCorrect;
                const correctOptionStr = q.options[r.correctAnswer];
                const userOptionStr = r.userAnswer !== undefined && r.userAnswer !== null ? q.options[r.userAnswer] : 'No answer';

                reviewHTML += `
                    <div class="review-item ${isCorrect ? 'review-correct' : 'review-incorrect'}">
                        <h4>Q${index + 1}: ${q.question}</h4>
                        <p><strong>Your Answer:</strong> ${userOptionStr} ${isCorrect ? '✅' : '❌'}</p>
                        ${!isCorrect ? `<p><strong>Correct Answer:</strong> ${correctOptionStr}</p>` : ''}
                    </div>
                `;
            });
            answersReview.innerHTML = reviewHTML;
        }
    }

    nextBtn.addEventListener('click', handleNext);
});
