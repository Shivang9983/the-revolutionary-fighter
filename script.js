



document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll('.panel-inner, .closing-inner');

  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  revealTargets.forEach(el => observer.observe(el));

  // Respect reduced motion preference: skip animated reveal, just show content
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealTargets.forEach(el => {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // In-page PDF reader: opens the selected essay in an overlay instead of leaving the page
  const overlay = document.getElementById('readerOverlay');
  const frame = document.getElementById('readerFrame');
  const titleEl = document.getElementById('readerTitle');
  const closeBtn = document.getElementById('readerClose');

  function openReader(pdfPath, title) {
    frame.src = pdfPath;
    titleEl.textContent = title || 'Reading';
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeReader() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    frame.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openReader(btn.dataset.pdf, btn.dataset.title);
    });
  });

  closeBtn.addEventListener('click', closeReader);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeReader();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeReader();
  });
});