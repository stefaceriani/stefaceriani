/* ─── ChromaShift — main.js ─────────────────────────── */

/* 1. LIVE DEMO COLOR PICKER
   Clicking a swatch recolors the fake Spotify card */
(function initDemoCard() {
  const card      = document.getElementById('demo-card');
  const swatches  = document.querySelectorAll('.picker-swatch');

  const CSS_VARS = {
    '--demo-accent':  (c) => c,
    '--demo-sidebar': (c) => hexToRgba(c, 0.12),
    '--demo-player':  (c) => hexToRgba(c, 0.18),
    '--demo-card':    (c) => hexToRgba(c, 0.2),
  };

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function applyColor(hex) {
    for (const [prop, fn] of Object.entries(CSS_VARS)) {
      card.style.setProperty(prop, fn(hex));
    }
  }

  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      applyColor(sw.dataset.color);
    });
  });

  // Start with the first swatch active
  if (swatches.length) {
    swatches[0].classList.add('active');
    applyColor(swatches[0].dataset.color);
  }
})();


/* 2. INSTALL TABS */
(function initTabs() {
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabPanels  = {
    marketplace: document.getElementById('tab-marketplace'),
    manual:      document.getElementById('tab-manual'),
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.entries(tabPanels).forEach(([key, panel]) => {
        if (key === target) panel.classList.remove('hidden');
        else panel.classList.add('hidden');
      });
    });
  });
})();


/* 3. COPY CODE BUTTONS */
(function initCopyBtns() {
  const macCode = `cp chromashift.js ~/.config/spicetify/Extensions/
spicetify config extensions chromashift.js
spicetify apply`;

  const winCode = `cp chromashift.js "$env:APPDATA\\spicetify\\Extensions\\"
spicetify config extensions chromashift.js
spicetify apply`;

  const snippets = { mac: macCode, win: winCode };

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key  = btn.dataset.code;
      const text = snippets[key] || '';
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
})();


/* 4. SCROLL-IN ANIMATIONS for feature cards */
(function initScrollReveal() {
  const cards = document.querySelectorAll('.feature-card');

  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
})();


/* 5. SMOOTH NAV ACTIVE STATE */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--text)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();
