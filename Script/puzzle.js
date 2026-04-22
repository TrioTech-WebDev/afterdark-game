// ============================================================
//  puzzle.js — Shared Puzzle Engine (order-sensitive)
// ============================================================

const CHAPTERS = {
  1: {
    answer:     ['candles', 'calendar', 'ouija-board'],
    redirect:   '../Podcast-logo/full-podcast-logo.html',
    storageKey: 'chapter-podcast-logo'
  },
  2: {
    answer:     ['cookies', 'planchette', 'birthday-cake'],
    redirect:   '../A-cross/full-a-cross.html',
    storageKey: 'chapter-a-cross'
  },
  3: {
    answer:     ['tombstone', 'bible', 'bloody-microphone'],
    redirect:   '../Female-demon/full-female-demon.html',
    storageKey: 'chapter-female-demon'
  }
};

const ALL_FRAGMENTS = [
  { name: 'candles',           img: '../Assets/img/candles.png',                  chapterKey: 'chapter-podcast-logo' },
  { name: 'calendar',          img: '../Assets/img/calendar.png',                 chapterKey: 'chapter-podcast-logo' },
  { name: 'ouija-board',       img: '../Assets/img/ouija-board.png',              chapterKey: 'chapter-podcast-logo' },
  { name: 'cookies',           img: '../Assets/img/cookies.png',                  chapterKey: 'chapter-a-cross'      },
  { name: 'planchette',        img: '../Assets/img/planchette.png',               chapterKey: 'chapter-a-cross'      },
  { name: 'birthday-cake',     img: '../Assets/img/birthday-cake.png',            chapterKey: 'chapter-a-cross'      },
  { name: 'tombstone',         img: '../Assets/img/tombstone-with-lola-name.png', chapterKey: 'chapter-female-demon' },
  { name: 'bible',             img: '../Assets/img/bible.png',                    chapterKey: 'chapter-female-demon' },
  { name: 'bloody-microphone', img: '../Assets/img/bloody-microphone.png',        chapterKey: 'chapter-female-demon' }
];

// ── Init ──────────────────────────────────────────────────────
const section    = document.querySelector('[data-chapter]');
const chapterNum = parseInt(section?.dataset.chapter);
const chapter    = CHAPTERS[chapterNum];

if (!chapter) {
  console.error('puzzle.js: no chapter config for data-chapter=' + chapterNum);
}

const grid     = document.getElementById('grid');
const errorBox = document.getElementById('puzzleError');
let selected   = [];
let tiles      = [];

const fragments = [...ALL_FRAGMENTS].sort(() => Math.random() - 0.5);

// ── Build tiles ───────────────────────────────────────────────
fragments.forEach(fragment => {
  const div = document.createElement('div');
  div.className = 'puzzle-tile';
  div.innerHTML = `<img src="${fragment.img}" alt="${fragment.name}" loading="lazy">`;

  const isChapterDone    = localStorage.getItem(fragment.chapterKey) === 'completed';
  const isCurrentChapter = fragment.chapterKey === chapter.storageKey;

  if (isChapterDone && !isCurrentChapter) {
    div.classList.add('puzzle-tile-done');
  } else {
    div.addEventListener('click', () => toggle(fragment, div));
  }

  grid.appendChild(div);
  tiles.push(div);
});

// ── Toggle selection ──────────────────────────────────────────
function toggle(fragment, el) {
  if (el.classList.contains('puzzle-tile-done')) return;
  clearError();

  if (selected.includes(fragment.name)) {
    selected = selected.filter(x => x !== fragment.name);
    el.classList.remove('active');
  } else {
    if (selected.length >= 3) return;
    selected.push(fragment.name);
    el.classList.add('active');
  }
  updateSlots();
}

// ── Update answer slots ───────────────────────────────────────
function updateSlots() {
  const slots = document.querySelectorAll('.puzzle-slot');
  slots.forEach((slot, i) => {
    if (selected[i]) {
      const found = fragments.find(f => f.name === selected[i]);
      slot.innerHTML = `<img src="${found.img}" alt="${found.name}">`;
      slot.classList.add('filled');
    } else {
      slot.innerHTML = '';
      slot.classList.remove('filled');
    }
  });
}

// ── Smart error diagnosis ─────────────────────────────────────
function diagnoseError(snapshot) {
  const correctSet = chapter.answer;
  const matchCount = snapshot.filter(name => correctSet.includes(name)).length;

  if (matchCount === 0) {
    return 'None of these fragments belong to this chapter. Look more carefully.';
  }
  if (matchCount === 1) {
    return 'Only 1 fragment belongs to this chapter. The other 2 are from a different story.';
  }
  if (matchCount === 2) {
    return '2 fragments belong to this chapter, but 1 does not. Check your selection.';
  }
  if (matchCount === 3) {
    return 'All 3 fragments are correct — but the order is wrong. Listen to the audio again for clues.';
  }
  return 'Incorrect — the fragments do not match. Try again.';
}

// ── Check answer ──────────────────────────────────────────────
function checkAnswer() {
  clearError();

  if (selected.length !== 3) {
    showError('Please select exactly 3 fragments before checking.');
    return;
  }

  const correct = chapter.answer.every((name, i) => selected[i] === name);

  if (correct) {
    localStorage.setItem(chapter.storageKey, 'completed');
    // ── Flag so the reward page knows to show the success toast ──
    sessionStorage.setItem('just-solved', 'true');
    window.location.href = chapter.redirect;
  } else {
    const snapshot = [...selected];

    selected = [];
    tiles.forEach(t => {
      if (!t.classList.contains('puzzle-tile-done')) {
        t.classList.remove('active');
      }
    });
    updateSlots();

    showError(diagnoseError(snapshot));
  }
}

// ── Reset ─────────────────────────────────────────────────────
function resetSelection() {
  selected = [];
  tiles.forEach(t => {
    if (!t.classList.contains('puzzle-tile-done')) {
      t.classList.remove('active');
    }
  });
  updateSlots();
  clearError();
}

// ── Error helpers ─────────────────────────────────────────────
function showError(msg) {
  if (!errorBox) return;
  errorBox.textContent = msg;
  errorBox.classList.add('visible');
  errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearError() {
  if (!errorBox) return;
  errorBox.textContent = '';
  errorBox.classList.remove('visible');
}

// Expose for HTML onclick
window.checkAnswer    = checkAnswer;
window.resetSelection = resetSelection;