import { renderContactSection } from './contact-partial.js';
import { renderSiteFooter } from './site-footer.js';

const CONTACT_MARKER = '<!-- MHSC_CONTACT_PARTIAL -->';
const FOOTER_MARKER = '<!-- MHSC_SITE_FOOTER -->';
const CONTACT_PATHS = new Set(['/', '/index.html', '/contact/', '/contact/index.html']);
const FOOTER_PATHS = new Set(['/', '/index.html', '/newsletter/', '/newsletter/index.html', '/newsletter/issue-1/', '/newsletter/issue-1/index.html']);

export function usesSharedPagePartial(pathname) {
  return CONTACT_PATHS.has(pathname) || FOOTER_PATHS.has(pathname);
}

export async function injectSharedPagePartials(response, pathname) {
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return response;

  let html = await response.text();
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
