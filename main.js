// Cookie Policy Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already made cookie choice
    if (!localStorage.getItem('cookieConsent')) {
        // Show cookie modal after a short delay
        setTimeout(() => {
            showCookieModal();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }, 1000);
    }

    // Add click handlers to cookie buttons in footer
    const cookieButtons = document.querySelectorAll('.cookie-actions button');
    cookieButtons.forEach(button => {
        button.addEventListener('click', handleCookieChoice);
    });
});

function showCookieModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'cookie-modal-overlay';
    modal.innerHTML = `
        <div class="cookie-modal">
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h3>Cookie Policy</h3>
                    <button class="cookie-modal-close" aria-label="Close cookie modal">&times;</button>
                </div>
                <div class="cookie-modal-body">
                    <p>We use essential cookies to ensure you get the best experience on our website. These help us analyze site usage and improve our fuel supply services.</p>
                    <div class="cookie-options">
                        <label class="cookie-option">
                            <input type="radio" name="cookieChoice" value="all" checked>
                            <span>Accept All Cookies</span>
                            <small>Includes analytics and performance cookies</small>
                        </label>
                        <label class="cookie-option">
                            <input type="radio" name="cookieChoice" value="essential">
                            <span>Essential Cookies Only</span>
                            <small>Required for basic website functionality</small>
                        </label>
                    </div>
                </div>
                <div class="cookie-modal-actions">
                    <button class="btn btn-primary" data-choice="all">Accept All</button>
                    <button class="btn btn-outline" data-choice="essential">Essential Only</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners to modal
    const closeBtn = modal.querySelector('.cookie-modal-close');
    const modalButtons = modal.querySelectorAll('.cookie-modal-actions button');
    
    closeBtn.addEventListener('click', hideCookieModal);
    
    modalButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleCookieChoice(this.dataset.choice);
            hideCookieModal();
        });
    });
    
    // Close modal when clicking overlay
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideCookieModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideCookieModal();
        }
    });
}

function hideCookieModal() {
    const modal = document.querySelector('.cookie-modal-overlay');
    if (modal) {
        modal.classList.add('hiding');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }
}

function handleCookieChoice(choice) {
    // Save user's choice
    localStorage.setItem('cookieConsent', choice);
    
    // Hide the static cookie section in footer
    const cookieSection = document.querySelector('.cookie');
    if (cookieSection) {
        cookieSection.style.display = 'none';
    }
    
    // Here you would typically integrate with your analytics/cookie management
    console.log('Cookie choice:', choice);
    
    // You can add actual cookie setting logic here
    if (choice === 'all') {
        // Set all cookies
        document.cookie = "analytics=accepted; path=/; max-age=31536000";
        document.cookie = "marketing=accepted; path=/; max-age=31536000";
    } else {
        // Set only essential cookies
        document.cookie = "essential=accepted; path=/; max-age=31536000";
    }
}
