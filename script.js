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

// 日 / 夜 — the sheet is printed twice, favicon included.
const root = document.documentElement;
const edition = document.getElementById('edition');
const iconLink = document.querySelector('link[rel="icon"]');

const STOCK = {
  day:   { bg: '#ece5d5', ink: '#d13b26' },
  night: { bg: '#0a0d0c', ink: '#35e0a4' }
};

function stampFavicon(theme) {
  if (!iconLink) return;
  const { bg, ink } = STOCK[theme] || STOCK.day;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    glyph(bg, ink) +
    `</svg>`;
  iconLink.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(svg));
}

function glyph(bg, ink) {
  return `<rect width="100" height="100" fill="${bg}"/>` +
    `<text x="50" y="68" text-anchor="middle" font-size="44" font-weight="900"` +
    ` font-family="Noto Serif TC, PingFang TC, serif" fill="${ink}">港藝</text>`;
}

function setTheme(theme, remember) {
  root.setAttribute('data-theme', theme);
  stampFavicon(theme);
  if (remember) {
    try { localStorage.setItem('hkacc-theme', theme); } catch (e) { /* private mode */ }
  }
}

stampFavicon(root.getAttribute('data-theme') || 'day');

if (edition) {
  edition.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'night' ? 'day' : 'night', true);
  });
}

// Follow the system until someone states a preference.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  let stored = null;
  try { stored = localStorage.getItem('hkacc-theme'); } catch (err) { /* ignore */ }
  if (!stored) setTheme(e.matches ? 'night' : 'day', false);
});

// Tiles turn over. Hover and keyboard focus handle themselves in CSS;
// touch has neither, so a tap latches the turn.
for (const tile of document.querySelectorAll('.tile')) {
  tile.addEventListener('click', () => {
    tile.dataset.turned = tile.dataset.turned === 'true' ? 'false' : 'true';
  });
}
