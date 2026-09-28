(() => {
  const header = document.querySelector('[data-shared-site-header]');
  if (!header) return;
  const toggle = header.querySelector('.mobile-menu-toggle');
  const overlay = header.querySelector('#mobileNav');
  const nav = header.querySelector('.desktop-nav');
  const ctas = header.querySelector('.desktop-ctas');
  const row = header.querySelector('.site-header-inner');
  const mq = window.matchMedia('(max-width: 768px)');
  if (!toggle || !overlay || !nav || !ctas || !row) return;

  function setOpen(open) {
    header.classList.toggle('is-mobile-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  function sync() {
    setOpen(false);
    if (mq.matches) {
      overlay.append(nav, ctas);
    } else {
      row.insertBefore(nav, toggle);
      row.insertBefore(ctas, toggle);
    }
  }
  toggle.addEventListener('click', () => { if (mq.matches) setOpen(!header.classList.contains('is-mobile-open')); });
  overlay.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  mq.addEventListener?.('change', sync);
  sync();
})();
