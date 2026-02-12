/**
 * script.js — consolidated, accessible, and robust site behaviors
 *
 * - Single DOMContentLoaded initializer
 * - Hamburger (mobile nav) accessible toggling + keyboard
 * - Service modal: open from .service-btn, trap focus, ESC to close, return focus
 * - Chat modal: safe iframe handling via postMessage, parent-level "thinking" bubble
 * - Typewriter for #typewrite (respects prefers-reduced-motion)
 * - Footer year injection
 * - Defensive programming & graceful failure
 */

(() => {
  'use strict';

  /* -------------------------
     Utilities
     ------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const isReducedMotion = () => (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* focusable elements selector for trapping */
  const FOCUSABLE_SELECTORS = [
    'a[href]',
    'area[href]',
    'input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  /* -------------------------
     State & cached elements
     ------------------------- */
  let lastFocusedTrigger = null; // element that opened a modal
  let modalFocusTrap = null;     // current trap function for cleanup

  /* -------------------------
     Init (single entry point)
     ------------------------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Basic UX pieces
    safeSetYear();
    initHamburger();
    initServiceModal();
    initChatModal();
    initTypewriter();
    attachFormUX();
    heroGridDebug();
    // other initializers can be added here...
  }

  /* -------------------------
     Year injection
     ------------------------- */
  function safeSetYear() {
    try {
      const y = new Date().getFullYear();
      const el = document.getElementById('year');
      if (el) el.textContent = String(y);
    } catch (err) {
      console.warn('Year init failed', err);
    }
  }

  /* -------------------------
     Hamburger / mobile nav
     ------------------------- */
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('primary-nav');
    const navbarUl = document.getElementById('navbar');
    if (!hamburger || !navbarUl) return;

    // Toggle function
    const toggleNav = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !navbarUl.classList.contains('active');
      if (isOpen) {
        navbarUl.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.classList.add('is-active');
        // trap focus inside nav for keyboard users
        // focus first link
        const firstLink = navbarUl.querySelector('a, button');
        if (firstLink) firstLink.focus();
      } else {
        navbarUl.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-active');
        hamburger.focus();
      }
    };

    hamburger.addEventListener('click', () => toggleNav());
    hamburger.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        toggleNav();
      } else if (ev.key === 'Escape') {
        toggleNav(false);
      }
    });

    // close nav when clicking a link (mobile)
    navbarUl.addEventListener('click', (ev) => {
      if (ev.target && ev.target.matches('a')) {
        // close menu for mobile
        if (window.innerWidth <= 900) toggleNav(false);
      }
    });

    // close on resize to large screens
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        navbarUl.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -------------------------
     Service Modal (accessible)
     ------------------------- */
  function initServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (!modal) return;

    const modalCard = modal.querySelector('.modal-card');
    const closeBtn = document.getElementById('serviceModalClose');
    const form = document.getElementById('serviceModalForm');
    const modalServiceInput = document.getElementById('modal_service_input');
    const bookBtn = document.getElementById('modalBookBtn');

    // open triggers: buttons with .service-btn (buttons) — prefer data-service attr
    const openButtons = $$('.service-btn');
    openButtons.forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        lastFocusedTrigger = btn;
        const serviceName = btn.dataset.service || btn.getAttribute('aria-label') || btn.textContent.trim();
        if (modalServiceInput) modalServiceInput.value = serviceName;
        openModal(modal, modalCard);
      });
    });

    // allow service-learn anchors to prefill the modal when they are used to "learn" then request. (optional)
    $$('.service-learn').forEach(a => {
      a.addEventListener('click', (ev) => {
        // let the link act normally (it opens a page). If you prefer to open modal instead, preventDefault and open modal.
        // Optionally we could prefill; but we keep default behavior.
        // Example: set modal field for the lead capture that might come from the same page later.
        const serviceName = a.dataset.service || a.textContent.trim();
        if (modalServiceInput) modalServiceInput.value = serviceName;
      });
    });

    // close handlers
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (ev) => {
      // close when clicking backdrop (but not the modal content)
      if (ev.target === modal) closeModal(modal);
    });

    // ESC key closes
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        ev.preventDefault();
        closeModal(modal);
      }
    });

    // Book button: open calendar / scheduling — safe fallback to mailto if no external link
    if (bookBtn) {
      bookBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        // If you use a Calendly or scheduling URL, plug it here; otherwise open mailto prefilled
        const schedUrl = 'https://calendly.com/your-scheduling-link'; // <-- replace with real Calendly if desired
        // if schedUrl is placeholder, fallback to mailto
        if (schedUrl.includes('your-scheduling-link')) {
          // fallback: open mail compose with service in subject
          const subj = encodeURIComponent(`Request: ${modalServiceInput ? modalServiceInput.value : 'Service inquiry'}`);
          const body = encodeURIComponent('Hi Arash,%0A%0AI would like to schedule a 30-minute call to discuss: ' + (modalServiceInput ? modalServiceInput.value : '') + '%0A%0AThanks.');
          window.open(`mailto:anicomanesh@gmail.com?subject=${subj}&body=${body}`, '_blank', 'noopener,noreferrer');
        } else {
          window.open(schedUrl, '_blank', 'noopener,noreferrer');
        }
      });
    }

    // form submit UX: show sending and disable to avoid duplicate submissions
    if (form) {
      form.addEventListener('submit', (ev) => {
        try {
          const submitBtn = form.querySelector('button[type="submit"]');
          const msgEl = document.getElementById('modalMsg');
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
          }
          if (msgEl) msgEl.textContent = 'Sending request…';
          // allow form to submit normally (Formspree handles redirect)
          // re-enable after a short time in case of non-navigation
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Send Request';
            }
          }, 6000);
        } catch (e) {
          console.error('Form submit handler error', e);
        }
      });
    }

    /* --- focus trap helpers --- */
    function trapFocus(modalEl) {
      const focusable = Array.from(modalEl.querySelectorAll(FOCUSABLE_SELECTORS)).filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
      if (!focusable.length) return null;
      let first = focusable[0];
      let last = focusable[focusable.length - 1];

      // save existing tabindex on triggers? not necessary since we only move focus
      first.focus();

      function handleKey(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        } else if (e.key === 'Escape') {
          // Escape handled globally; redundant here but handy
          closeModal(modalEl);
        }
      }

      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }

    function openModal(modalEl, contentEl) {
      try {
        modalEl.setAttribute('aria-hidden', 'false');
        // add visible class (CSS controls display via [aria-hidden="false"] in your CSS)
        // trap focus
        modalFocusTrap = trapFocus(modalEl);
      } catch (err) {
        console.error('Failed to open modal', err);
      }
    }

    function closeModal(modalEl) {
      try {
        modalEl.setAttribute('aria-hidden', 'true');
        if (modalFocusTrap) {
          modalFocusTrap();
          modalFocusTrap = null;
        }
        // return focus to trigger
        if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
          lastFocusedTrigger.focus();
          lastFocusedTrigger = null;
        }
      } catch (err) {
        console.error('Failed to close modal', err);
      }
    }
  }

  /* -------------------------
     Chat Modal + safe iframe handling
     ------------------------- */
  function initChatModal() {
    const openBtn = document.getElementById('openChatBtn');
    const chatModal = document.getElementById('chatModal');
    const chatClose = document.getElementById('chatClose');
    const chatFrame = document.getElementById('chatFrame');
    const thinkingBubble = document.getElementById('parentThinkingBubble');

    // helper to show/hide thinking bubble
    function showThinking(on) {
      if (!thinkingBubble) return;
      thinkingBubble.setAttribute('aria-hidden', on ? 'false' : 'true');
      // CSS displays based on [aria-hidden="false"]
    }

    if (!chatModal || !openBtn || !chatClose || !chatFrame) {
      // If any piece is missing, don't error — degrade gracefully
      if (!openBtn) console.warn('Chat open button (#openChatBtn) not found');
      return;
    }

    // open chat
    openBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      chatModal.setAttribute('aria-hidden', 'false');
      // set focus to close button for keyboard users
      chatClose.focus();

      // After opening, try to request status from iframe
      try {
        // Post a status request - iframe may ignore if not supporting postMessage
        chatFrame.contentWindow.postMessage({ type: 'request-status' }, '*');
      } catch (err) {
        // Cross-origin: cannot access contentWindow? contentWindow exists but DOM access is not attempted.
        // We don't attempt contentDocument; just show parent bubble as a fallback.
        console.warn('postMessage to iframe failed (cross-origin?) — falling back to parent indicator', err);
        // Show a brief thinking indicator so users know something's happening
        showThinking(true);
        // hide after 3s as best-effort
        setTimeout(() => showThinking(false), 3000);
      }
    });

    chatClose.addEventListener('click', (ev) => {
      ev.preventDefault();
      chatModal.setAttribute('aria-hidden', 'true');
      openBtn.focus();
      showThinking(false);
    });

    // close chat on backdrop click
    chatModal.addEventListener('click', (ev) => {
      if (ev.target === chatModal) {
        chatModal.setAttribute('aria-hidden', 'true');
        openBtn.focus();
      }
    });

    // ESC to close chat modal
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && chatModal.getAttribute('aria-hidden') === 'false') {
        chatModal.setAttribute('aria-hidden', 'true');
        openBtn.focus();
        showThinking(false);
      }
    });

    // Listen for messages from iframe (postMessage)
    window.addEventListener('message', (e) => {
      try {
        if (!e || !e.data) return;
        const data = e.data;
        if (typeof data !== 'object') return;
        // accepted message types: thinking:on | thinking:off
        if (data.type === 'thinking:on') {
          showThinking(true);
        } else if (data.type === 'thinking:off') {
          showThinking(false);
        } else if (data.type === 'ready') {
          // optional: iframe indicates readiness
          showThinking(false);
        }
        // ignore other messages
      } catch (err) {
        // Be defensive: errors here shouldn't break the page
        console.error('Error handling postMessage', err);
      }
    });

    // Also attempt to request status when iframe loads (try/catch avoids cross-origin DOM attempts)
    chatFrame.addEventListener('load', () => {
      try {
        chatFrame.contentWindow.postMessage({ type: 'request-status' }, '*');
      } catch (err) {
        // ignore — cross-origin
      }
    });
  }

  /* -------------------------
     Small typewriter for #typewrite (accessible)
     ------------------------- */
  function initTypewriter() {
      const el = document.getElementById('typewrite');
      if (!el) return;
    
      // create / ensure inner container (absolute) for stable updates
      let inner = el.querySelector('.tw-inner');
      if (!inner) {
        inner = document.createElement('span');
        inner.className = 'tw-inner';
        el.appendChild(inner);
      }
    
      if (isReducedMotion()) {
        inner.textContent = 'LLMs · Agentic AI · Scalable ML Systems';
        return;
      }
    
      // words to cycle
      const words = [
    'Planning-Executor • Deterministic Core • Healthcare AI',
    'Multi-Agent Systems • Hierarchical Orchestration • Research Discovery',
    'Reactive-Deliberative Hybrid • Temporal Workflows • Enterprise Automation',
    'Neuro-Symbolic • Policy-as-Code Governance • Financial Compliance',
    'LLM Engineering • Model Optimization • RAG Augmentation • Inference Optimization'
  ];
      let wIndex = 0;
      let charIndex = 0;
      let deleting = false;
    
      const typeSpeed = 38;
      const deleteSpeed = 22;
      const holdDelay = 1400;
    
      let timer = null;
      function step() {
        const current = words[wIndex];
        if (!deleting) {
          charIndex++;
          inner.textContent = current.slice(0, charIndex);
          if (charIndex >= current.length) {
            deleting = true;
            timer = setTimeout(step, holdDelay);
            return;
          }
        } else {
          charIndex--;
          inner.textContent = current.slice(0, charIndex);
          if (charIndex <= 0) {
            deleting = false;
            wIndex = (wIndex + 1) % words.length;
          }
        }
        timer = setTimeout(step, deleting ? deleteSpeed : typeSpeed);
      }
    
      // start after tiny delay
      setTimeout(step, 500);
    
      // optional: cleanup if you re-init later (not strictly necessary here)
      // return a stop function for debug if needed
      return function stopTypewriter() {
        if (timer) clearTimeout(timer);
      };
    }


  /* -------------------------
     Form UX small attach for modal forms etc.
     ------------------------- */
  function attachFormUX() {
    // For any forms that redirect to a thanks page via _next, show a local "sending" message on submit
    const forms = $$('form');
    forms.forEach(form => {
      form.addEventListener('submit', (ev) => {
        try {
          const submit = form.querySelector('button[type="submit"], input[type="submit"]');
          if (submit) {
            submit.disabled = true;
            if (submit.tagName.toLowerCase() === 'button') {
              submit.dataset._orig = submit.textContent;
              submit.textContent = 'Sending…';
            } else {
              submit.value = 'Sending…';
            }
          }
          // allow normal submission (no AJAX)
          setTimeout(() => {
            if (submit) {
              submit.disabled = false;
              if (submit.tagName.toLowerCase() === 'button' && submit.dataset._orig) {
                submit.textContent = submit.dataset._orig;
                delete submit.dataset._orig;
              }
            }
          }, 6000);
        } catch (err) {
          console.warn('Form UX handler error', err);
        }
      }, { passive: true });
    });
  }

  /* -------------------------
     Hero grid debug helper (optional small logger)
     ------------------------- */
  /* -------------------------
   Hero grid: build SVG lines + set gradient to span full hero height
   ------------------------- */
    /* -------------------------
   Hero grid: orange dim + subtle blue layer + mask-aware gradient sizing
   ------------------------- */
    /* -------------------------
   Hero grid: improved blue visibility + mask positioned relative to hero height
   ------------------------- */
    function heroGridDebug() {
      try {
        const NS = 'http://www.w3.org/2000/svg';
        const hero = document.querySelector('#home.hero');
        if (!hero) {
          console.warn('Hero grid not present: #home.hero');
          return;
        }
    
        // ---------- tunables ----------
        const orangeSpacing = 90;   // grid density for orange lines
        const blueSpacing = 60;     // spacing for blue accent lines (larger -> sparser)
        const orangeOpacity = 0.60; // group opacity for orange lines
        const blueOpacity = 0.90;   // group opacity for blue lines (increase to make more visible)
        // fade start/end as fraction of hero height (0..1). Increase values to push fade lower.
        const fadeStartPct = 0.52;  // start fading at 65% down the hero
        const fadeEndPct   = 0.90;  // be fully transparent at 90% down the hero
        // -------------------------------
    
        let heroGrid = hero.querySelector('.hero-grid');
        let svg = hero.querySelector('.hero-grid-svg');
        let orangeGroup = svg ? svg.querySelector('g.grid-orange') : null;
        let blueGroup   = svg ? svg.querySelector('g.grid-blue')   : null;
    
        if (!svg || !orangeGroup || !blueGroup) {
          // Defensive creation if the HTML snippet wasn't added
          heroGrid = document.createElement('div');
          heroGrid.className = 'hero-grid';
          heroGrid.setAttribute('aria-hidden', 'true');
    
          svg = document.createElementNS(NS, 'svg');
          svg.setAttribute('class', 'hero-grid-svg');
          svg.setAttribute('viewBox', '0 0 1200 600');
          svg.setAttribute('preserveAspectRatio', 'none');
          svg.setAttribute('role', 'img');
          svg.setAttribute('aria-hidden', 'true');
    
          const defs = document.createElementNS(NS, 'defs');
          defs.innerHTML = `
            <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ff6b00" stop-opacity="0.78" />
              <stop offset="30%" stop-color="#ff6b00" stop-opacity="0.28" />
              <stop offset="45%" stop-color="#ff6b00" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#5fd3ff" stop-opacity="0.22" />
              <stop offset="50%" stop-color="#5fd3ff" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#5fd3ff" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="maskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop id="mask-stop-a" offset="0%" stop-color="#ffffff" stop-opacity="1" />
              <stop id="mask-stop-b" offset="55%" stop-color="#ffffff" stop-opacity="0.6" />
              <stop id="mask-stop-c" offset="85%" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <mask id="fadeMask">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#maskGradient)"></rect>
            </mask>
          `;
          svg.appendChild(defs);
    
          orangeGroup = document.createElementNS(NS, 'g');
          orangeGroup.setAttribute('class', 'grid-orange');
          orangeGroup.setAttribute('stroke', 'url(#gridGradient)');
          orangeGroup.setAttribute('fill', 'none');
          orangeGroup.setAttribute('mask', 'url(#fadeMask)');
          svg.appendChild(orangeGroup);
    
          blueGroup = document.createElementNS(NS, 'g');
          blueGroup.setAttribute('class', 'grid-blue');
          blueGroup.setAttribute('stroke', 'url(#blueGradient)');
          blueGroup.setAttribute('fill', 'none');
          blueGroup.setAttribute('mask', 'url(#fadeMask)');
          svg.appendChild(blueGroup);
    
          heroGrid.appendChild(svg);
          hero.appendChild(heroGrid);
        }
    
        function drawGrid() {
          const rect = hero.getBoundingClientRect();
          const w = Math.max(320, Math.round(rect.width));
          const h = Math.max(200, Math.round(rect.height));
    
          svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    
          // set gradients to userSpaceOnUse so y2 = hero height
          const gradOrange = svg.querySelector('#gridGradient');
          const gradBlue   = svg.querySelector('#blueGradient');
          const maskGrad   = svg.querySelector('#maskGradient');
    
          if (gradOrange) {
            gradOrange.setAttribute('gradientUnits', 'userSpaceOnUse');
            gradOrange.setAttribute('y2', String(h));
          }
          if (gradBlue) {
            gradBlue.setAttribute('gradientUnits', 'userSpaceOnUse');
            gradBlue.setAttribute('y2', String(h));
          }
          if (maskGrad) {
            maskGrad.setAttribute('gradientUnits', 'userSpaceOnUse');
            maskGrad.setAttribute('y2', String(h));
            // compute pixel positions for stops -> convert to percent for stops
            const startPx = Math.round(h * fadeStartPct);
            const endPx   = Math.round(h * fadeEndPct);
            // offsets as percentages relative to y2
            const startPct = (startPx / h) * 100;
            const endPct = (endPx / h) * 100;
            // update stop offsets for precise control
            const sA = svg.querySelector('#mask-stop-a');
            const sB = svg.querySelector('#mask-stop-b');
            const sC = svg.querySelector('#mask-stop-c');
            if (sA) sA.setAttribute('offset', '0%');
            if (sB) sB.setAttribute('offset', `${Math.max(1, Math.round(startPct))}%`);
            if (sC) sC.setAttribute('offset', `${Math.min(99, Math.round(endPct))}%`);
          }
    
          // clear old lines
          while (orangeGroup.firstChild) orangeGroup.removeChild(orangeGroup.firstChild);
          while (blueGroup.firstChild) blueGroup.removeChild(blueGroup.firstChild);
    
          // draw orange (denser)
          for (let x = 0; x <= w; x += orangeSpacing) {
            const l = document.createElementNS(NS, 'line');
            l.setAttribute('x1', String(x)); l.setAttribute('x2', String(x));
            l.setAttribute('y1', '0'); l.setAttribute('y2', String(h));
            l.setAttribute('stroke-width', '1');
            orangeGroup.appendChild(l);
          }
          for (let y = 0; y <= h; y += orangeSpacing) {
            const l = document.createElementNS(NS, 'line');
            l.setAttribute('x1', '0'); l.setAttribute('x2', String(w));
            l.setAttribute('y1', String(y)); l.setAttribute('y2', String(y));
            l.setAttribute('stroke-width', '1');
            orangeGroup.appendChild(l);
          }
    
          // draw blue (sparse accent)
          for (let x = 0; x <= w; x += blueSpacing) {
            const l = document.createElementNS(NS, 'line');
            // slight offset to avoid perfect overlap
            const ox = x + Math.floor(blueSpacing / 4);
            l.setAttribute('x1', String(ox)); l.setAttribute('x2', String(ox));
            l.setAttribute('y1', '0'); l.setAttribute('y2', String(h));
            l.setAttribute('stroke-width', '1.2');
            blueGroup.appendChild(l);
          }
          for (let y = 0; y <= h; y += blueSpacing) {
            const l = document.createElementNS(NS, 'line');
            const oy = y + Math.floor(blueSpacing / 4);
            l.setAttribute('x1', '0'); l.setAttribute('x2', String(w));
            l.setAttribute('y1', String(oy)); l.setAttribute('y2', String(oy));
            l.setAttribute('stroke-width', '1.2');
            blueGroup.appendChild(l);
          }
    
          // set group opacities (tweakable)
          orangeGroup.setAttribute('opacity', String(orangeOpacity));
          blueGroup.setAttribute('opacity', String(blueOpacity));
    
          if (heroGrid && heroGrid.style) heroGrid.style.display = 'block';
          document.documentElement.classList.add('hero-grid-ready');
        }
    
        // debounced resize
        let resizeTimer = null;
        function onResize() {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(drawGrid, 90);
        }
    
        drawGrid();
        window.removeEventListener('resize', onResize);
        window.addEventListener('resize', onResize, { passive: true });
    
        console.info('Hero grid updated — blue made visible; mask positioned relative to hero height');
      } catch (err) {
        console.error('heroGridDebug error', err);
      }
    }



 
  /* -------------------------
     Expose a few debug functions to the window (non-breaking)
     ------------------------- */
  window.__site = window.__site || {};
  window.__site.showThinking = function(on) {
    try {
      const bubble = document.getElementById('parentThinkingBubble');
      if (!bubble) return;
      bubble.setAttribute('aria-hidden', on ? 'false' : 'true');
    } catch (e) { /* ignore */ }
  };

})();




// ===== 3D TILT + SPOTLIGHT EFFECT FOR INSIGHT CARD =====
document.addEventListener('DOMContentLoaded', function() {
  const card = document.querySelector('.insight-card-combined');
  
  if (!card) return;
  
  // Only enable on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 8 degrees)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    // Apply 3D tilt
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Update spotlight position
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', percentX + '%');
    card.style.setProperty('--mouse-y', percentY + '%');
  });
  
  // Reset on mouse leave
  card.addEventListener('mouseleave', function() {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
  
  // Smooth enter
  card.addEventListener('mouseenter', function() {
    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
  });
});

// ===== 3D TILT + SPOTLIGHT EFFECT FOR PORTFOLIO CASE STUDY CARDS =====
document.addEventListener('DOMContentLoaded', function() {
  // Select all portfolio cards
  const portfolioCards = document.querySelectorAll('#portfolio .cards .card, #portfolio .portfolio-grid .card, #portfolio .big-cards .card, #portfolio .small-cards .card');
  
  // Only enable on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  portfolioCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (max 6 degrees for subtler effect)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      // Apply 3D tilt
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Update spotlight position
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', percentX + '%');
      card.style.setProperty('--mouse-y', percentY + '%');
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
    
    // Smooth enter
    card.addEventListener('mouseenter', function() {
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.3s ease';
    });
  });
});

// ===== UPDATED: 3D TILT + BRIGHT GREY SPOTLIGHT FOR PORTFOLIO CARDS =====

// ===== AGGRESSIVE CARD FIX =====
(function() {
  function fixCards() {
    // Remove all cs-image elements
    document.querySelectorAll('.cs-image').forEach(function(img) {
      img.style.display = 'none';
      img.remove();
    });
    
    // Fix card heights
    document.querySelectorAll('.cs-card').forEach(function(card) {
      card.style.height = '280px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      
      var link = card.querySelector('.cs-link');
      if (link) link.style.marginTop = 'auto';
    });
    
    // Remove duplicate subtitles
    var subtitles = document.querySelectorAll('h2, h3, p, .subtitle');
    var seen = {};
    subtitles.forEach(function(el) {
      var text = el.textContent.trim();
      if (text === 'Foundation Theory Speeds Iteration. Understand Once, Move Faster Forever') {
        if (seen[text]) {
          el.style.display = 'none';
          el.remove();
        } else {
          seen[text] = true;
        }
      }
    });
  }
  
  // Run immediately and repeatedly
  fixCards();
  setTimeout(fixCards, 100);
  setTimeout(fixCards, 500);
  setTimeout(fixCards, 1000);
  window.addEventListener('load', fixCards);
})();

/* ===== RFC Modal Functionality ===== */
(function() {
  const rfcModal = document.getElementById('rfcModal');
  const openRfcBtn = document.getElementById('openRfcModal');
  const closeRfcBtn = document.getElementById('rfcModalClose');
  const rfcForm = document.getElementById('rfcForm');
  const rfcMsg = document.getElementById('rfcModalMsg');

  if (openRfcBtn && rfcModal) {
    openRfcBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      rfcModal.setAttribute('aria-hidden', 'false');
      if (closeRfcBtn) closeRfcBtn.focus();
    });
  }

  if (closeRfcBtn && rfcModal) {
    closeRfcBtn.addEventListener('click', () => {
      rfcModal.setAttribute('aria-hidden', 'true');
      if (openRfcBtn) openRfcBtn.focus();
    });
  }

  if (rfcModal) {
    rfcModal.addEventListener('click', (ev) => {
      if (ev.target === rfcModal) {
        rfcModal.setAttribute('aria-hidden', 'true');
        if (openRfcBtn) openRfcBtn.focus();
      }
    });
  }

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && rfcModal && rfcModal.getAttribute('aria-hidden') === 'false') {
      rfcModal.setAttribute('aria-hidden', 'true');
      if (openRfcBtn) openRfcBtn.focus();
    }
  });

  if (rfcForm) {
    rfcForm.addEventListener('submit', (ev) => {
      try {
        const submitBtn = rfcForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        }
        if (rfcMsg) rfcMsg.textContent = 'Submitting your critique...';
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Submit for Peer Review';
          }
        }, 6000);
      } catch (e) {
        console.error('RFC form submission error', e);
      }
    });
  }
})();
