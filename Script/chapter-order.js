// ============================================================
//  chapter-order.js
//  Drag & drop chapter ordering puzzle
//  Correct answer: podcast-logo → a-cross → female-demon
// ============================================================

const CHAPTERS_DATA = [
  { name: "podcast-logo", label: "Podcast Logo", img: "../Assets/img/podcast-logo1.png" },
  { name: "a-cross",      label: "A Cross",      img: "../Assets/img/a-cross.png"       },
  { name: "female-demon", label: "Female Demon", img: "../Assets/img/female-demon.png"  }
];

const CORRECT_ORDER = ["podcast-logo", "a-cross", "female-demon"];

// slots[0,1,2] = chapter name placed there, or null
let slots       = [null, null, null];
let draggedName = null;

const pool      = document.getElementById("chapterPool");
const slotsWrap = document.getElementById("orderSlots");

// ── Shuffle and build pool cards ─────────────────────────
[...CHAPTERS_DATA].sort(() => Math.random() - 0.5).forEach(ch => {
  const card = document.createElement("div");
  card.className   = "order-card puzzle-tile"; // reuse puzzle-tile styling
  card.id          = "pool-" + ch.name;
  card.draggable   = true;
  card.dataset.name = ch.name;
  card.innerHTML   = `<img src="${ch.img}" alt="${ch.label}"><span class="order-card-label">${ch.label}</span>`;

  card.addEventListener("dragstart", e => {
    draggedName = ch.name;
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });

  // Touch support
  card.addEventListener("touchstart", touchStart, { passive: true });
  card.addEventListener("touchmove",  touchMove,  { passive: false });
  card.addEventListener("touchend",   touchEnd);

  pool.appendChild(card);
});

// ── Build 3 numbered drop slots ──────────────────────────
for (let i = 0; i < 3; i++) {
  const row = document.createElement("div");
  row.className = "order-slot-row";

  const num = document.createElement("span");
  num.className   = "order-slot-number";
  num.textContent = i + 1;

  const slot = document.createElement("div");
  slot.className      = "order-slot puzzle-slot"; // reuse puzzle-slot styling
  slot.id             = "slot-" + i;
  slot.dataset.index  = i;

  slot.addEventListener("dragover",  e => { e.preventDefault(); slot.classList.add("drag-over"); });
  slot.addEventListener("dragleave", ()  => slot.classList.remove("drag-over"));
  slot.addEventListener("drop", e => {
    e.preventDefault();
    slot.classList.remove("drag-over");
    if (draggedName) placeInSlot(i, draggedName);
  });

  row.appendChild(num);
  row.appendChild(slot);
  slotsWrap.appendChild(row);
}

// ── Place chapter into a slot ─────────────────────────────
function placeInSlot(index, chName) {
  // If already in another slot, clear it
  slots.forEach((s, i) => { if (s === chName && i !== index) { slots[i] = null; renderSlot(i); } });
  // If slot has something else, return it
  if (slots[index] && slots[index] !== chName) returnCard(slots[index]);

  slots[index] = chName;
  setCardPlaced(chName, true);
  renderSlot(index);
}

// ── Render slot content ───────────────────────────────────
function renderSlot(index) {
  const slot = document.getElementById("slot-" + index);
  const name = slots[index];

  if (!name) {
    slot.innerHTML = "";
    slot.classList.remove("active");
    return;
  }

  const ch = CHAPTERS_DATA.find(c => c.name === name);
  slot.classList.add("active");
  slot.innerHTML = `
    <img src="${ch.img}" alt="${ch.label}">
    <button class="order-slot-remove" onclick="removeSlot(${index})">✕</button>
  `;

  // Re-attach drop events after innerHTML wipe
  slot.addEventListener("dragover",  e => { e.preventDefault(); slot.classList.add("drag-over"); });
  slot.addEventListener("dragleave", ()  => slot.classList.remove("drag-over"));
  slot.addEventListener("drop", e => {
    e.preventDefault();
    slot.classList.remove("drag-over");
    if (draggedName) placeInSlot(index, draggedName);
  });
}

// ── Remove from slot → back to pool ──────────────────────
function removeSlot(index) {
  const name = slots[index];
  if (!name) return;
  slots[index] = null;
  renderSlot(index);
  returnCard(name);
}

function setCardPlaced(name, placed) {
  const card = document.getElementById("pool-" + name);
  if (!card) return;
  card.draggable = !placed;
  placed ? card.classList.add("placed") : card.classList.remove("placed");
}

function returnCard(name) { setCardPlaced(name, false); }

// ── Check answer ──────────────────────────────────────────
function checkOrder() {
  if (slots.some(s => s === null)) {
    alert("⚠️ Please fill all 3 slots first.");
    return;
  }
  const correct = CORRECT_ORDER.every((name, i) => slots[i] === name);
  if (correct) {
    localStorage.setItem("chapter-order", "completed");
    showOrderSuccessPopup();
  } else {
    alert("❌ Wrong order. Think about the story timeline and try again.");
    resetOrder();
  }
}

// ── Reset ─────────────────────────────────────────────────
function resetOrder() {
  slots = [null, null, null];
  for (let i = 0; i < 3; i++) renderSlot(i);
  CHAPTERS_DATA.forEach(ch => setCardPlaced(ch.name, false));
}

// ── Success popup ─────────────────────────────────────────
function showOrderSuccessPopup() {
  injectPopupStyles(); // from home.js
  const overlay = document.createElement("div");
  overlay.className = "ep-overlay";
  overlay.innerHTML = `
    <div class="ep-box">
      <div class="ep-icon">🔓</div>
      <div class="ep-stars">⭐⭐⭐</div>
      <div class="ep-title">Order Correct!</div>
      <div class="ep-msg">
        You've pieced together the full story of LOLA.<br><br>
        The final conclusion is now unlocked.<br>
        Prepare yourself for the truth.
      </div>
      <a href="phone.html" class="ep-btn-primary">🎧 Hear the Epilogue</a>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ============================================================
//  TOUCH DRAG & DROP — mobile
// ============================================================
let touchClone   = null;
let touchChName  = null;

function touchStart(e) {
  const card = e.currentTarget;
  if (card.classList.contains("placed")) return;
  touchChName = card.dataset.name;

  const rect = card.getBoundingClientRect();
  touchClone = card.cloneNode(true);
  touchClone.style.cssText = `position:fixed;z-index:9998;pointer-events:none;width:${rect.width}px;opacity:0.85;left:${rect.left}px;top:${rect.top}px;`;
  document.body.appendChild(touchClone);
  card.classList.add("dragging");
}

function touchMove(e) {
  if (!touchClone) return;
  e.preventDefault();
  const t = e.touches[0];
  touchClone.style.left = (t.clientX - touchClone.offsetWidth  / 2) + "px";
  touchClone.style.top  = (t.clientY - touchClone.offsetHeight / 2) + "px";

  document.querySelectorAll(".order-slot").forEach(s => s.classList.remove("drag-over"));
  const el   = document.elementFromPoint(t.clientX, t.clientY);
  const slot = el?.closest(".order-slot");
  if (slot) slot.classList.add("drag-over");
}

function touchEnd(e) {
  if (!touchClone) return;
  const t    = e.changedTouches[0];
  const el   = document.elementFromPoint(t.clientX, t.clientY);
  const slot = el?.closest(".order-slot");

  touchClone.remove();
  touchClone = null;
  document.getElementById("pool-" + touchChName)?.classList.remove("dragging");
  document.querySelectorAll(".order-slot").forEach(s => s.classList.remove("drag-over"));

  if (slot && touchChName) placeInSlot(parseInt(slot.dataset.index), touchChName);
  touchChName = null;
}
