import { renderContactSection } from './contact-partial.js';
import { renderSiteFooter } from './site-footer.js';
import { renderSiteHeader } from './site-header.js';

const CONTACT_MARKER = '<!-- MHSC_CONTACT_PARTIAL -->';
const FOOTER_MARKER = '<!-- MHSC_SITE_FOOTER -->';
const HEADER_MARKER = '<!-- MHSC_SITE_HEADER -->';
const CONTACT_PATHS = new Set(['/', '/index.html', '/contact/', '/contact/index.html']);
const FOOTER_PATHS = new Set(['/', '/index.html', '/newsletter/', '/newsletter/index.html', '/newsletter/issue-1/', '/newsletter/issue-1/index.html']);
const HEADER_ROUTES = new Set([
  '/', '/blog/', '/contact/', '/newsletter/', '/newsletter/issue-1/',
  '/solar-panel-cleaning-denver/', '/solar-panel-cleaning-aurora/',
  '/solar-panel-maintenance-denver/', '/solar-panel-critter-guard-denver/',
  '/commercial-rooftop-solar-cleaning/', '/colorado-plug-in-balcony-solar/',
  '/robotics-pilot/', '/water-guidelines/',
  '/blog/colorado-solar-for-all-back/',
  '/blog/solar-panel-critter-guard-denver-guide/',
  '/blog/2025-solar-tax-credit-october-15-filing-deadline/',
  '/blog/plug-in-solar-colorado-certification-guide/',
  '/blog/xcel-rate-increase-fall-solar-panel-cleaning/',
  '/blog/hail-damage-solar-panels/',
]);
const HEADER_QUOTE_LINKS = {
  '/solar-panel-cleaning-denver/': '/?service=cleaning#contact',
  '/solar-panel-cleaning-aurora/': '/?service=cleaning#contact',
  '/solar-panel-maintenance-denver/': '/?service=maintenance#contact',
  '/solar-panel-critter-guard-denver/': '/?service=critter#contact',
  '/commercial-rooftop-solar-cleaning/': '/?service=commercial#contact',
  '/colorado-plug-in-balcony-solar/': '/?service=plugin#contact',
  '/robotics-pilot/': '#interest-form',
};

function normalizedPagePath(pathname) {
  return pathname.endsWith('/index.html') ? pathname.slice(0, -10) : pathname;
}

export function usesSharedPagePartial(pathname) {
  return CONTACT_PATHS.has(pathname) || FOOTER_PATHS.has(pathname) || HEADER_ROUTES.has(normalizedPagePath(pathname));
}

export async function injectSharedPagePartials(response, pathname) {
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return response;

  let html = await response.text();
  if (HEADER_ROUTES.has(normalizedPagePath(pathname))) {
    if (!html.includes(HEADER_MARKER)) console.error('Site header marker missing', pathname);
    const home = pathname === '/' || pathname === '/index.html';
    const current = home ? 'home' : pathname.startsWith('/blog/') ? 'blog' : pathname.startsWith('/newsletter/') ? 'newsletter' : pathname.startsWith('/contact/') ? 'contact' : '';
    const pagePath = normalizedPagePath(pathname);
    const quoteHref = HEADER_QUOTE_LINKS[pagePath] || '/#contact';
    const quoteLabel = pagePath === '/robotics-pilot/' ? 'Submit a Site' : pagePath === '/colorado-plug-in-balcony-solar/' ? 'Plan Project' : 'Start Quote';
    html = html.replace(HEADER_MARKER, renderSiteHeader({ current, home, quoteHref, quoteLabel }));
  }
  if (CONTACT_PATHS.has(pathname)) {
    if (!html.includes(CONTACT_MARKER)) console.error('Contact partial marker missing', pathname);
    html = html.replace(CONTACT_MARKER, renderContactSection({ home: pathname === '/' || pathname === '/index.html' }));
  }
  if (FOOTER_PATHS.has(pathname)) {
    if (!html.includes(FOOTER_MARKER)) console.error('Site footer marker missing', pathname);
    html = html.replace(FOOTER_MARKER, renderSiteFooter());
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('etag');
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}
