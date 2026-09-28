import { renderContactSection } from './contact-partial.js';

const MARKER = '<!-- MHSC_CONTACT_PARTIAL -->';
const CONTACT_PATHS = new Set(['/', '/index.html', '/contact/', '/contact/index.html']);

export function usesContactPartial(pathname) {
  return CONTACT_PATHS.has(pathname);
}

export async function injectContactSection(response, pathname) {
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return response;

  const source = await response.text();
  if (!source.includes(MARKER)) {
    console.error('Contact partial marker missing', pathname);
    return new Response(source, response);
  }

  const html = source.replace(MARKER, renderContactSection({ home: pathname === '/' || pathname === '/index.html' }));
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('etag');
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}
