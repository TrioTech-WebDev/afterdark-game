// ============================================================
//  home.js — Navbar + Chapter Badges + Epilogue Popup
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile menu ───────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');

  if (hamburger) hamburger.addEventListener('click', () => mobileMenu.style.display = 'block');
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

  // ── Apply tick badges on chapter cards ───────────────────
  chapterMap.forEach(({ key, attr }) => {
    if (localStorage.getItem(key) === "completed") {
      const card = document.querySelector(`[data-chapter-id="${attr}"]`);
      if (card && !card.querySelector(".chapter-done-badge")) {
        const badge = document.createElement("div");
        badge.className = "chapter-done-badge";
        badge.innerHTML = "✅ Completed";
        card.appendChild(badge);
      }
    }
  });

  // ── Check if ALL 3 chapters done ─────────────────────────
  const allDone = chapterMap.every(({ key }) => localStorage.getItem(key) === "completed");

  if (allDone) {
    // Show epilogue button
    const epilogueBtn = document.getElementById("epilogueBtn");
    if (epilogueBtn) epilogueBtn.style.display = "inline-block";

    // Show popup ONLY if not already shown this session
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
        sessionStorage.removeItem("epilogue-popup-shown");
        location.reload();
      }
    });
  }

});

// ── Epilogue unlocked popup ───────────────────────────────
function showEpiloguePopup() {
  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    .ep-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: epFadeIn 0.4s ease;
    }
    @keyframes epFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .ep-box {
      background: #111;
      border: 2px solid #e9b109;
      border-radius: 20px;
      padding: 48px 36px;
      text-align: center;
      max-width: 420px;
      width: 90%;
      animation: epSlideUp 0.4s ease;
      position: relative;
    }
    @keyframes epSlideUp {
      from { transform: translateY(40px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    .ep-icon   { font-size: 3.5rem; margin-bottom: 12px; }
    .ep-title  {
      color: #e9b109;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 10px;
      font-family: 'Segoe UI', sans-serif;
    }
    .ep-msg {
      color: #ccc;
      font-size: 0.95rem;
      line-height: 1.7;
      margin-bottom: 28px;
    }
    .ep-btn-primary {
      display: inline-block;
      background: #e9b109;
      color: #000;
      font-weight: bold;
      padding: 12px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 1rem;
      margin-bottom: 12px;
      border: none;
      cursor: pointer;
      width: 100%;
    }
    .ep-btn-primary:hover { background: #c9980a; }
    .ep-btn-secondary {
      display: inline-block;
      background: transparent;
      color: #aaa;
      font-size: 0.85rem;
      padding: 8px 20px;
      border: 1px solid #333;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      text-decoration: none;
    }
    .ep-btn-secondary:hover { border-color: #e9b109; color: #e9b109; }
    .ep-stars {
      font-size: 1.4rem;
      letter-spacing: 6px;
      margin-bottom: 16px;
    }
  `;
  document.head.appendChild(style);

  // Build popup HTML
  const overlay = document.createElement("div");
  overlay.className = "ep-overlay";
  overlay.id = "epOverlay";
  overlay.innerHTML = `
    <div class="ep-box">
      <div class="ep-icon">🔓</div>
      <div class="ep-stars">⭐⭐⭐</div>
      <div class="ep-title">Epilogue Unlocked!</div>
      <div class="ep-msg">
        You've completed all 3 chapters.<br><br>
        The truth behind LOLA is finally revealed.<br>
        Are you ready to hear how it all ends?
      </div>
      <a href="epilogue.html" class="ep-btn-primary">🎧 Play the Epilogue</a>
      <button class="ep-btn-secondary" onclick="closeEpiloguePopup()">I'll listen later</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Close on overlay background click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeEpiloguePopup();
  });
}

function closeEpiloguePopup() {
  const overlay = document.getElementById("epOverlay");
  if (overlay) overlay.remove();
}
