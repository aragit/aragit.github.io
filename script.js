/* script.js — consolidated frontend behaviour (vanilla JS) */
(() => {
  // Utilities
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // DOM elements
  const yearEl = $('#year');
  const hamburger = $('#hamburger');
  const navUl = document.querySelector('nav.nav ul');
  const openChatBtn = $('#openChatBtn');
  const chatModal = $('#chatModal');
  const chatFrame = $('#chatFrame');
  const chatClose = $('#chatClose');
  const parentThinking = $('#parentThinkingBubble');
  const serviceModal = $('#serviceModal');
  const serviceModalForm = $('#serviceModalForm');
  const serviceModalClose = $('#serviceModalClose');
  const modalBookBtn = $('#modalBookBtn');
  const modalServiceInput = $('#modal_service_input');
  const serviceBtns = $$('.service-btn');
  const phoneBtn = $('#phoneRevealBtn');
  const phonePopover = $('#phonePopover');

  // Set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------
     Hamburger / responsive nav
     -------------------- */
  if (hamburger && navUl) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      navUl.classList.toggle('active');
    });
    // close nav on link click (mobile)
    navUl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navUl.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }));
  }

  /* --------------------
     Unified "show more" toggles for cards (articles/portfolio)
     -------------------- */
  function initCardToggler(containerSelector, initial = 3) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const cards = Array.from(container.children);
    if (cards.length <= initial) return;
    // hide extras
    cards.slice(initial).forEach(c => c.style.display = 'none');
    // create toggle link
    const toggle = document.createElement('a');
    toggle.href = '#';
    toggle.className = 'toggle-more';
    toggle.style.cssText = 'display:block;text-align:center;margin:2rem auto;color:#aaa;text-decoration:underline';
    toggle.innerHTML = '<i class="fas fa-chevron-circle-down" style="margin-right:.3rem"></i>More';
    container.after(toggle);
    let expanded = false;
    toggle.addEventListener('click', e => {
      e.preventDefault();
      expanded = !expanded;
      cards.slice(initial).forEach(c => c.style.display = expanded ? '' : 'none');
      toggle.innerHTML = expanded
        ? '<i class="fas fa-chevron-up" style="margin-right:.3rem"></i>Show Less'
        : '<i class="fas fa-chevron-circle-down" style="margin-right:.3rem"></i>More';
    });
  }
  initCardToggler('#articles .cards', 6); // show 6 initially on articles
  initCardToggler('#portfolio .cards', 3);

  /* --------------------
     Modal: open, close, focus trap, accessible
     -------------------- */
  let lastFocused = null;
  function trapFocus(modal) {
    const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(modal.querySelectorAll(focusable));
    if (nodes.length === 0) return () => {};
    const first = nodes[0], last = nodes[nodes.length - 1];
    function keyListener(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === 'Escape') {
        closeModal(modal);
      }
    }
    document.addEventListener('keydown', keyListener);
    return () => document.removeEventListener('keydown', keyListener);
  }

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    // focus first focusable
    const input = modal.querySelector('input, button, textarea, select, [tabindex]');
    if (input) input.focus();
    // trap focus
    const release = trapFocus(modal);
    modal._releaseFocus = release;
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    if (modal._releaseFocus) modal._releaseFocus();
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // Service buttons open modal & set service name
  serviceBtns.forEach(btn => btn.addEventListener('click', (e) => {
    const service = btn.getAttribute('data-service') || btn.textContent.trim();
    modalServiceInput.value = service;
    $('#serviceModalTitle').textContent = 'Inquiry — ' + service;
    openModal(serviceModal);
  }));
  // modal close handlers
  if (serviceModalClose) serviceModalClose.addEventListener('click', () => closeModal(serviceModal));
  if (serviceModal) serviceModal.addEventListener('click', e => { if (e.target === serviceModal) closeModal(serviceModal); });

  // Book button (Calendly placeholder)
  if (modalBookBtn) modalBookBtn.addEventListener('click', () => {
    window.open('https://calendly.com/your-calendly', '_blank', 'noopener');
  });

  // Formspree AJAX submit (non-blocking)
  if (serviceModalForm) {
    serviceModalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msgEl = $('#modalMsg');
      const hp = serviceModalForm.querySelector('input[name="hp_field"]').value;
      if (hp !== '') { msgEl.textContent = 'Spam detected'; return; }
      msgEl.textContent = 'Sending...';
      try {
        const fd = new FormData(serviceModalForm);
        const res = await fetch(serviceModalForm.action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          msgEl.textContent = 'Message sent — thank you!';
          serviceModalForm.reset();
          setTimeout(() => closeModal(serviceModal), 1400);
        } else {
          const j = await res.json().catch(() => ({}));
          msgEl.textContent = j.error || 'Submission error';
        }
      } catch (err) {
        msgEl.textContent = 'Network error — please try again later.';
      }
    });
  }

  /* --------------------
     Chat modal: open/close + safe postMessage handling
     -------------------- */
  function openChat() {
    chatModal.setAttribute('aria-hidden', 'false');
    // request status from iframe (non-blocking). If iframe is cross-origin, this won't throw.
    try { chatFrame.contentWindow.postMessage({ type: 'request-status' }, '*'); } catch (e) {}
  }
  function closeChat() {
    chatModal.setAttribute('aria-hidden', 'true');
  }
  if (openChatBtn) openChatBtn.addEventListener('click', openChat);
  if (chatClose) chatClose.addEventListener('click', closeChat);
  // also close by clicking overlay
  if (chatModal) chatModal.addEventListener('click', e => { if (e.target === chatModal) closeChat(); });

  // Listen for messages from iframe. Only handle known types.
  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data.type !== 'string') return;
    if (e.data.type === 'thinking:on') {
      parentThinking.setAttribute('aria-hidden', 'false');
    } else if (e.data.type === 'thinking:off') {
      parentThinking.setAttribute('aria-hidden', 'true');
    } else if (e.data.type === 'chat:loaded') {
      // hide thinking indicator if chat reports loaded
      parentThinking.setAttribute('aria-hidden', 'true');
    }
  });

  /* If iframe doesn't send messages, fallback: show local "loading" bubble for a couple seconds */
  chatFrame.addEventListener('load', () => {
    parentThinking.setAttribute('aria-hidden', 'false');
    setTimeout(() => parentThinking.setAttribute('aria-hidden', 'true'), 2200);
  });

  /* --------------------
     Phone reveal (inline popover instead of alert)
     -------------------- */
  if (phoneBtn && phonePopover) {
    phoneBtn.addEventListener('click', () => {
      const shown = phonePopover.getAttribute('aria-hidden') === 'false';
      phonePopover.setAttribute('aria-hidden', String(!shown));
      phonePopover.style.display = shown ? 'none' : 'block';
    });
  }

  /* --------------------
     Typewriter small helper (rotating roles)
     -------------------- */
  (function typewriter(elId, words = [], speed = 60, pause = 1800) {
    const el = document.getElementById(elId);
    if (!el || !words.length) return;
    let w = 0, pos = 0, deleting = false;
    const step = () => {
      const current = words[w];
      if (!deleting) {
        el.textContent = current.slice(0, pos + 1);
        pos++;
        if (pos === current.length) {
          deleting = true;
          setTimeout(step, pause);
          return;
        }
      } else {
        el.textContent = current.slice(0, pos - 1);
        pos--;
        if (pos === 0) { deleting = false; w = (w + 1) % words.length; }
      }
      setTimeout(step, deleting ? speed / 1.5 : speed);
    };
    step();
  })('typewrite', [
    'LLM Engineer · Architect · Mentor',
    'Agentic AI • RAG • LLMOps',
    'Healthcare & Finance ML Systems',
  ], 45, 1600);

  /* --------------------
     Small accessibility: close modal on 'Escape' globally
     -------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key
