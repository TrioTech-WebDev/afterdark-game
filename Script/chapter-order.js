// ============================================================
//  chapter-order.js — Click-to-select chapter ordering
//  Same interaction pattern as puzzle.js (no drag and drop)
// ============================================================

const CORRECT_ORDER = ['podcast-logo', 'a-cross', 'female-demon'];

const CHAPTERS_DATA = [
  { key: 'podcast-logo', img: '../Assets/img/podcast-logo.png', label: 'Podcast Logo' },
  { key: 'a-cross',      img: '../Assets/img/a-cross.png',       label: 'A Cross'      },
  { key: 'female-demon', img: '../Assets/img/female-demon.png',  label: 'Female Demon' }
];

// Shuffle so order isn't obvious
const shuffled = [...CHAPTERS_DATA].sort(() => Math.random() - 0.5);

let selected  = [];
let poolTiles = [];

const errorBox = document.getElementById('orderError');
const pool     = document.getElementById('orderPool');

// ── Build clickable pool cards ────────────────────────────────
shuffled.forEach(ch => {
  const div = document.createElement('div');
  div.className = 'puzzle-tile order-card';
  div.dataset.chapter = ch.key;
  div.innerHTML = `
    <img src="${ch.img}" alt="${ch.label}" loading="lazy">
    <span class="order-card-label">${ch.label}</span>
  `;
  div.addEventListener('click', () => toggleChapter(ch, div));
  pool.appendChild(div);
  poolTiles.push(div);
});

// ── Toggle select ─────────────────────────────────────────────
function toggleChapter(ch, el) {
  clearError();

  if (selected.includes(ch.key)) {
    selected = selected.filter(k => k !== ch.key);
    el.classList.remove('active');
  } else {
    if (selected.length >= 3) return;
    selected.push(ch.key);
    el.classList.add('active');
  }
  updateOrderSlots();
}

// ── Sync slots with selected array ───────────────────────────
function updateOrderSlots() {
  const slots = document.querySelectorAll('.order-slot');
  slots.forEach((slot, i) => {
    if (selected[i]) {
      const ch = CHAPTERS_DATA.find(c => c.key === selected[i]);
      slot.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;gap:4px;pointer-events:none;">
          <img src="${ch.img}" alt="${ch.label}" style="width:58%;height:58%;object-fit:contain;">
          <span style="font-family:'Cinzel',serif;font-size:0.52rem;color:#e9b109;letter-spacing:0.04em;text-align:center;line-height:1.2;">${ch.label}</span>
        </div>
        <button class="order-slot-remove" onclick="removeFromSlot(${i})">&times;</button>
      `;
      slot.classList.add('filled');
    } else {
      slot.innerHTML = '';
      slot.classList.remove('filled');
    }
  });
}

// ── Remove from slot by clicking x ───────────────────────────
function removeFromSlot(idx) {
  const key = selected[idx];
  if (!key) return;

  selected.splice(idx, 1);

  const card = pool.querySelector(`[data-chapter="${key}"]`);
  if (card) card.classList.remove('active');

  updateOrderSlots();
  clearError();
}

// ── Check order ───────────────────────────────────────────────
function checkOrder() {
  clearError();

  if (selected.length !== 3) {
    showError('Please select all 3 chapters before checking.');
    return;
  }

  const correct = CORRECT_ORDER.every((key, i) => selected[i] === key);

  if (correct) {
    localStorage.setItem('chapter-order', 'completed');
    showSuccessToast();
  } else {
    // Reset tiles/slots inline — no clearError call
    selected = [];
    poolTiles.forEach(t => t.classList.remove('active'));
    updateOrderSlots();
    // Show error AFTER reset so it isn't wiped
    showError('That order is not quite right. Listen to the chapter audios again for clues.');
  }
}

// ── Full reset (button click) ─────────────────────────────────
function resetOrder() {
  selected = [];
  poolTiles.forEach(t => t.classList.remove('active'));
  updateOrderSlots();
  clearError();
}

// ── Error helpers ─────────────────────────────────────────────
function showError(msg) {
  if (!errorBox) return;
  errorBox.textContent = msg;
  errorBox.classList.add('visible');
  // ── Auto-scroll to error so user sees it immediately ──
  errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearError() {
  if (!errorBox) return;
  errorBox.textContent = '';
  errorBox.classList.remove('visible');
}

// ── Success toast ─────────────────────────────────────────────
function showSuccessToast() {
  const old = document.getElementById('adToast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'ad-toast';
  toast.id = 'adToast';
  toast.innerHTML = `
    <div class="ad-toast-title">Order Correct!</div>
    <div class="ad-toast-msg">The chapters are aligned. The epilogue awaits.</div>
    <a href="phone.html" class="ad-toast-btn">Unlock the Epilogue</a>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
}

window.checkOrder     = checkOrder;
window.resetOrder     = resetOrder;
window.removeFromSlot = removeFromSlot;