document.addEventListener('DOMContentLoaded', function() {
    initChristmasEffects();
    
    // Get quiz ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quiz');
    
    if (!quizId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Generate quiz link
    const quizLink = `${window.location.origin}/quiz.html?quiz=${quizId}`;
    document.getElementById('quiz-link').value = quizLink;
    
    // Set up event listeners
    document.getElementById('copy-btn').addEventListener('click', copyQuizLink);
    document.getElementById('copy-message').addEventListener('click', copyShareMessage);
    document.getElementById('scoreboard-btn').href = `scoreboard.html?quiz=${quizId}`;
    
    // Update share message with link
    const shareMessage = document.getElementById('share-message');
    shareMessage.dataset.fullMessage = `I made a FRIENDS quiz 🎄 Try it and see how well you know me! ${quizLink} Let's see if you're really my best friend! 😄`;
    
    // Track share page view
    firebase.analytics().logEvent('share_page_view', { quiz_id: quizId });
});

function copyQuizLink() {
    const linkInput = document.getElementById('quiz-link');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        navigator.clipboard.writeText(linkInput.value).then(() => {
            showNotification('Link copied to clipboard! 📋', 'success');
            
            // Add confetti effect
            createConfetti();
            
            // Track copy action
            firebase.analytics().logEvent('link_copied');
        });
    } catch (err) {
        // Fallback for older browsers
        document.execCommand('copy');
        showNotification('Link copied to clipboard! 📋', 'success');
        createConfetti();
    }
}

function copyShareMessage() {
    const message = document.getElementById('share-message').dataset.fullMessage;
    
    try {
        navigator.clipboard.writeText(message).then(() => {
            showNotification('Message copied! 📝', 'success');
            firebase.analytics().logEvent('message_copied');
        });
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = message;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Message copied! 📝', 'success');
    }
}

function shareOnWhatsApp() {
    const quizLink = document.getElementById('quiz-link').value;
    const message = encodeURIComponent(`I made a FRIENDS quiz 🎄 Try it and see how well you know me! ${quizLink}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
    firebase.analytics().logEvent('whatsapp_share');
}

function shareOnFacebook() {
    const quizLink = document.getElementById('quiz-link').value;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(quizLink)}`, '_blank');
    firebase.analytics().logEvent('facebook_share');
}

function shareOnTwitter() {
    const quizLink = document.getElementById('quiz-link').value;
    const message = encodeURIComponent(`Take my FRIENDS quiz and see how well you know me! 🎄 ${quizLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
    firebase.analytics().logEvent('twitter_share');
}

function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#FF9F68', '#A8E6CF'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 50}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            transform: rotate(${Math.random() * 360}deg);
            animation: fallConfetti ${Math.random() * 1 + 1}s ease forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 1000);
    }
    
    // Add to CSS:
    // @keyframes fallConfetti {
    //     0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
    //     100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    // }
}

function showNotification(message, type = 'success') {
    // Same as in create.js
}

function initChristmasEffects() {
    // Same as in create.js
}
