/* script.js — cards: NO default halo, only on hover/focus */

(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

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

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.addEventListener('DOMContentLoaded', () => {

    /* --- nav hamburger --- */
    if (hamburger && navUl) {
      hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        navUl.classList.toggle('active');
      });
      navUl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        navUl.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }));
    }

    /* --- card toggles (show more / less) --- */
    function initCardToggler(containerSelector, initial = 3) {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      const cards = Array.from(container.children);
      if (cards.length <= initial) return;
      cards.slice(initial).forEach(c => c.style.display = 'none');
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
    initCardToggler('#articles .cards', 6);
    initCardToggler('#portfolio .cards', 3);

    /* --- staggered entry: keeps timing, no visual until hover/focus --- */
    (function staggerCards() {
      const allCards = Array.from(document.querySelectorAll('.card'));
      if (!allCards.length) return;
      allCards.forEach((card, i) => {
        card.classList.remove('appear');
        const delay = 120 * i + 200;
        setTimeout(() => card.classList.add('appear'), delay);
      });
    })();

    /* --- typewriter --- */
    (function typewriter(elId, words = [], speed = 60, pause = 1600) {
      const el = document.getElementById(elId);
      if (!el) return;
      if (el.textContent.trim() === '') el.textContent = '';
      let w = 0, pos = 0, deleting = false;
      const step = () => {
        const current = words[w] || '';
        if (!deleting) {
          el.textContent = current.slice(0, pos + 1);
          pos++;
          if (pos === current.length) { deleting = true; setTimeout(step, pause); return; }
        } else {
          el.textContent = current.slice(0, pos - 1);
          pos--;
          if (pos === 0) { deleting = false; w = (w + 1) % words.length; }
        }
        setTimeout(step, deleting ? Math.max(20, speed / 1.5) : speed);
      };
      setTimeout(() => step(), 100);
    })('typewrite', [
      'LLM Engineer · Architect · Mentor',
      'Agentic AI • RAG • LLMOps',
      'Healthcare & Finance ML Systems',
    ], 45, 1500);

    /* --- modals & focus-trap helpers --- */
    let lastFocused = null;
    function trapFocus(modal) {
      const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const nodes = Array.from(modal.querySelectorAll(focusable));
      if (nodes.length === 0) return () => {};
      const first = nodes[0], last = nodes[nodes.length - 1];
      function keyListener(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        } else if (e.key === 'Escape') closeModal(modal);
      }
      document.addEventListener('keydown', keyListener);
      return () => document.removeEventListener('keydown', keyListener);
    }
    function openModal(modal) {
      if (!modal) return;
      lastFocused = document.activeElement;
      modal.setAttribute('aria-hidden', 'false');
      const input = modal.querySelector('input, button, textarea, select, [tabindex]');
      if (input) input.focus();
      const release = trapFocus(modal);
      modal._releaseFocus = release;
    }
    function closeModal(modal) {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'true');
      if (modal._releaseFocus) modal._releaseFocus();
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    /* --- service modal wiring --- */
    const serviceBtns = Array.from(document.querySelectorAll('.service-btn'));
    serviceBtns.forEach(btn => btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service') || btn.textContent.trim();
      if (modalServiceInput) modalServiceInput.value = service;
      const titleEl = $('#serviceModalTitle');
      if (titleEl) titleEl.textContent = 'Inquiry — ' + service;
      openModal(serviceModal);
    }));
    if (serviceModalClose) serviceModalClose.addEventListener('click', () => closeModal(serviceModal));
    if (serviceModal) serviceModal.addEventListener('click', e => { if (e.target === serviceModal) closeModal(serviceModal); });
    if (modalBookBtn) modalBookBtn.addEventListener('click', () => window.open('https://calendly.com/your-calendly ', '_blank', 'noopener'));
    if (serviceModalForm) {
      serviceModalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msgEl = $('#modalMsg');
        const hp = serviceModalForm.querySelector('input[name="hp_field"]')?.value || '';
        if (hp !== '') { if (msgEl) msgEl.textContent = 'Spam detected'; return; }
        if (msgEl) msgEl.textContent = 'Sending...';
        try {
          const fd = new FormData(serviceModalForm);
          const res = await fetch(serviceModalForm.action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
          if (res.ok) {
            if (msgEl) msgEl.textContent = 'Message sent — thank you!';
            serviceModalForm.reset();
            setTimeout(() => closeModal(serviceModal), 1400);
          } else {
            const j = await res.json().catch(() => ({}));
            if (msgEl) msgEl.textContent = j.error || 'Submission error';
          }
        } catch (err) {
          if (msgEl) msgEl.textContent = 'Network error — please try again later.';
        }
      });
    }

    /* --- chat modal --- */
    function openChat() { if (chatModal) { chatModal.setAttribute('aria-hidden', 'false'); try { chatFrame.contentWindow.postMessage({ type: 'request-status' }, '*'); } catch (e) {} } }
    function closeChat() { if (chatModal) chatModal.setAttribute('aria-hidden', 'true'); }
    if (openChatBtn) openChatBtn.addEventListener('click', openChat);
    if (chatClose) chatClose.addEventListener('click', closeChat);
    if (chatModal) chatModal.addEventListener('click', e => { if (e.target === chatModal) closeChat(); });
    window.addEventListener('message', (e) => {
      if (!e.data || typeof e.data.type !== 'string') return;
      if (e.data.type === 'thinking:on') { if (parentThinking) parentThinking.setAttribute('aria-hidden', 'false'); }
      else if (e.data.type === 'thinking:off') { if (parentThinking) parentThinking.setAttribute('aria-hidden', 'true'); }
      else if (e.data.type === 'chat:loaded') { if (parentThinking) parentThinking.setAttribute('aria-hidden', 'true'); }
    });
    if (chatFrame && parentThinking) {
      chatFrame.addEventListener('load', () => {
        parentThinking.setAttribute('aria-hidden', 'false');
        setTimeout(() => parentThinking.setAttribute('aria-hidden', 'true'), 2200);
      });
    }

    /* --- global ESC --- */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (serviceModal && serviceModal.getAttribute('aria-hidden') === 'false') closeModal(serviceModal);
        if (chatModal && chatModal.getAttribute('aria-hidden') === 'false') closeChat();
      }
    });

    /* --- auto-close mobile nav on wide resize --- */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && navUl && navUl.classList.contains('active')) {
        navUl.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      }
    });

  }); // end DOMContentLoaded

  if (!document.querySelector('#chatFrame')) console.warn('chatFrame not present');
  if (!document.querySelector('#serviceModalForm')) console.warn('serviceModalForm not present');

})();