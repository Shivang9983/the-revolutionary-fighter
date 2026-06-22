
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


  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealTargets.forEach(el => {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

 
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

 
  const audio = document.getElementById('bgmAudio');
  const player = document.getElementById('musicPlayer');
  const playerToggle = document.getElementById('playerToggle');
  const playIcon = playerToggle.querySelector('.play-icon');
  const pauseIcon = playerToggle.querySelector('.pause-icon');
  const playerStatus = player.querySelector('.player-status');

  let hasUserInteracted = false;
  let isExplicitlyPaused = false;

  function playAudio() {
    audio.play()
      .then(() => {
        player.classList.add('playing');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        playerStatus.textContent = 'Playing';
        playerToggle.setAttribute('aria-label', 'Pause tribute music');
      })
      .catch(error => {
        console.log('Autoplay prevented by browser, waiting for user interaction:', error);
        playerStatus.textContent = 'Click to listen';
      });
  }

  function pauseAudio() {
    audio.pause();
    player.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playerStatus.textContent = 'Paused';
    playerToggle.setAttribute('aria-label', 'Play tribute music');
  }

  function toggleAudio() {
    if (audio.paused) {
      isExplicitlyPaused = false;
      playAudio();
    } else {
      isExplicitlyPaused = true;
      pauseAudio();
    }
  }

  playerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAudio();
  });

  
  playAudio();

 
  const handleFirstInteraction = () => {
    if (!hasUserInteracted) {
      hasUserInteracted = true;
      if (!isExplicitlyPaused && audio.paused) {
        playAudio();
      }
      
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    }
  };

  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);
});
