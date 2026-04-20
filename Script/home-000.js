document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');

  hamburger.addEventListener('click', () => {
    mobileMenu.style.display = 'block';
  });

  menuClose.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
  });

  // Close mobile menu on link click
  const menuLinks = document.querySelectorAll('.menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
    });
  });
});

 // ── Navbar scroll effect ─────────────────────────────────
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });

  // ── Chapter completion badges + epilogue check ───────────
  const chapterMap = [
    { key: "chapter-podcast-logo",  attr: "podcast-logo" },
    { key: "chapter-a-cross",       attr: "a-cross" },
    { key: "chapter-female-demon",  attr: "female-demon" }
  ];

  chapterMap.forEach(({ key, attr }) => {
    if (localStorage.getItem(key) === "completed") {
      // Find the card by its data-chapter-id attribute
      const card = document.querySelector(`[data-chapter-id="${attr}"]`);
      if (card) {
        // Add completed overlay if not already there
        if (!card.querySelector(".chapter-done-badge")) {
          const badge = document.createElement("div");
          badge.className = "chapter-done-badge";
          badge.innerHTML = "✅ Completed";
          card.appendChild(badge);
        }
      }
    }
  });

  // Check if ALL 3 chapters are done → show epilogue button
  const allDone = chapterMap.every(({ key }) => localStorage.getItem(key) === "completed");

  if (allDone) {
    const epilogueBtn = document.getElementById("epilogueBtn");
    if (epilogueBtn) {
      epilogueBtn.style.display = "inline-block";
    }
  }

  // ── Reset button ─────────────────────────────────────────
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset all chapter progress?")) {
        chapterMap.forEach(({ key }) => localStorage.removeItem(key));
        location.reload();
      }
    });
  }


