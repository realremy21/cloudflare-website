// Build this entry as a single `_worker.js` file for Cloudflare Pages
// dashboard drag-and-drop deployments. Wrangler deployments can continue to
// compile the source files in /functions directly.
import { onRequest as handleQuote } from '../functions/api/quote.js';
import { onRequest as handlePilotInterest } from '../functions/api/pilot-interest.js';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/quote') {
      return handleQuote({ request, env });
    }

    if (url.pathname === '/api/pilot-interest') {
      return handlePilotInterest({ request, env });
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ error: 'Not found.' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
