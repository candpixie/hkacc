// Reveal sections as they come into view.
const reveal = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'none';
      reveal.unobserve(entry.target);
    }
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (motionOK) {
  for (const el of document.querySelectorAll('.section, .card, .event')) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .7s ease, transform .7s ease';
    reveal.observe(el);
  }
}
