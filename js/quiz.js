let quizData = null;
let currentQuestion = 0;
let userAnswers = {};
let quizId = null;
const ATTEMPT_KEY = 'friends_quiz_attempts';

document.addEventListener('DOMContentLoaded', function() {
    initChristmasEffects();
    
    // Get quiz ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    quizId = urlParams.get('quiz');
    
    if (!quizId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check if already attempted
    if (hasAttemptedQuiz(quizId)) {
        showAlreadyAttempted();
        return;
    }
    
    // Load quiz data
    loadQuizData();
});

function hasAttemptedQuiz(quizId) {
    const attempts = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || '{}');
    return attempts[quizId] === true;
}

function markQuizAttempted(quizId) {
    const attempts = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || '{}');
    attempts[quizId] = true;
    localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempts));
}

function showAlreadyAttempted() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="card result-card">
            <div class="result-emoji">⏰</div>
            <h2>One Attempt Only!</h2>
            <p style="margin: 20px 0; color: #666;">
                You've already taken this quiz! Each friend can only attempt once to keep it fair. 😊
            </p>
            <a href="index.html" class="btn btn-primary">
                <i class='bx bx-home'></i> Create Your Own Quiz
            </a>
        </div>
    `;
}

async function loadQuizData() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading quiz...</p>
        </div>
    `;
    
    try {
        const quizDoc = await db.collection('quizzes').doc(quizId).get();
        
        if (!quizDoc.exists) {
            throw new Error('Quiz not found');
        }
        
        quizData = quizDoc.data();
        document.getElementById('quiz-title').textContent = `How well do you know ${quizData.ownerName}?`;
        
        // Track quiz view
        firebase.analytics().logEvent('quiz_viewed', { quiz_id: quizId });
        
        showNameInput();
        
    } catch (error) {
        console.error('Error loading quiz:', error);
        container.innerHTML = `
            <div class="card result-card">
                <div class="result-emoji">😕</div>
                <h2>Quiz Not Found</h2>
                <p style="margin: 20px 0; color: #666;">
                    This quiz link is invalid or has expired.
                </p>
                <a href="index.html" class="btn btn-primary">
                    <i class='bx bx-home'></i> Create Your Own Quiz
                </a>
            </div>
        `;
    }
}

function showNameInput() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="card">
            <h2 style="margin-bottom: 15px;">👋 What's your nickname?</h2>
            <p style="color: #666; margin-bottom: 20px;">Enter your nickname to appear on the scoreboard</p>
            
            <div class="form-group">
                <input type="text" id="player-name" class="form-control" placeholder="Your nickname" maxlength="20">
            </div>
            
            <button id="start-quiz" class="btn btn-primary">
                <i class='bx bx-play'></i> Start Quiz
            </button>
        </div>
    `;
    
    document.getElementById('player-name').addEventListener('input', function() {
        const btn = document.getElementById('start-quiz');
        btn.disabled = this.value.trim().length < 2;
        btn.style.opacity = btn.disabled ? '0.6' : '1';
    });
    
    document.getElementById('start-quiz').addEventListener('click', startQuiz);
}

function startQuiz() {
    const playerName = document.getElementById('player-name').value.trim();
    if (playerName.length < 2) return;
    
    userAnswers.playerName = playerName;
    showQuestion(0);
}

function showQuestion(index) {
    currentQuestion = index;
    const question = quizData.questions[index];
    
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3>Question ${index + 1} of 10</h3>
                <span style="background: var(--light); padding: 5px 15px; border-radius: 20px; font-weight: bold;">
                    ${Math.round(((index + 1) / 10) * 100)}%
                </span>
            </div>
            
            <div style="height: 5px; background: #E0E0E0; border-radius: 5px; margin-bottom: 25px;">
                <div style="width: ${((index + 1) / 10) * 100}%; height: 100%; background: var(--primary); border-radius: 5px; transition: width 0.3s ease;"></div>
            </div>
            
            <h2 style="margin-bottom: 25px;">${question.text}</h2>
            
            <div class="answer-options" id="answer-options">
                ${question.options.map((option, i) => `
                    <div class="answer-option" data-index="${i}">
                        ${option}
                    </div>
                `).join('')}
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                ${index > 0 ? `
                    <button id="prev-btn" class="btn btn-outline">
                        <i class='bx bx-chevron-left'></i> Previous
                    </button>
                ` : '<div></div>'}
                
                ${index < 9 ? `
                    <button id="next-btn" class="btn btn-primary" disabled>
                        Next <i class='bx bx-chevron-right'></i>
                    </button>
                ` : `
                    <button id="submit-btn" class="btn btn-secondary" disabled>
                        <i class='bx bx-check'></i> Submit Quiz
                    </button>
                `}
            </div>
        </div>
    `;
    
    // Set up answer selection
    const answerOptions = container.querySelectorAll('.answer-option');
    answerOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Deselect all
            answerOptions.forEach(opt => opt.classList.remove('selected'));
            // Select this one
            option.classList.add('selected');
            
            // Enable next/submit button
            const nextBtn = document.getElementById('next-btn');
            const submitBtn = document.getElementById('submit-btn');
            if (nextBtn) nextBtn.disabled = false;
            if (submitBtn) submitBtn.disabled = false;
            
            // Store answer
            userAnswers[index] = option.dataset.index;
        });
    });
    
    // Navigation buttons
    if (index > 0) {
        document.getElementById('prev-btn').addEventListener('click', () => {
            showQuestion(index - 1);
        });
    }
    
    if (index < 9) {
        document.getElementById('next-btn').addEventListener('click', () => {
            showQuestion(index + 1);
        });
    } else {
        document.getElementById('submit-btn').addEventListener('click', submitQuiz);
    }
    
    // Restore previous selection if any
    if (userAnswers[index] !== undefined) {
        answerOptions[userAnswers[index]].classList.add('selected');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        if (nextBtn) nextBtn.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function submitQuiz() {
    // Calculate score
    let score = 0;
    quizData.questions.forEach((question, index) => {
        if (userAnswers[index] !== undefined) {
            const selectedOption = question.options[userAnswers[index]];
            if (selectedOption === question.correctAnswer) {
                score++;
            }
        }
    });
    
    // Save score to database
    try {
        const scoreData = {
            name: userAnswers.playerName,
            score: score,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('scores').doc(quizId).collection('attempts').add(scoreData);
        
        // Update quiz stats
        await db.collection('quizzes').doc(quizId).update({
            totalAttempts: firebase.firestore.FieldValue.increment(1),
            totalScore: firebase.firestore.FieldValue.increment(score)
        });
        
        // Mark as attempted
        markQuizAttempted(quizId);
        
        // Track submission
        firebase.analytics().logEvent('quiz_submitted', {
            quiz_id: quizId,
            score: score
        });
        
        // Show results
        showResults(score);
        
    } catch (error) {
        console.error('Error saving score:', error);
        showResults(score); // Still show results even if save fails
    }
}

function showResults(score) {
    const container = document.getElementById('quiz-container');
    
    // Determine result message
    let emoji, message, color;
    if (score === 10) {
        emoji = '🏆';
        message = 'BEST FRIEND ALERT!';
        color = '#FFD700'; // Gold
        createConfetti(); // Celebration for perfect score
    } else if (score >= 7) {
        emoji = '😄';
        message = 'Close Friend!';
        color = '#4ECDC4';
    } else if (score >= 5) {
        emoji = '👍';
        message = 'Good Friend!';
        color = '#FFD166';
    } else {
        emoji = '😅';
        message = 'Still Learning!';
        color = '#FF9F68';
    }
    
    container.innerHTML = `
        <div class="card result-card">
            <div class="result-emoji" style="color: ${color};">${emoji}</div>
            <h2>${message}</h2>
            <p style="margin: 10px 0 30px; color: #666;">
                You scored ${score} out of 10 questions about ${quizData.ownerName}!
            </p>
            
            <div class="score-circle" style="background: ${color};">
                ${score}/10
            </div>
            
            <div style="margin: 30px 0;">
                <h4>🎯 Your Result:</h4>
                <p style="margin: 10px 0; color: #666;">
                    ${getResultMessage(score)}
                </p>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <a href="scoreboard.html?quiz=${quizId}" class="btn btn-primary" style="flex: 1;">
                    <i class='bx bx-trophy'></i> View Scoreboard
                </a>
                <a href="index.html" class="btn btn-outline" style="flex: 1;">
                    <i class='bx bx-plus'></i> Create My Quiz
                </a>
            </div>
            
            <div style="text-align: center;">
                <button id="share-result" class="btn btn-secondary" style="margin-bottom: 10px;">
                    <i class='bx bx-share-alt'></i> Share My Score
                </button>
                <p style="color: #666; font-size: 0.9rem;">
                    Challenge your friends to beat your score!
                </p>
            </div>
        </div>
    `;
    
    document.getElementById('share-result').addEventListener('click', shareResult);
}

function getResultMessage(score) {
    const messages = {
        10: "Perfect score! You know them better than they know themselves! 🎯",
        9: "Almost perfect! You're clearly one of their closest friends! 👯",
        8: "Excellent! You pay attention to the details that matter! ✨",
        7: "Great job! You know them pretty well! 😊",
        6: "Good score! You know the important things! 👍",
        5: "Not bad! You're getting to know them better! 🤔",
        4: "Room for improvement! Keep learning about them! 📚",
        3: "Getting there! Maybe have more heart-to-heart talks! 💬",
        2: "Early days! Every friendship starts somewhere! 🌱",
        1: "Just starting! This is the beginning of your journey! 🚀",
        0: "Surprise! Sometimes opposites attract the most! 🤷‍♂️"
    };
    
    return messages[score] || "Thanks for playing!";
}

function shareResult() {
    const score = userAnswers.score || 0;
    const message = `I scored ${score}/10 on ${quizData.ownerName}'s FRIENDS quiz! 🎄 Can you beat my score? ${window.location.origin}/quiz.html?quiz=${quizId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'FRIENDS Quiz Result',
            text: message,
            url: window.location.href
        }).then(() => {
            firebase.analytics().logEvent('result_shared');
        });
    } else {
        navigator.clipboard.writeText(message).then(() => {
            showNotification('Result copied to clipboard! Share it with friends! 📋', 'success');
            firebase.analytics().logEvent('result_copied');
        });
    }
}

function createConfetti() {
    // Same confetti function as in share.js
}

function showNotification(message, type) {
    // Same notification function as before
}

function initChristmasEffects() {
    // Same Christmas effects as before
}
