// ============================================================
//  SHARED PUZZLE ENGINE — Script/puzzle.js
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

const ALL_FRAGMENTS = [
  { name: "candles",                  img: "../Assets/img/candles.png" },
  { name: "calendar",                 img: "../Assets/img/calendar.png" },
  { name: "ouija-board",              img: "../Assets/img/ouija-board.png" },
  { name: "cookies",                  img: "../Assets/img/cookies.png" },
  { name: "planchette",               img: "../Assets/img/planchette.png" },
  { name: "birthday-cake",            img: "../Assets/img/birthday-cake.png" },
  { name: "tombstone-with-lola-name", img: "../Assets/img/tombstone-with-lola-name.png" },
  { name: "bible",                    img: "../Assets/img/bible.png" },
  { name: "bloody-microphone",        img: "../Assets/img/bloody-microphone.png" }
];

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
  div.onclick = () => toggle(fragment, div);
  grid.appendChild(div);
  tiles.push(div);
});

function toggle(fragment, el) {
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
  tiles.forEach(t => t.classList.remove("active"));
  updateSlots();
}
