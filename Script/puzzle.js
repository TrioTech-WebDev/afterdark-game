// ============================================================
//  SHARED PUZZLE ENGINE
// ============================================================

const CHAPTERS = {
  1: {
    answer: ["candles", "calendar", "ouija-board"],
    redirect: "../Podcast-logo/full-podcast-logo.html",
    storageKey: "chapter-podcast-logo"
  },
  2: {
    answer: ["cookies", "planchette", "birthday-cake"],
    redirect: "../A-cross/full-a-cross.html",
    storageKey: "chapter-a-cross"
  },
  3: {
    answer: ["tombstone-with-lola-name", "bible", "bloody-microphone"],
    redirect: "../Female-demon/full-female-demon.html",
    storageKey: "chapter-female-demon"
  }
};

// ── CHANGED: added chapterKey to every fragment ──────────────
const ALL_FRAGMENTS = [
  { name: "candles",                  img: "../Assets/img/candles.png",                  chapterKey: "chapter-podcast-logo" },
  { name: "calendar",                 img: "../Assets/img/calendar.png",                 chapterKey: "chapter-podcast-logo" },
  { name: "ouija-board",              img: "../Assets/img/ouija-board.png",              chapterKey: "chapter-podcast-logo" },
  { name: "cookies",                  img: "../Assets/img/cookies.png",                  chapterKey: "chapter-a-cross"      },
  { name: "planchette",               img: "../Assets/img/planchette.png",               chapterKey: "chapter-a-cross"      },
  { name: "birthday-cake",            img: "../Assets/img/birthday-cake.png",            chapterKey: "chapter-a-cross"      },
  { name: "tombstone-with-lola-name", img: "../Assets/img/tombstone-with-lola-name.png", chapterKey: "chapter-female-demon" },
  { name: "bible",                    img: "../Assets/img/bible.png",                    chapterKey: "chapter-female-demon" },
  { name: "bloody-microphone",        img: "../Assets/img/bloody-microphone.png",        chapterKey: "chapter-female-demon" }
];
// ── END CHANGE ───────────────────────────────────────────────

const section    = document.querySelector("[data-chapter]");
const chapterNum = parseInt(section?.dataset.chapter);
const chapter    = CHAPTERS[chapterNum];

if (!chapter) {
  console.error("puzzle.js: no matching chapter config for data-chapter=" + chapterNum);
}

const grid = document.getElementById("grid");
let selected = [];
let tiles    = [];

const fragments = [...ALL_FRAGMENTS].sort(() => Math.random() - 0.5);

fragments.forEach(fragment => {
  const div = document.createElement("div");
  div.className = "puzzle-tile";
  div.innerHTML = `<img src="${fragment.img}" alt="${fragment.name}">`;

  // ── CHANGED: check if this fragment belongs to an already-completed chapter ──
  const isChapterDone    = localStorage.getItem(fragment.chapterKey) === "completed";
  const isCurrentChapter = fragment.chapterKey === chapter.storageKey;

  if (isChapterDone && !isCurrentChapter) {
    // Dark + unclickable — belongs to a different chapter already solved
    div.classList.add("puzzle-tile-done");
  } else {
    // Normal clickable tile
    div.onclick = () => toggle(fragment, div);
  }
  // ── END CHANGE ───────────────────────────────────────────────

  grid.appendChild(div);
  tiles.push(div);
});

function toggle(fragment, el) {
  // ── CHANGED: guard against clicking a darkened tile ─────────
  if (el.classList.contains("puzzle-tile-done")) return;
  // ── END CHANGE ───────────────────────────────────────────────

  if (!selected.includes(fragment.name) && selected.length >= 3) return;

  if (selected.includes(fragment.name)) {
    selected = selected.filter(x => x !== fragment.name);
    el.classList.remove("active");
  } else {
    selected.push(fragment.name);
    el.classList.add("active");
  }
  updateSlots();
}

function updateSlots() {
  const slots = document.querySelectorAll(".puzzle-slot");
  slots.forEach((slot, i) => {
    if (selected[i]) {
      const found = fragments.find(f => f.name === selected[i]);
      slot.innerHTML = `<img src="${found.img}" alt="${found.name}">`;
    } else {
      slot.innerHTML = "";
    }
  });
}

function checkAnswer() {
  if (selected.length !== 3) {
    alert("⚠️ Please select exactly 3 fragments.");
    return;
  }

  const correct = chapter.answer.every((name, i) => selected[i] === name);

  if (correct) {
    localStorage.setItem(chapter.storageKey, "completed");
    window.location.href = chapter.redirect;
  } else {
    alert("❌ Wrong order! Try again.");
    reset();
  }
}

function reset() {
  selected = [];
  // ── CHANGED: skip darkened tiles when resetting ──────────────
  tiles.forEach(t => {
    if (!t.classList.contains("puzzle-tile-done")) {
      t.classList.remove("active");
    }
  });
  // ── END CHANGE ───────────────────────────────────────────────
  updateSlots();
}
