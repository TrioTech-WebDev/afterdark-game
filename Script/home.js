// ============================================================
//  home.js — Navbar + Chapter Badges + Completed Lock + Two-Stage Epilogue
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile menu ───────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose  = document.getElementById('menuClose');

  if (hamburger)  hamburger.addEventListener('click',  () => mobileMenu.style.display = 'block');
  if (menuClose)  menuClose.addEventListener('click',  () => mobileMenu.style.display = 'none');
  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.style.display = 'none');
  });

  // ── Navbar scroll effect ──────────────────────────────────
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── Chapter completion data ───────────────────────────────
  const chapterMap = [
    { key: "chapter-podcast-logo", attr: "podcast-logo" },
    { key: "chapter-a-cross",      attr: "a-cross"      },
    { key: "chapter-female-demon", attr: "female-demon" }
  ];

  // ── INDEX PAGE: Apply badges + lock completed chapter cards ──
  chapterMap.forEach(({ key, attr }) => {
    const card = document.querySelector(`[data-chapter-id="${attr}"]`);
    if (!card) return;

    if (localStorage.getItem(key) === "completed") {
      if (!card.querySelector(".chapter-done-badge")) {
        const badge = document.createElement("div");
        badge.className = "chapter-done-badge";
        badge.innerHTML = "✅ Completed";
        card.appendChild(badge);
      }
      if (!card.querySelector(".chapter-completed-overlay")) {
        const overlay = document.createElement("div");
        overlay.className = "chapter-completed-overlay";
        overlay.innerHTML = `<span class="overlay-lock">🔒</span><span class="overlay-text">Chapter Complete</span>`;
        card.appendChild(overlay);
      }
      const link = card.closest("a");
      if (link) { link.style.pointerEvents = "none"; link.style.cursor = "default"; }
    }
  });

  // ── CHAPTER PAGES: Darken fragment cards from completed chapters ──
  const fragmentGrid = document.getElementById("fragmentGrid");
  if (fragmentGrid) setTimeout(applyCompletedFragmentStyles, 50);

  // ── Progress state ────────────────────────────────────────
  const allChaptersDone = chapterMap.every(({ key }) => localStorage.getItem(key) === "completed");
  const orderDone       = localStorage.getItem("chapter-order") === "completed";
  const epilogueBtn     = document.getElementById("epilogueBtn");

  if (allChaptersDone && !orderDone) {
    // ── Stage 1: All chapters done → show "Arrange" button ──
    if (epilogueBtn) {
      epilogueBtn.style.display = "inline-block";
      epilogueBtn.href          = "Pages/chapter-order.html";
      epilogueBtn.innerHTML     = "🕯 Arrange the Chapters";
    }
    if (!sessionStorage.getItem("arrange-popup-shown")) {
      sessionStorage.setItem("arrange-popup-shown", "true");
      showArrangePopup();
    }
  }

  if (orderDone) {
    // ── Stage 2: Order solved → show "Unlock Epilogue" button ──
    if (epilogueBtn) {
      epilogueBtn.style.display = "inline-block";
      epilogueBtn.href          = "Pages/phone.html";
      epilogueBtn.innerHTML     = "🔓 Unlock the Epilogue";
    }
    if (!sessionStorage.getItem("epilogue-popup-shown")) {
      sessionStorage.setItem("epilogue-popup-shown", "true");
      showEpiloguePopup();
    }
  }

  // ── Reset button ──────────────────────────────────────────
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset all chapter progress?")) {
        chapterMap.forEach(({ key }) => localStorage.removeItem(key));
        localStorage.removeItem("chapter-order");
        sessionStorage.removeItem("arrange-popup-shown");
        sessionStorage.removeItem("epilogue-popup-shown");
        location.reload();
      }
    });
  }

});

// ── Fragment darkening on chapter pages ───────────────────
const FRAGMENT_CHAPTER_MAP = {
  "Candles":       "chapter-podcast-logo",
  "Calendar":      "chapter-podcast-logo",
  "Ouija Board":   "chapter-podcast-logo",
  "Cookies":       "chapter-a-cross",
  "Planchette":    "chapter-a-cross",
  "Birthday Cake": "chapter-a-cross",
  "Tombstone":     "chapter-female-demon",
  "Bible":         "chapter-female-demon",
  "Bloody Mic":    "chapter-female-demon"
};

function applyCompletedFragmentStyles() {
  const fragmentGrid = document.getElementById("fragmentGrid");
  if (!fragmentGrid) return;
  fragmentGrid.querySelectorAll(".fragment-card").forEach(card => {
    const titleEl = card.querySelector(".card-title");
    if (!titleEl) return;
    const chapterKey = FRAGMENT_CHAPTER_MAP[titleEl.textContent.trim()];
    if (chapterKey && localStorage.getItem(chapterKey) === "completed") {
      card.classList.add("fragment-completed");
      if (!card.querySelector(".fragment-done-stamp")) {
        const stamp = document.createElement("div");
        stamp.className = "fragment-done-stamp";
        stamp.innerHTML = "✅";
        card.appendChild(stamp);
      }
      const link = card.closest("a");
      if (link) { link.style.pointerEvents = "none"; link.style.cursor = "default"; }
    }
  });
}

// ── Shared popup styles ───────────────────────────────────
function injectPopupStyles() {
  if (document.getElementById("popup-styles")) return;
  const style = document.createElement("style");
  style.id = "popup-styles";
  style.textContent = `
    .ep-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;animation:epFadeIn 0.4s ease}
    @keyframes epFadeIn{from{opacity:0}to{opacity:1}}
    .ep-box{background:#111;border:2px solid #e9b109;border-radius:20px;padding:48px 36px;text-align:center;max-width:420px;width:90%;animation:epSlideUp 0.4s ease}
    @keyframes epSlideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
    .ep-icon{font-size:3.5rem;margin-bottom:12px}
    .ep-stars{font-size:1.4rem;letter-spacing:6px;margin-bottom:14px}
    .ep-title{color:#e9b109;font-size:1.5rem;font-weight:bold;margin-bottom:10px;font-family:'Cinzel',serif}
    .ep-msg{color:#ccc;font-size:0.95rem;line-height:1.7;margin-bottom:28px}
    .ep-btn-primary{display:block;background:#e9b109;color:#000;font-weight:bold;padding:13px 30px;border-radius:8px;text-decoration:none;font-size:1rem;margin-bottom:12px;border:none;cursor:pointer;width:100%}
    .ep-btn-primary:hover{background:#c9980a;color:#000}
    .ep-btn-secondary{display:block;background:transparent;color:#aaa;font-size:0.85rem;padding:8px 20px;border:1px solid #333;border-radius:8px;cursor:pointer;width:100%}
    .ep-btn-secondary:hover{border-color:#e9b109;color:#e9b109}
  `;
  document.head.appendChild(style);
}

// ── Stage 1 popup: Arrange the Chapters ──────────────────
function showArrangePopup() {
  injectPopupStyles();
  const overlay = document.createElement("div");
  overlay.className = "ep-overlay";
  overlay.id = "epOverlay";
  overlay.innerHTML = `
    <div class="ep-box">
      <div class="ep-icon">🕯</div>
      <div class="ep-stars">⭐⭐⭐</div>
      <div class="ep-title">All Chapters Complete!</div>
      <div class="ep-msg">
        You've uncovered all 3 chapters of the story.<br><br>
        Now arrange them in the correct order<br>
        to unlock the final conclusion.
      </div>
      <a href="Pages/chapter-order.html" class="ep-btn-primary">🕯 Arrange the Chapters</a>
      <button class="ep-btn-secondary" onclick="closeEpiloguePopup()">I'll do it later</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeEpiloguePopup(); });
}

// ── Stage 2 popup: Epilogue unlocked ─────────────────────
function showEpiloguePopup() {
  injectPopupStyles();
  const overlay = document.createElement("div");
  overlay.className = "ep-overlay";
  overlay.id = "epOverlay";
  overlay.innerHTML = `
    <div class="ep-box">
      <div class="ep-icon">🔓</div>
      <div class="ep-stars">⭐⭐⭐</div>
      <div class="ep-title">Epilogue Unlocked!</div>
      <div class="ep-msg">
        You've completed all 3 chapters and arranged the story.<br><br>
        The truth behind LOLA is finally revealed.<br>
        Are you ready to hear how it all ends?
      </div>
      <a href="Pages/phone.html" class="ep-btn-primary">🎧 Play the Epilogue</a>
      <button class="ep-btn-secondary" onclick="closeEpiloguePopup()">I'll listen later</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeEpiloguePopup(); });
}

function closeEpiloguePopup() {
  const el = document.getElementById("epOverlay");
  if (el) el.remove();
}

(function () {

  const audio       = document.getElementById("mainAudio");
  const playBtn     = document.getElementById("playBtn");
  const progressBar = document.getElementById("progressBar");
  const progressBg  = document.getElementById("progressBg");
  const audioTime   = document.getElementById("audioTime");

  // Guard — if any element missing, stop silently
  if (!audio || !playBtn || !progressBar || !progressBg || !audioTime) return;

  // ── Play / Pause ────────────────────────────────────────
  window.togglePlay = function () {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = "⏸";
    } else {
      audio.pause();
      playBtn.textContent = "▶";
    }
  };

  // ── Volume ──────────────────────────────────────────────
  window.setVolume = function (val) {
    audio.volume = parseFloat(val);
  };

  // ── Seek by clicking progress bar ───────────────────────
  window.seekAudio = function (e) {
    if (!audio.duration) return;
    const rect  = progressBg.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
  };

  // ── Format seconds → m:ss ───────────────────────────────
  function formatTime(s) {
    if (isNaN(s) || s < 0) return "0:00";
    const m   = Math.floor(s / 60);
    const sec = String(Math.floor(s % 60)).padStart(2, "0");
    return m + ":" + sec;
  }

  // ── Update progress bar and time as audio plays ─────────
  audio.addEventListener("timeupdate", function () {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = pct + "%";
    audioTime.textContent   = formatTime(audio.currentTime);
  });

  // ── Reset when audio ends ────────────────────────────────
  audio.addEventListener("ended", function () {
    playBtn.textContent     = "▶";
    progressBar.style.width = "0%";
    audioTime.textContent   = "0:00";
  });

  // ── Show duration once audio is loaded ──────────────────
  audio.addEventListener("loadedmetadata", function () {
    audioTime.textContent = formatTime(audio.duration);
  });

})();
