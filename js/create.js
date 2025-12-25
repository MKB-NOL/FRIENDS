// Questions Database
const QUESTIONS = [
    {
        id: 1,
        text: "What's my favorite type of food?",
        options: ["Italian 🍝", "Mexican 🌮", "Chinese 🥡", "Indian 🍛", "Burgers 🍔", "Sushi 🍣"]
    },
    {
        id: 2,
        text: "What would I do on a perfect weekend?",
        options: ["Netflix marathon 📺", "Outdoor adventure 🏕️", "Party with friends 🎉", "Sleep all day 😴", "Try new restaurants 🍽️", "Read books 📚"]
    },
    {
        id: 3,
        text: "What's my go-to karaoke song?",
        options: ["Don't Stop Believin' 🎤", "Bohemian Rhapsody 🎸", "Wannabe 👯‍♀️", "Shape of You 🎶", "Sweet Caroline 👏", "I don't sing! 🙊"]
    },
    {
        id: 4,
        text: "What's my biggest pet peeve?",
        options: ["Being late ⏰", "Loud chewing 🤢", "Bad texting etiquette 📱", "People who don't listen 👂", "Messy spaces 🗑️", "Rude people 😠"]
    },
    {
        id: 5,
        text: "What's my dream vacation destination?",
        options: ["Bali 🌴", "Japan 🗾", "Italy 🏛️", "New Zealand 🏔️", "Maldives 🏝️", "Anywhere with a beach! 🌊"]
    },
    {
        id: 6,
        text: "What superpower would I choose?",
        options: ["Invisibility 👻", "Flight 🦸‍♂️", "Time travel ⏳", "Teleportation ✨", "Mind reading 🧠", "Super strength 💪"]
    },
    {
        id: 7,
        text: "What's my coffee order?",
        options: ["Black coffee ☕", "Latte with oat milk 🥛", "I don't drink coffee ❌", "Sweet frappuccino 🍦", "Espresso shot ⚡", "Tea instead! 🍵"]
    },
    {
        id: 8,
        text: "Which movie makes me cry every time?",
        options: ["The Notebook 💔", "Up 🎈", "Toy Story 3 🧸", "Marley & Me 🐕", "Forrest Gump 🏃", "I don't cry at movies! 😎"]
    },
    {
        id: 9,
        text: "What's my hidden talent?",
        options: ["Great cook 👨‍🍳", "Can sing well 🎵", "Speaks multiple languages 🗣️", "Really good at trivia 🧠", "Great dancer 💃", "I'm secretly average! 🤫"]
    },
    {
        id: 10,
        text: "What would I save first in a fire?",
        options: ["Phone 📱", "Photo albums 📸", "Pet 🐾", "Laptop 💻", "Favorite hoodie 👕", "Myself! 🏃‍♂️"]
    },
    {
        id: 11,
        text: "What's my morning routine like?",
        options: ["Hit snooze 5 times ⏰", "Workout first thing 🏋️", "Scroll phone in bed 📱", "Quick and efficient ⚡", "Doesn't exist 😴", "Coffee then everything else ☕"]
    },
    {
        id: 12,
        text: "What's my favorite season?",
        options: ["Summer ☀️", "Winter ❄️", "Spring 🌸", "Fall 🍂", "All of them! 🌈", "Season of giving! 🎅"]
    },
    {
        id: 13,
        text: "What emoji do I use the most?",
        options: ["😂", "❤️", "🔥", "😭", "🤔", "✨"]
    },
    {
        id: 14,
        text: "How do I handle stress?",
        options: ["Exercise 🏃‍♀️", "Eat junk food 🍕", "Talk to friends 🗣️", "Play video games 🎮", "Listen to music 🎧", "Sleep it off 😴"]
    },
    {
        id: 15,
        text: "What's my biggest fear?",
        options: ["Heights 🏔️", "Public speaking 🎤", "Spiders 🕷️", "Failure 😰", "Being alone 😔", "The dark 🌑"]
    },
    {
        id: 16,
        text: "What's my signature style?",
        options: ["Comfortable 👟", "Trendy 👕", "Classic 👔", "Sporty 🏀", "Mix of everything 🎨", "Pajamas all day! 🛏️"]
    },
    {
        id: 17,
        text: "What reality show would I survive on?",
        options: ["Survivor 🏝️", "The Amazing Race 🌍", "Big Brother 🏠", "Love Island ❤️", "Naked and Afraid 🥶", "I'd be voted off first! 🚪"]
    },
    {
        id: 18,
        text: "What's my guilty pleasure?",
        options: ["Reality TV 📺", "Junk food 🍫", "Social media 📱", "Rom-coms 💕", "Shopping 🛍️", "All of the above! 🙈"]
    },
    {
        id: 19,
        text: "How do I celebrate Christmas?",
        options: ["Big family dinner 👨‍👩‍👧‍👦", "Quiet at home 🏠", "Travel somewhere ✈️", "Lots of parties 🎉", "Volunteering ❤️", "All about the food! 🍪"]
    },
    {
        id: 20,
        text: "What makes me laugh the most?",
        options: ["Dad jokes 😂", "Memes 📱", "Silly animal videos 🐶", "Friends' stories 👯", "Awkward situations 😅", "Everything! 🤣"]
    }
];

let selectedQuestions = new Set();
let selectedAnswers = {};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Christmas effects
    initChristmasEffects();
    
    // Load questions
    loadQuestions();
    
    // Set up event listeners
    document.getElementById('generate-btn').addEventListener('click', generateQuiz);
    document.getElementById('nickname').addEventListener('input', validateForm);
});

function loadQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    
    // Shuffle questions
    const shuffledQuestions = [...QUESTIONS].sort(() => Math.random() - 0.5);
    
    shuffledQuestions.forEach(question => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.dataset.id = question.id;
        
        questionCard.innerHTML = `
            <div class="question-text">${question.text}</div>
            <div class="answer-options">
                ${question.options.map(option => `
                    <div class="answer-option" data-option="${option}">${option}</div>
                `).join('')}
            </div>
        `;
        
        questionCard.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-option')) {
                toggleQuestionSelection(question.id, e.target.dataset.option);
            } else {
                toggleQuestionSelection(question.id, question.options[0]);
            }
        });
        
        container.appendChild(questionCard);
    });
}

function toggleQuestionSelection(questionId, selectedOption) {
    const questionCard = document.querySelector(`[data-id="${questionId}"]`);
    
    if (selectedQuestions.has(questionId)) {
        // Deselect
        selectedQuestions.delete(questionId);
        delete selectedAnswers[questionId];
        questionCard.classList.remove('selected');
        questionCard.querySelectorAll('.answer-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    } else {
        // Select if we have less than 10
        if (selectedQuestions.size < 10) {
            selectedQuestions.add(questionId);
            selectedAnswers[questionId] = selectedOption;
            questionCard.classList.add('selected');
            questionCard.querySelector(`[data-option="${selectedOption}"]`).classList.add('selected');
        } else {
            // Show error
            showNotification('You can only select 10 questions!', 'error');
            return;
        }
    }
    
    updateSelectionCount();
    validateForm();
}

function updateSelectionCount() {
    const count = selectedQuestions.size;
    const countElement = document.getElementById('selected-count');
    const progressBar = document.getElementById('progress-bar');
    const generateBtn = document.getElementById('generate-btn');
    
    countElement.textContent = `${count}/10 selected`;
    progressBar.style.width = `${(count / 10) * 100}%`;
    
    if (count === 10) {
        countElement.style.background = 'var(--secondary)';
        countElement.style.color = 'white';
    } else {
        countElement.style.background = 'var(--accent)';
        countElement.style.color = 'var(--dark)';
    }
    
    generateBtn.textContent = `Generate My Quiz (${count}/10)`;
}

function validateForm() {
    const nickname = document.getElementById('nickname').value.trim();
    const generateBtn = document.getElementById('generate-btn');
    
    if (nickname.length >= 2 && selectedQuestions.size === 10) {
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';
    } else {
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.6';
    }
}

async function generateQuiz() {
    const nickname = document.getElementById('nickname').value.trim();
    
    if (!nickname || selectedQuestions.size !== 10) {
        showNotification('Please complete all fields!', 'error');
        return;
    }
    
    // Show loading
    const btn = document.getElementById('generate-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Creating your quiz...';
    btn.disabled = true;
    
    try {
        // Prepare quiz data
        const quizData = {
            ownerName: nickname,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            questions: Array.from(selectedQuestions).map(id => {
                const question = QUESTIONS.find(q => q.id === id);
                return {
                    id: question.id,
                    text: question.text,
                    options: question.options,
                    correctAnswer: selectedAnswers[question.id]
                };
            })
        };
        
        // Save to Firestore
        const quizRef = await db.collection('quizzes').add(quizData);
        const quizId = quizRef.id;
        
        // Track analytics
        firebase.analytics().logEvent('quiz_created', {
            quiz_id: quizId,
            questions_count: 10
        });
        
        // Redirect to share page
        window.location.href = `share.html?quiz=${quizId}`;
        
    } catch (error) {
        console.error('Error creating quiz:', error);
        showNotification('Error creating quiz. Please try again!', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#FF6B6B' : '#4ECDC4'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add to the CSS in style.css:
// @keyframes slideDown { from { top: -50px; } to { top: 20px; } }
// @keyframes slideUp { from { top: 20px; } to { top: -50px; } }

function initChristmasEffects() {
    const container = document.getElementById('christmas-effects');
    if (!container) return;
    
    // Add snowflakes
    for (let i = 0; i < 15; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄️';
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
        snowflake.style.animationDelay = `${Math.random() * 5}s`;
        snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
        snowflake.style.opacity = Math.random() * 0.5 + 0.3;
        container.appendChild(snowflake);
    }
    
    // Add Christmas lights
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    for (let i = 0; i < 8; i++) {
        const light = document.createElement('div');
        light.className = 'christmas-light';
        light.style.top = `${20 + i * 10}px`;
        light.style.left = `${i * 12}%`;
        light.style.background = colors[i % colors.length];
        light.style.animationDelay = `${i * 0.2}s`;
        container.appendChild(light);
    }
}
