// ---------- shared animation ticker ----------
// Every page-specific effect (parallax, 3D mask rotation, hero tilt)
// registers a callback here instead of listening to 'scroll' directly.
// Running everything off one rAF loop keeps motion locked to the
// display's frame rate rather than however often 'scroll' events fire,
// which is what makes the scroll-driven effects feel smooth.
window.PP = window.PP || {
  lerp: (a, b, n) => (1 - n) * a + n * b,
  _cbs: [],
  onFrame(fn) { this._cbs.push(fn); },
};
(function ppLoop() {
  for (let i = 0; i < window.PP._cbs.length; i++) window.PP._cbs[i]();
  requestAnimationFrame(ppLoop);
})();

document.addEventListener('DOMContentLoaded', () => {
  // ---------- scroll-reveal ----------
  const revealEls = document.querySelectorAll('.reveal, .card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.18 });
  revealEls.forEach(el => io.observe(el));

  // ---------- highlight the active case-file tab (desktop + mobile bar) ----------
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.case-tab').forEach(tab => {
    const href = tab.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      tab.classList.add('active');
    }
  });

  // ---------- scroll progress rail ----------
  const fill = document.getElementById('scrollProgressFill');
  if (fill) {
    PP.onFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      fill.style.width = p.toFixed(2) + '%';
    });
  }

  // ---------- card tilt on pointer, wherever .card exists ----------
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = `rotateY(0deg) rotateX(0deg) translateY(0)`;
    });
  });
});

// ---------- reusable rain generator ----------
function pigpenRain(el, count = 70) {
  if (!el) return;
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('i');
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = (0.6 + Math.random() * 0.8) + 's';
    drop.style.animationDelay = (Math.random() * 2) + 's';
    drop.style.opacity = (0.1 + Math.random() * 0.3).toString();
    el.appendChild(drop);
  }
}

// ---------- reusable ambient dot field ----------
function pigpenDots(el, count = 40) {
  if (!el) return;
  for (let i = 0; i < count; i++) {
    const d = document.createElement('i');
    d.style.left = Math.random() * 100 + '%';
    d.style.top = Math.random() * 100 + '%';
    d.style.animation = `dotPulse ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`;
    el.appendChild(d);
  }
  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes dotPulse{0%,100%{opacity:0;transform:scale(0.5);} 50%{opacity:0.9;transform:scale(1.4);}}`;
  document.head.appendChild(styleTag);
}
