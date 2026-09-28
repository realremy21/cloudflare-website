// One header for the homepage and Journal pages. Future logo lockup changes
// belong here so every page using the partial receives the same assets.
export function renderSiteHeader({ current = '', home = false } = {}) {
  const nav = [
    ['/', 'Home', 'home'],
    ['/blog/', 'Blog', 'blog'],
    ['/newsletter/', 'Newsletter', 'newsletter'],
    ['/contact/', 'Contact', 'contact'],
  ].map(([href, label, key]) => `<a href="${href}" class="navlink"${current === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');

  return `<header class="site-header navglass${home ? ' site-header-home' : ' site-header-journal'}" data-shared-site-header>
    <div class="site-header-inner">
      <a href="/" class="site-header-brand" aria-label="Mile High Solar Care home">
        <picture class="site-header-logo">
          <img src="/images/newsletter/issue-1/mhsc-logo-official-email-centered.png" alt="" width="565" height="523" decoding="async">
        </picture>
        <span>Mile High Solar Care</span>
      </a>
      <nav class="desktop-nav site-nav" aria-label="Main navigation">${nav}</nav>
      <div class="header-ctas desktop-ctas">
        <a href="tel:+19706995484" class="cta-btn cta-secondary" data-lead-event="click_call" data-lead-label="header_call">Call</a>
        <a href="/#contact" class="cta-btn cta-primary" data-lead-event="click_quote_cta" data-lead-label="header_quote">Start Quote</a>
      </div>
      <button class="mobile-menu-toggle mobile-menu-button" type="button" aria-label="Open menu" aria-controls="mobileNav" aria-expanded="false">
        <span class="line line-1" aria-hidden="true"></span><span class="line line-2" aria-hidden="true"></span><span class="line line-3" aria-hidden="true"></span>
      </button>
      <div class="mobile-nav mobile-menu-overlay" id="mobileNav"></div>
    </div>
  </header>`;
}
