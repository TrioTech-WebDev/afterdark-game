
// ============================================================
//  home.js — Navbar + Completion Logic + Mini Toast Popups
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile menu ─────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose  = document.getElementById('menuClose');

  if (hamburger)  hamburger.addEventListener('click',  () => mobileMenu.classList.add('open'));
  if (menuClose)  menuClose.addEventListener('click',  () => mobileMenu.classList.remove('open'));
  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ── Navbar scroll ────────────────────────────────────────
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── Chapter config ───────────────────────────────────────
  const chapterMap = [
    { key: 'chapter-podcast-logo', attr: 'podcast-logo' },
    { key: 'chapter-a-cross',      attr: 'a-cross'      },
    { key: 'chapter-female-demon', attr: 'female-demon' }
  ];

  // ── INDEX: badges + overlays on chapter cards ────────────
  chapterMap.forEach(({ key, attr }) => {
    const card = document.querySelector(`[data-chapter-id="${attr}"]`);
    if (!card) return;

    if (localStorage.getItem(key) === 'completed') {
      if (!card.querySelector('.chapter-done-badge')) {
        const badge = document.createElement('div');
        badge.className = 'chapter-done-badge';
        badge.textContent = 'Completed';
        card.appendChild(badge);
      }
      if (!card.querySelector('.chapter-completed-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'chapter-completed-overlay';
        overlay.innerHTML = `<span class="overlay-text">Chapter Complete</span>`;
        card.appendChild(overlay);
      }
      const link = card.closest('a');
      if (link) { link.style.pointerEvents = 'none'; link.style.cursor = 'default'; }
    }
  });

  // ── CHAPTER PAGES: darken completed fragments ─────────────
  if (document.getElementById('fragmentGrid')) {
    setTimeout(applyCompletedFragmentStyles, 50);
  }

  // ── Progress state ────────────────────────────────────────
  const allDone    = chapterMap.every(({ key }) => localStorage.getItem(key) === 'completed');
  const orderDone  = localStorage.getItem('chapter-order') === 'completed';
  const epilogDone = localStorage.getItem('epilogue-done') === 'completed';
  const epilogueBtn = document.getElementById('epilogueBtn');

  if (allDone && !orderDone && epilogueBtn) {
    epilogueBtn.style.display = 'inline-block';
    epilogueBtn.href          = 'Pages/chapter-order.html';
    epilogueBtn.textContent   = 'Arrange the Chapters';
    if (!sessionStorage.getItem('arrange-popup-shown')) {
      sessionStorage.setItem('arrange-popup-shown', 'true');
      showToast({
        title: 'All Chapters Complete!',
        msg: 'Now arrange them in the correct order.',
        btnLabel: 'Arrange Chapters',
        btnHref: 'Pages/chapter-order.html'
      });
    }
  }

  if (orderDone && !epilogDone && epilogueBtn) {
    epilogueBtn.style.display = 'inline-block';
    epilogueBtn.href          = 'Pages/phone.html';
    epilogueBtn.textContent   = 'Unlock the Epilogue';
    if (!sessionStorage.getItem('epilogue-popup-shown')) {
      sessionStorage.setItem('epilogue-popup-shown', 'true');
      showToast({
        title: 'Epilogue Unlocked!',
        msg: 'The truth behind LOLA awaits.',
        btnLabel: 'Play Epilogue',
        btnHref: 'Pages/phone.html'
      });
    }
  }

  if (epilogDone && epilogueBtn) {
    epilogueBtn.style.display = 'inline-block';
    epilogueBtn.href          = 'Pages/full-story.html';
    epilogueBtn.textContent   = 'Play the Full Story';
    if (!sessionStorage.getItem('fullstory-popup-shown')) {
      sessionStorage.setItem('fullstory-popup-shown', 'true');
      showToast({
        title: 'Full Story Unlocked!',
        msg: 'Listen to the complete Round Table After Dark.',
        btnLabel: 'Play Full Story',
        btnHref: 'Pages/full-story.html'
      });
    }
  }

  // ── Reset ─────────────────────────────────────────────────
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all chapter progress?')) {
        chapterMap.forEach(({ key }) => localStorage.removeItem(key));
        localStorage.removeItem('chapter-order');
        localStorage.removeItem('epilogue-done');
        sessionStorage.clear();
        location.reload();
      }
    });
  }

});

// ── Fragment darkening ────────────────────────────────────────
const FRAGMENT_CHAPTER_MAP = {
  'Candles':       'chapter-podcast-logo',
  'Calendar':      'chapter-podcast-logo',
  'Ouija Board':   'chapter-podcast-logo',
  'Cookies':       'chapter-a-cross',
  'Planchette':    'chapter-a-cross',
  'Birthday Cake': 'chapter-a-cross',
  'Tombstone':     'chapter-female-demon',
  'Bible':         'chapter-female-demon',
  'Bloody Mic':    'chapter-female-demon'
};

function applyCompletedFragmentStyles() {
  const grid = document.getElementById('fragmentGrid');
  if (!grid) return;
  grid.querySelectorAll('.fragment-card').forEach(card => {
    const titleEl = card.querySelector('.card-title');
    if (!titleEl) return;
    const key = FRAGMENT_CHAPTER_MAP[titleEl.textContent.trim()];
    if (key && localStorage.getItem(key) === 'completed') {
      card.classList.add('fragment-completed');
      if (!card.querySelector('.fragment-done-stamp')) {
        const stamp = document.createElement('div');
        stamp.className = 'fragment-done-stamp';
        stamp.textContent = '✓';
        card.appendChild(stamp);
      }
      const link = card.closest('a');
      if (link) { link.style.pointerEvents = 'none'; link.style.cursor = 'default'; }
    }
  });
}

// ── Mini toast popup ──────────────────────────────────────────
function showToast({ title, msg, btnLabel, btnHref }) {
  const old = document.getElementById('adToast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'ad-toast';
  toast.id = 'adToast';
  toast.innerHTML = `
    <div class="ad-toast-title">${title}</div>
    <div class="ad-toast-msg">${msg}</div>
    <a href="${btnHref}" class="ad-toast-btn">${btnLabel}</a>
    <button class="ad-toast-dismiss" onclick="dismissToast()">Dismiss</button>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => dismissToast(), 8000);
}

function dismissToast() {
  const toast = document.getElementById('adToast');
  if (!toast) return;
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 400);
}

// ── Audio Player ──────────────────────────────────────────────
(function () {
  const audio       = document.getElementById('mainAudio');
  const playBtn     = document.getElementById('playBtn');
  const progressBar = document.getElementById('progressBar');
  const progressBg  = document.getElementById('progressBg');
  const audioTime   = document.getElementById('audioTime');

  if (!audio || !playBtn || !progressBar || !progressBg || !audioTime) return;

  // ── Helpers to swap play/pause SVG icons ──────────────────
  function showPlay() {
    const pi = document.getElementById('playIcon');
    const pa = document.getElementById('pauseIcon');
    if (pi) pi.style.display = '';
    if (pa) pa.style.display = 'none';
  }

  function showPause() {
    const pi = document.getElementById('playIcon');
    const pa = document.getElementById('pauseIcon');
    if (pi) pi.style.display = 'none';
    if (pa) pa.style.display = '';
  }

  // ── Controls ──────────────────────────────────────────────
  window.togglePlay = function () {
    if (audio.paused) {
      audio.play();
      showPause();
    } else {
      audio.pause();
      showPlay();
    }
  };

  window.stopAudio = function () {
    audio.pause();
    audio.currentTime = 0;
    showPlay();
    progressBar.style.width = '0%';
    audioTime.textContent   = '0:00';
  };

  window.replayAudio = function () {
    audio.currentTime = 0;
    audio.play();
    showPause();
  };

  window.setVolume = function (val) {
    audio.volume = parseFloat(val);
  };

  window.seekAudio = function (e) {
    if (!audio.duration) return;
    const rect  = progressBg.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
  };

  // ── Time formatting ───────────────────────────────────────
  function formatTime(s) {
    if (isNaN(s) || s < 0) return '0:00';
    const m   = Math.floor(s / 60);
    const sec = String(Math.floor(s % 60)).padStart(2, '0');
    return m + ':' + sec;
  }

  // ── Events ───────────────────────────────────────────────
  audio.addEventListener('timeupdate', function () {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = pct + '%';
    audioTime.textContent   = formatTime(audio.currentTime);
  });

  audio.addEventListener('ended', function () {
    showPlay();
    progressBar.style.width = '0%';
    audioTime.textContent   = '0:00';
  });

  audio.addEventListener('loadedmetadata', function () {
    audioTime.textContent = formatTime(audio.duration);
  });
})();

// ── QR Scanner ────────────────────────────────────────────────
let qrStream   = null;
let qrInterval = null;

window.openQrScanner = function () {
  const modal = document.getElementById('qrModal');
  if (!modal) return;
  modal.style.display = 'flex';

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      qrStream = stream;
      const video = document.getElementById('qrVideo');
      video.srcObject = stream;
      video.setAttribute('playsinline', true);
      video.play();
      qrInterval = setInterval(() => scanFrame(video), 400);
    })
    .catch(() => {
      document.getElementById('qrStatus').textContent = 'Camera access denied.';
    });
};

window.closeQrScanner = function () {
  clearInterval(qrInterval);
  if (qrStream) { qrStream.getTracks().forEach(t => t.stop()); qrStream = null; }
  const modal = document.getElementById('qrModal');
  if (modal) modal.style.display = 'none';
};

function scanFrame(video) {
  if (video.readyState !== video.HAVE_ENOUGH_DATA) return;
  const canvas = document.getElementById('qrCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (typeof jsQR === 'undefined') {
    document.getElementById('qrStatus').textContent = 'QR library not loaded.';
    return;
  }
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (code && code.data) {
    closeQrScanner();
    try {
      const url = new URL(code.data);
      window.location.href = url.href;
    } catch {
      document.getElementById('qrStatus').textContent = 'Invalid QR code.';
    }
  }
}
// ── Mobile video autoplay fix ─────────────────────────────────
(function () {
  const vid = document.querySelector('.video-wrap video');
  if (!vid) return;

  // Try to play immediately
  const tryPlay = () => vid.play().catch(() => {});
  tryPlay();

  // Also try on first user interaction (iOS Safari requires this)
  const unlockOnTouch = () => {
    tryPlay();
    document.removeEventListener('touchstart', unlockOnTouch);
    document.removeEventListener('touchend',   unlockOnTouch);
  };
  document.addEventListener('touchstart', unlockOnTouch, { passive: true });
  document.addEventListener('touchend',   unlockOnTouch, { passive: true });
})();