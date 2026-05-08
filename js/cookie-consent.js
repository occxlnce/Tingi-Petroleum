// Cookie Consent Management for Tingi Petroleum
class CookieConsent {
  constructor() {
    this.hasConsented = localStorage.getItem('tingi-cookie-consent');
    this.init();
  }

  init() {
    if (!this.hasConsented) {
      this.createCookieUI();
      this.animateEntry();
    }
  }

  createCookieUI() {
    const cookieHTML = `
      <div class="cookie-container" id="tingiCookieConsent">
        <div class="cookie-icon">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10z" fill="#ffd800"/>
            <path d="M35 35c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z" fill="#003366"/>
            <path d="M65 35c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z" fill="#003366"/>
            <path d="M50 25c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z" fill="#003366"/>
            <path d="M40 65c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z" fill="#003366"/>
            <path d="M60 65c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z" fill="#003366"/>
          </svg>
        </div>
        
        <div class="cookie-content">
          <h3 class="cookie-title">Cookie Policy</h3>
          <p class="cookie-message">
            We use essential cookies to ensure you get the best experience on our website. These help us analyze site usage and improve our fuel supply services.
          </p>
          <div class="cookie-buttons">
            <button class="btn-accept" id="acceptCookies">Accept All</button>
            <button class="btn-decline" id="declineCookies">Essential Only</button>
          </div>
        </div>
        
        <button class="cookie-close" id="closeCookie" aria-label="Close cookie banner">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="#003366" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', cookieHTML);
    this.attachEventListeners();
  }

  attachEventListeners() {
    document.getElementById('acceptCookies').addEventListener('click', () => this.accept());
    document.getElementById('declineCookies').addEventListener('click', () => this.decline());
    document.getElementById('closeCookie').addEventListener('click', () => this.hide());
  }

  animateEntry() {
    const container = document.getElementById('tingiCookieConsent');
    
    // Simple CSS animation for gallery layout
    setTimeout(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
  }

  accept() {
    localStorage.setItem('tingi-cookie-consent', 'all');
    this.hide();
    this.loadAnalytics();
  }

  decline() {
    localStorage.setItem('tingi-cookie-consent', 'essential');
    this.hide();
  }

  hide() {
    const container = document.getElementById('tingiCookieConsent');
    container.style.opacity = '0';
    container.style.transform = 'translateX(-50%) translateY(100%)';
    
    setTimeout(() => {
      container.remove();
    }, 300);
  }

  loadAnalytics() {
    // Load Google Analytics or other tracking scripts here
    console.log('Analytics loaded with user consent');
  }
}

// Initialize cookie consent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CookieConsent();
});
