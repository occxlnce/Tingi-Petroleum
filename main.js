// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    
    if (navToggle && navMobile) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMobile.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.nav-mobile-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMobile.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMobile.contains(e.target)) {
                navToggle.classList.remove('active');
                navMobile.classList.remove('active');
            }
        });
    }
    
    console.log('Tingi Petroleum website loaded');
});




