// The red plate drifts out of register as you move across the sheet,
// the way a cheap two-colour run never quite lines up.
const plate = document.querySelector('.nameplate');

if (plate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let queued = false;

  window.addEventListener('pointermove', (e) => {
    if (queued) return;
    queued = true;

    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 .. 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      plate.style.setProperty('--mx', `${(x * 7).toFixed(2)}px`);
      plate.style.setProperty('--my', `${(y * 5).toFixed(2)}px`);
      queued = false;
    });
  }, { passive: true });
}

// 日 / 夜 — the sheet is printed twice.
const root = document.documentElement;
const edition = document.getElementById('edition');

if (edition) {
  edition.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('hkacc-theme', next); } catch (e) { /* private mode */ }
  });
}

// Follow the system until someone states a preference.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  let stored = null;
  try { stored = localStorage.getItem('hkacc-theme'); } catch (err) { /* ignore */ }
  if (!stored) root.setAttribute('data-theme', e.matches ? 'night' : 'day');
});
