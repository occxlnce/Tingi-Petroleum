document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Active nav highlight
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Duplicate ticker for seamless loop
  document.querySelectorAll('.ticker-track').forEach(track => {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  // Hero rotating subtitle
  const rotator = document.querySelector('.rotator');
  if (rotator) {
    const items = JSON.parse(rotator.dataset.items || '[]');
    let idx = 0;
    rotator.textContent = items[0];
    setInterval(() => {
      rotator.style.opacity = '0';
      rotator.style.transform = 'translateY(8px)';
      setTimeout(() => {
        idx = (idx + 1) % items.length;
        rotator.textContent = items[idx];
        rotator.style.opacity = '1';
        rotator.style.transform = 'translateY(0)';
      }, 280);
    }, 2200);
  }

  // Word parallax scroll
  (function () {
    const zone = document.querySelector('.wp-zone');
    const panel = document.getElementById('wp-panel');
    if (!zone || !panel) return;

    function update() {
      const rect = zone.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const maxScroll = zone.offsetHeight - vh;
      const t = Math.max(0, Math.min(1, scrolled / maxScroll));

      panel.style.setProperty('--wp-a-x', (-55 + 55 * t) + 'vw');
      panel.style.setProperty('--wp-b-x', (55 - 55 * t) + 'vw');
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  // Branded scroll motion effects
  (function () {
    const splitWords = (el) => {
      if (!el || el.dataset.motionReady === 'true') return;
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach((word) => {
        const span = document.createElement('span');
        span.textContent = word;
        el.appendChild(span);
        el.appendChild(document.createTextNode(' '));
      });
      el.dataset.motionReady = 'true';
    };

    document.querySelectorAll('[data-scroll-words], [data-flyin-words]').forEach(splitWords);

    const highlightSpans = Array.from(document.querySelectorAll('[data-scroll-words] span'));
    const flySpans = Array.from(document.querySelectorAll('[data-flyin-words] span'));
    const motionCards = Array.from(document.querySelectorAll('.motion-card'));
    const splitSection = document.querySelector('.split-scroll');
    const splitStage = document.getElementById('split-stage');
    const splitTop = document.getElementById('split-top');
    const splitBottom = document.getElementById('split-bottom');
    const badge = document.getElementById('scroll-badge');
    const badgeOne = document.querySelector('.badge-bg-one');
    const badgeTwo = document.querySelector('.badge-bg-two');
    const railActive = document.getElementById('motion-rail-active');
    const railDots = [1, 2, 3].map((n) => document.getElementById(`motion-dot-${n}`)).filter(Boolean);
    const railTexts = [1, 2, 3].map((n) => document.getElementById(`motion-text-${n}`)).filter(Boolean);

    if (motionCards.length) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('visible', entry.isIntersecting);
        });
      }, { threshold: 0.16 });
      motionCards.forEach((card) => cardObserver.observe(card));
    }

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const isMobileSplit = () => window.matchMedia('(max-width: 700px)').matches;
    let ticking = false;

    function updateHighlight(vh) {
      const lines = [];
      let lastTop = null;
      let currentLine = -1;

      highlightSpans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const top = Math.round(rect.top);
        if (top !== lastTop) {
          currentLine += 1;
          lines[currentLine] = [];
          lastTop = top;
        }
        lines[currentLine].push({ span, rect });
      });

      lines.forEach((line) => {
        if (!line.length) return;
        const first = line[0].rect;
        const centerY = first.top + first.height / 2;
        const lit = centerY <= vh * 0.58;
        line.forEach(({ span }) => span.classList.toggle('is-lit', lit));
      });
    }

    function updateFlyin(vh) {
      flySpans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        span.classList.toggle('is-in', rect.bottom <= vh * 0.92);
      });
    }

    function updateSplit(vh) {
      if (!splitSection || !splitStage || !splitTop || !splitBottom) return;
      if (isMobileSplit()) {
        splitStage.style.position = '';
        splitStage.style.top = '';
        splitTop.style.transform = '';
        splitBottom.style.transform = '';
        return;
      }

      const rect = splitSection.getBoundingClientRect();
      const maxScroll = splitSection.offsetHeight - vh;
      const progress = clamp(-rect.top / maxScroll, 0, 1);

      splitTop.style.transform = `translateX(${-progress * 100}vw)`;
      splitBottom.style.transform = `translateX(${-100 + progress * 100}vw)`;

      if (rect.top <= 0 && rect.bottom >= vh) {
        splitStage.style.position = 'fixed';
        splitStage.style.top = '0';
      } else if (rect.bottom < vh) {
        splitStage.style.position = 'absolute';
        splitStage.style.top = `${splitSection.offsetHeight - splitStage.offsetHeight}px`;
      } else {
        splitStage.style.position = 'relative';
        splitStage.style.top = '0';
      }
    }

    function updateBadge(vh) {
      if (!badge || !badgeOne || !badgeTwo) return;
      const rect = badge.getBoundingClientRect();
      const middle = vh / 2;
      const center = rect.top + rect.height / 2;

      if (rect.top < vh && rect.bottom > 0) {
        const distance = Math.abs(center - middle);
        const percent = clamp(distance / middle, 0, 1);
        const x = center < middle ? 100 : 100 * (1 - percent);
        badgeOne.style.transform = `translateX(${x}%)`;
        badgeTwo.style.transform = `translateX(${x - 100}%)`;
      } else {
        badgeOne.style.transform = 'translateX(0)';
        badgeTwo.style.transform = 'translateX(-100%)';
      }
    }

    function updateRail(vh) {
      if (!railActive || railDots.length === 0) return;
      const first = railDots[0].getBoundingClientRect();
      const last = railDots[railDots.length - 1].getBoundingClientRect();
      const start = first.top + first.height / 2;
      const end = last.top + last.height / 2;
      const progress = clamp((vh * 0.5 - start) / (end - start), 0, 1);
      const y = 52 + (298 - 52) * progress;
      railActive.setAttribute('y2', String(y));

      railDots.forEach((dot, index) => {
        const dotRect = dot.getBoundingClientRect();
        const lit = dotRect.top + dotRect.height / 2 <= vh * 0.5;
        dot.classList.toggle('is-lit', lit);
        if (railTexts[index]) railTexts[index].classList.toggle('is-lit', lit);
      });
    }

    function update() {
      ticking = false;
      const vh = window.innerHeight;
      updateHighlight(vh);
      updateFlyin(vh);
      updateSplit(vh);
      updateBadge(vh);
      updateRail(vh);
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    update();
  })();

  // Form handler
  const form = document.querySelector('#quote-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.querySelector('#form-status');
      if (status) {
        status.innerHTML = '<span class="ok">✓ ENQUIRY RECEIVED</span><br>Tingi Petroleum will respond within 24 hours.';
      }
      form.reset();
    });
  }

  // Live time clock for header (industrial feel)
  const clock = document.querySelector('.live-clock');
  if (clock) {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      clock.textContent = `${hh}:${mm}:${ss} SAST`;
    };
    update();
    setInterval(update, 1000);
  }
});
