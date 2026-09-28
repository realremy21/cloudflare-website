// One header for the homepage, services, blog, contact, and Journal pages.
export function renderSiteHeader({ current = '', home = false, quoteHref = '/#contact', quoteLabel = 'Start Quote' } = {}) {
  const nav = [
    ['/', 'Home', 'home'],
    ['/blog/', 'Blog', 'blog'],
    ['/newsletter/', 'Newsletter', 'newsletter'],
    ['/contact/', 'Contact', 'contact'],
  ].map(([href, label, key]) => `<a href="${href}" class="navlink"${current === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');

  return `<header class="site-header navglass${home ? ' site-header-home' : ' site-header-journal'}" data-shared-site-header>
    <div class="site-header-inner">
      <a href="/" class="site-header-brand" aria-label="Mile High Solar Care home">
        <img class="site-header-logo" src="/images/mhsc-logo-official-header.png" alt="" width="771" height="162" decoding="async" fetchpriority="high">
      </a>
      <nav class="desktop-nav site-nav" aria-label="Main navigation">${nav}</nav>
      <div class="header-ctas desktop-ctas">
        <a href="tel:+19706995484" class="cta-btn cta-secondary" data-lead-event="click_call" data-lead-label="header_call">Call</a>
        <a href="${quoteHref}" class="cta-btn cta-primary" data-lead-event="click_quote_cta" data-lead-label="header_quote">${quoteLabel}</a>
      </div>
      <button class="mobile-menu-toggle mobile-menu-button" type="button" aria-label="Open menu" aria-controls="mobileNav" aria-expanded="false">
        <span class="line line-1" aria-hidden="true"></span><span class="line line-2" aria-hidden="true"></span><span class="line line-3" aria-hidden="true"></span>
      </button>
      <div class="mobile-nav mobile-menu-overlay" id="mobileNav" hidden></div>
    </div>
  </header>`;
}
