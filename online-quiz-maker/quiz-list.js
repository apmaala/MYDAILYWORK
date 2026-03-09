document.addEventListener('DOMContentLoaded', async () => {
    const quizzesContainer = document.getElementById('quizzesContainer');

    if (!quizzesContainer) return;

    try {
        const response = await fetch('/api/quizzes');
        if (!response.ok) {
            throw new Error('Failed to fetch quizzes');
        }

        const quizzes = await response.json();

        if (quizzes.length === 0) {
            quizzesContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No quizzes available yet. Be the first to create one!</p>';
            return;
        }

        let html = '';
        quizzes.forEach((quiz, index) => {
            html += `
                <div class="feature-card fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="feature-icon" style="font-size: 2rem; margin-bottom: 1rem;">📝</div>
                    <h3>${quiz.title}</h3>
                    <p style="margin-bottom: 1.5rem;">${quiz.description || 'A challenging quiz to test your knowledge.'}</p>
                    <p style="font-size: 0.9rem; margin-bottom: 1.5rem;"><strong>${quiz.questionCount} Questions</strong></p>
                    <a href="take-quiz.html?id=${quiz.id}" class="btn-primary" style="text-align: center; width: 100%; display: block; text-decoration: none;">Take Quiz</a>
                </div>
            `;
        });

        quizzesContainer.innerHTML = html;
    } catch (err) {
        console.error(err);
        quizzesContainer.innerHTML = '<p style="text-align: center; color: #ef4444; grid-column: 1 / -1;">Error loading quizzes. Please make sure the server is running.</p>';
    }
});
