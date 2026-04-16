const grid = document.getElementById("grid");

let selected = [];
let tiles = [];

// 9 fragment images
const fragments = [
  { name: "candles", img: "../Assets/img/candles.png" },
  { name: "calendar", img: "../Assets/img/calendar.png" },
  { name: "ouija-board", img: "../Assets/img/ouija-board.png" },

  { name: "cookies", img: "../Assets/img/cookies.png" },
  { name: "planchette", img:"../Assets/img/planchette.png"},
  { name: "birthday-cake", img: "../Assets/img/birthday-cake.png"},

  { name: "tombstone", img: "../Assets/img/tombstone-with-lola-name.png"},
  { name: "bible", img: "../Assets/img/bible.png" },
  { name: "bloody-mic", img: "../Assets/img/bloody-microphone.png"}
];

// shuffle
fragments.sort(() => Math.random() - 0.5);

// create tiles
fragments.forEach(fragment => {
  const div = document.createElement("div");
  div.className = "puzzle-tile";

  div.innerHTML = `<img src="${fragment.img}" alt="${fragment.name}">`;

  div.onclick = () => toggle(fragment, div);

  grid.appendChild(div);
  tiles.push(div);
});

// toggle select
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

// update right slots
function updateSlots() {
  const slots = document.querySelectorAll(".puzzle-slot");

  slots.forEach((slot, i) => {
    if (selected[i]) {
      const found = fragments.find(f => f.name === selected[i]);
      slot.innerHTML = `<img src="${found.img}">`;
    } else {
      slot.innerHTML = "";
    }
  });
}

// correct order (CHAPTER 1)
const answer = ["candles", "calendar", "ouija-board"];

function checkAnswer() {
  let correct = true;

  // must match EXACT order
  for (let i = 0; i < answer.length; i++) {
    if (selected[i] !== answer[i]) {
      correct = false;
      break;
    }
  }

  // also ensure length is exactly 3
  if (selected.length !== answer.length) {
    correct = false;
  }

  if (correct) {
  alert("✅ Chapter 1 Completed!");

  // 💾 SAVE COMPLETION
  localStorage.setItem("chapter1", "completed");

  // redirect
  window.location.href = "../Podcast-logo/full-podcast-logo.html";
} else {
    alert("❌ Wrong Order! Follow the correct sequence.");
    reset();
  }
}

function reset() {
  selected = [];
  tiles.forEach(t => t.classList.remove("active"));
  updateSlots();
}

