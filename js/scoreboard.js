let quizId = null;
let quizOwner = null;
let unsubscribe = null;

document.addEventListener('DOMContentLoaded', function() {
    initChristmasEffects();
    
    // Get quiz ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    quizId = urlParams.get('quiz');
    
    if (!quizId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load quiz info and scores
    loadQuizInfo();
    loadScores();
    
    // Set up refresh button
    document.getElementById('refresh-btn').addEventListener('click', loadScores);
    document.getElementById('share-quiz-btn').addEventListener('click', shareQuiz);
    
    // Track scoreboard view
    firebase.analytics().logEvent('scoreboard_viewed', { quiz_id: quizId });
});

async function loadQuizInfo() {
    try {
        const quizDoc = await db.collection('quizzes').doc(quizId).get();
        
        if (quizDoc.exists) {
            const data = quizDoc.data();
            quizOwner = data.ownerName;
            document.getElementById('scoreboard-title').textContent = `${data.ownerName}'s Quiz Scoreboard`;
            
            // Load statistics
            const statsDoc = await db.collection('quizzes').doc(quizId).get();
            const stats = statsDoc.data();
            
            const statsHtml = `
                <h3 style="margin-bottom: 15px;">📊 Quiz Statistics</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div style="text-align: center; padding: 15px; background: var(--light); border-radius: 10px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">
                            ${stats.totalAttempts || 0}
                        </div>
                        <div style="color: #666; font-size: 0.9rem;">Total Players</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: var(--light); border-radius: 10px;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--secondary);">
                            ${stats.totalAttempts ? Math.round((stats.totalScore || 0) / stats.totalAttempts) : 0}/10
                        </div>
                        <div style="color: #666; font-size: 0.9rem;">Average Score</div>
                    </div>
                </div>
            `;
            
            document.getElementById('quiz-stats').innerHTML = statsHtml;
        }
    } catch (error) {
        console.error('Error loading quiz info:', error);
    }
}

async function loadScores() {
    const container = document.getElementById('scores-container');
    const refreshBtn = document.getElementById('refresh-btn');
    
    // Show loading
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading scores...</p>
        </div>
    `;
    
    // Disable refresh button temporarily
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Refreshing...';
    
    try {
        // Unsubscribe from previous listener if exists
        if (unsubscribe) {
            unsubscribe();
        }
        
        // Subscribe to real-time updates
        unsubscribe = db.collection('scores').doc(quizId)
            .collection('attempts')
            .orderBy('score', 'desc')
            .orderBy('submittedAt', 'asc')
            .onSnapshot(snapshot => {
                const scores = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    scores.push({
                        id: doc.id,
                        ...data,
                        submittedAt: data.submittedAt?.toDate() || new Date()
                    });
                });
                
                displayScores(scores);
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="bx bx-refresh"></i> Refresh';
            });
        
    } catch (error) {
        console.error('Error loading scores:', error);
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">😕</div>
                <h3>Error Loading Scores</h3>
                <p style="color: #666; margin: 15px 0;">Please try again later</p>
                <button onclick="loadScores()" class="btn btn-primary">
                    <i class='bx bx-refresh'></i> Try Again
                </button>
            </div>
        `;
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="bx bx-refresh"></i> Refresh';
    }
}

function displayScores(scores) {
    const container = document.getElementById('scores-container');
    const totalPlayers = document.getElementById('total-players');
    
    if (scores.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">📭</div>
                <h3>No Scores Yet</h3>
                <p style="color: #666; margin: 15px 0;">Be the first to take the quiz!</p>
                <a href="quiz.html?quiz=${quizId}" class="btn btn-primary">
                    <i class='bx bx-play'></i> Take the Quiz
                </a>
            </div>
        `;
        totalPlayers.textContent = "0 players";
        return;
    }
    
    totalPlayers.textContent = `${scores.length} player${scores.length !== 1 ? 's' : ''}`;
    
    let html = '';
    scores.forEach((score, index) => {
        const rank = index + 1;
        const timeAgo = getTimeAgo(score.submittedAt);
        
        html += `
            <div class="score-item">
                <div class="rank ${rank <= 3 ? `rank-${rank}` : ''}">
                    ${rank}
                </div>
                <div style="flex: 1; margin: 0 15px;">
                    <div style="font-weight: bold; font-size: 1.1rem;">
                        ${score.name}
                        ${score.name === quizOwner ? ' 👑' : ''}
                    </div>
                    <div style="color: #666; font-size: 0.9rem;">
                        ${timeAgo}
                    </div>
                </div>
                <div style="font-weight: bold; font-size: 1.3rem; color: var(--primary);">
                    ${score.score}/10
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
    
    return "just now";
}

function shareQuiz() {
    const quizLink = `${window.location.origin}/quiz.html?quiz=${quizId}`;
    const message = `Can you beat my score on ${quizOwner}'s FRIENDS quiz? 🏆 ${quizLink} Challenge accepted? 😎`;
    
    if (navigator.share) {
        navigator.share({
            title: 'FRIENDS Quiz Challenge',
            text: message,
            url: quizLink
        }).then(() => {
            firebase.analytics().logEvent('quiz_challenge_shared');
        });
    } else {
        navigator.clipboard.writeText(message).then(() => {
            showNotification('Challenge copied! Share it with friends! 📋', 'success');
            firebase.analytics().logEvent('quiz_challenge_copied');
        });
    }
}

function showNotification(message, type) {
    // Same notification function as before
}

function initChristmasEffects() {
    // Same Christmas effects as before
}

// Clean up listener when leaving page
window.addEventListener('beforeunload', () => {
    if (unsubscribe) {
        unsubscribe();
    }
});
