// ---------- scroll-reveal, used on every page ----------
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal, .card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.18 });
  revealEls.forEach(el => io.observe(el));

  // ---------- highlight the active case-file tab ----------
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.case-tab').forEach(tab => {
    const href = tab.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      tab.classList.add('active');
    }
  });

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
