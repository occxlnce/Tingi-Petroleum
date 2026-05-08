(function () {
  "use strict";

  const html = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const subtitle = document.querySelector("[data-rotating-subtitle]");
  const words = ["CLEAN FUEL", "BULK DIESEL", "YOUR SOLUTION", "RELIABILITY"];

  html.classList.remove("no-js");
  html.classList.add("js");

  window.addEventListener("load", function () {
    body.classList.add("is-loaded");
  });

  if (header) {
    const updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (subtitle) {
    let index = 0;
    setInterval(function () {
      index = (index + 1) % words.length;
      subtitle.classList.add("is-changing");
      setTimeout(function () {
        subtitle.textContent = words[index];
        subtitle.classList.remove("is-changing");
      }, 220);
    }, 2200);
  }

  document.querySelectorAll(".faq-item").forEach(function (item) {
    const button = item.querySelector(".faq-row");
    if (!button) return;

    button.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");

      document.querySelectorAll(".faq-item").forEach(function (otherItem) {
        const otherButton = otherItem.querySelector(".faq-row");
        otherItem.classList.remove("is-open");
        if (otherButton) otherButton.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Auto Slider for Industrial Capability Section
  const sliderContainer = document.querySelector(".section-kicker-slider");
  if (sliderContainer) {
    const slides = sliderContainer.querySelectorAll(".slide");
    let currentSlide = 0;
    
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
    
    // Initialize first slide
    showSlide(0);
    
    // Auto-advance slides every 4 seconds
    setInterval(nextSlide, 4000);
  }

  // Testimonials Slider
  const testimonialsSlider = document.querySelector(".testimonials-slider");
  if (testimonialsSlider) {
    const testimonialSlides = testimonialsSlider.querySelectorAll(".testimonial-slide");
    const prevButton = document.querySelector(".prev-slide");
    const nextButton = document.querySelector(".next-slide");
    let currentTestimonial = 0;
    let autoSlideInterval;
    
    function showTestimonial(index) {
      testimonialSlides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }
    
    function nextTestimonial() {
      currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
      showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
      currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
      showTestimonial(currentTestimonial);
    }
    
    function startAutoSlide() {
      autoSlideInterval = setInterval(nextTestimonial, 5000);
    }
    
    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }
    
    // Initialize first testimonial
    showTestimonial(0);
    
    // Start auto-slide
    startAutoSlide();
    
    // Navigation button event listeners
    if (prevButton) {
      prevButton.addEventListener("click", function() {
        stopAutoSlide();
        prevTestimonial();
        startAutoSlide();
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener("click", function() {
        stopAutoSlide();
        nextTestimonial();
        startAutoSlide();
      });
    }
    
    // Pause auto-slide on hover
    testimonialsSlider.addEventListener("mouseenter", stopAutoSlide);
    testimonialsSlider.addEventListener("mouseleave", startAutoSlide);
  }

  // Service tabs functionality
  const serviceTabs = document.querySelectorAll(".service-tabs button");
  const serviceCards = document.querySelectorAll(".feature-card");
  const serviceHeading = document.querySelector(".section-title-center h2");
  const serviceSubtitle = document.querySelector(".section-title-center p");
  
  // Tab content data
  const tabContent = {
    "bulk-diesel-tab": {
      heading: "Premium bulk diesel delivery nationwide.",
      subtitle: "Reliable 50ppm clean fuel supplied directly to your industrial site or facility."
    },
    "mobile-refueling-tab": {
      heading: "On-site mobile refueling services.",
      subtitle: "We bring the fuel to your fleet, machinery, and generators to minimize downtime."
    },
    "tanks-tab": {
      heading: "Complete storage tank solutions.",
      subtitle: "Supply, installation, and maintenance of fuel storage infrastructure."
    },
    "testing-tab": {
      heading: "Comprehensive fuel quality testing.",
      subtitle: "On-site and laboratory analysis to ensure fuel compliance and performance."
    },
    "contracts-tab": {
      heading: "Long-term fuel supply contracts.",
      subtitle: "Guaranteed delivery schedules with competitive pricing and priority service."
    }
  };
  
  if (serviceTabs.length > 0 && serviceCards.length > 0 && serviceHeading && serviceSubtitle) {
    let currentTabIndex = 0;
    let autoSwitchInterval;

    function activateTab(index) {
      // Remove active class and ARIA attributes from all tabs and cards
      serviceTabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      serviceCards.forEach(function (c) {
        c.classList.remove("active-card");
        c.setAttribute("aria-hidden", "true");
      });

      // Add active class and ARIA attributes to the selected tab and corresponding card
      const tab = serviceTabs[index];
      const card = serviceCards[index];

      if (tab) {
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
      }
      if (card) {
        card.classList.add("active-card");
        card.setAttribute("aria-hidden", "false");
      }

      // Update heading and subtitle based on selected tab
      if (tab && tabContent[tab.id]) {
        serviceHeading.textContent = tabContent[tab.id].heading;
        serviceSubtitle.textContent = tabContent[tab.id].subtitle;
      }
    }

    function startAutoSwitch() {
      autoSwitchInterval = setInterval(function () {
        currentTabIndex = (currentTabIndex + 1) % serviceTabs.length;
        activateTab(currentTabIndex);
      }, 5000); // Change tab every 5 seconds
    }

    function resetAutoSwitch() {
      clearInterval(autoSwitchInterval);
      startAutoSwitch();
    }

    // Initial activation
    activateTab(currentTabIndex);
    startAutoSwitch();

    serviceTabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        currentTabIndex = index;
        activateTab(currentTabIndex);
        resetAutoSwitch(); // Reset timer when user manually clicks
      });
    });
  }

  // Sustainability cards scroll effect
  const sustainabilitySection = document.querySelector(".sustainability");
  const sustainCards = document.querySelector(".sustain-cards");
  const sustainCardArticles = sustainCards ? sustainCards.querySelectorAll("article") : [];
  
  if (sustainabilitySection && sustainCards && sustainCardArticles.length > 0) {
    // Prevent overflow issues
    sustainCards.style.overflow = "hidden";
    
    // Add transitions to individual cards for staggered movement
    sustainCardArticles.forEach((card, index) => {
      card.style.transition = `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
      card.style.transform = "translateX(0)";
    });
    
    let hasScrolledPast = false;
    let animationTimeouts = [];
    
    function moveCardsOut() {
      // Clear any existing timeouts
      animationTimeouts.forEach(timeout => clearTimeout(timeout));
      animationTimeouts = [];
      
      // Move cards out one by one with staggered timing
      sustainCardArticles.forEach((card, index) => {
        const timeout = setTimeout(() => {
          card.style.transform = "translateX(120vw)";
        }, index * 200); // 200ms stagger between each card
        animationTimeouts.push(timeout);
      });
    }
    
    function moveCardsIn() {
      // Clear any existing timeouts
      animationTimeouts.forEach(timeout => clearTimeout(timeout));
      animationTimeouts = [];
      
      // Move cards back in one by one with staggered timing
      sustainCardArticles.forEach((card, index) => {
        const timeout = setTimeout(() => {
          card.style.transform = "translateX(0)";
        }, index * 150); // 150ms stagger for return animation
        animationTimeouts.push(timeout);
      });
    }
    
    function handleSustainabilityScroll() {
      const sectionTop = sustainabilitySection.offsetTop;
      const sectionHeight = sustainabilitySection.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight;
      
      // Check if we've scrolled past the sustainability section
      if (scrollPosition > sectionTop + sectionHeight + 100) {
        if (!hasScrolledPast) {
          moveCardsOut();
          hasScrolledPast = true;
        }
      } else {
        if (hasScrolledPast) {
          moveCardsIn();
          hasScrolledPast = false;
        }
      }
    }
    
    // Initial check
    handleSustainabilityScroll();
    
    // Add scroll event listener with throttling for performance
    let scrollTimeout;
    window.addEventListener("scroll", function() {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(handleSustainabilityScroll);
    }, { passive: true });
  }
})();
