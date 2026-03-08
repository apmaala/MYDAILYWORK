document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questionsContainer');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const saveQuizBtn = document.getElementById('saveQuizBtn');

    if (!questionsContainer || !addQuestionBtn) return;

    let questionCount = 0;

    function createOptionRow(qIndex, isFirst = false) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-row';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `correctOption_${qIndex}`;
        if (isFirst) radio.checked = true;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.placeholder = 'Option text';
        input.required = true;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove';
        removeBtn.style.position = 'static';
        removeBtn.innerHTML = '✕';
        removeBtn.onclick = () => optionDiv.remove();

        optionDiv.appendChild(radio);
        optionDiv.appendChild(input);

        if (!isFirst) {
            optionDiv.appendChild(removeBtn);
        }

        return optionDiv;
    }

    function addQuestion() {
        questionCount++;
        const qIndex = questionCount;

        const card = document.createElement('div');
        card.className = 'card question-card fade-in-up';
        card.innerHTML = `
            <button type="button" class="btn-remove" title="Remove Question">✕</button>
            <div class="form-group">
                <label>Question ${qIndex}</label>
                <input type="text" class="form-control" placeholder="What is your question?" required>
            </div>
            <div class="options-container" id="options_${qIndex}">
                <label>Multiple Choice Options (Select the correct answer)</label>
            </div>
            <button type="button" class="btn-add-option">➕ Add Option</button>
        `;

        const optionsContainerDiv = card.querySelector(`#options_${qIndex}`);
        optionsContainerDiv.appendChild(createOptionRow(qIndex, true));
        optionsContainerDiv.appendChild(createOptionRow(qIndex, false));

        // Add Option button listener
        card.querySelector('.btn-add-option').addEventListener('click', () => {
            optionsContainerDiv.appendChild(createOptionRow(qIndex, false));
        });

        // Remove Question button listener
        card.querySelector('.btn-remove').addEventListener('click', () => {
            card.remove();
            // Optional: re-number questions here
        });

        questionsContainer.appendChild(card);
    }

    // Initialize with one question
    addQuestion();

    // Add another question
    addQuestionBtn.addEventListener('click', addQuestion);

    // Save Quiz Form Logic
    saveQuizBtn.addEventListener('click', async () => {
        const title = document.getElementById('quizTitle').value.trim();
        const description = document.getElementById('quizDescription').value.trim();

        if (!title) {
            alert('Please enter a Quiz Title.');
            return;
        }

        const qCards = questionsContainer.querySelectorAll('.question-card');
        if (qCards.length === 0) {
            alert('Please add at least one question.');
            return;
        }

        const questions = [];
        let isValid = true;

        qCards.forEach((card, index) => {
            if (!isValid) return;

            const inputs = card.querySelectorAll('.form-control');
            const questionText = inputs[0].value.trim();

            if (!questionText) {
                alert(`Please enter the text for Question ${index + 1}.`);
                isValid = false;
                return;
            }

            const optionRows = card.querySelectorAll('.option-row');
            const options = [];
            let correctAnswer = -1;

            optionRows.forEach((row, optIndex) => {
                const optText = row.querySelector('.form-control').value.trim();
                const isChecked = row.querySelector('input[type="radio"]').checked;

                if (optText) {
                    options.push(optText);
                    if (isChecked) {
                        correctAnswer = options.length - 1; // map correctly to clean options array
                    }
                }
            });

            if (options.length < 2) {
                alert(`Question ${index + 1} needs at least 2 complete options.`);
                isValid = false;
                return;
            }

            if (correctAnswer === -1) {
                alert(`Please select a correct answer for Question ${index + 1}.`);
                isValid = false;
                return;
            }

            questions.push({
                question: questionText,
                options: options,
                correctAnswer: correctAnswer
            });
        });

        if (!isValid) return;

        try {
            saveQuizBtn.disabled = true;
            saveQuizBtn.innerText = 'Saving...';

            const response = await fetch('/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, questions })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Quiz created successfully!');
                window.location.href = 'index.html'; // Or redirect to quizzes.html
            } else {
                alert('Error: ' + data.error);
                saveQuizBtn.disabled = false;
                saveQuizBtn.innerText = 'Save & Publish Quiz';
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save quiz. Please ensure the server is running.');
            saveQuizBtn.disabled = false;
            saveQuizBtn.innerText = 'Save & Publish Quiz';
        }
    });
});
