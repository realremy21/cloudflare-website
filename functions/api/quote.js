// Cloudflare Pages Function for quote requests.
// Required production secret: RESEND_API_KEY.
const DEFAULT_TO_EMAIL = 'quote@milehighsolarcare.com';
const DEFAULT_FROM_EMAIL = 'quote@milehighsolarcare.com';
const DEFAULT_FROM_NAME = 'Mile High Solar Care';

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      ...extraHeaders,
    },
  });
}

function clean(value) {
  return String(value || '').trim();
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildLead(data, request) {
  const url = new URL(request.url);
  return {
    name: clean(data.name),
    email: clean(data.email).toLowerCase(),
    phone: clean(data.phone),
    service: clean(data.service),
    preferredContact: clean(data.preferredContact),
    address: clean(data.address),
    panels: clean(data.panels),
    timing: clean(data.timing),
    notes: clean(data.notes),
    pageUrl: clean(data.pageUrl),
    landingPage: clean(data.landingPage),
    referrer: clean(data.referrer),
    utmSource: clean(data.utmSource),
    utmMedium: clean(data.utmMedium),
    utmCampaign: clean(data.utmCampaign),
    utmTerm: clean(data.utmTerm),
    utmContent: clean(data.utmContent),
    submittedAt: new Date().toISOString(),
    source: url.hostname,
  };
}

function formatInternalEmail(lead) {
  return [
    'New Mile High Solar Care quote request',
    '',
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || 'Not provided'}`,
    `Service: ${lead.service || 'Not selected'}`,
    `Preferred contact: ${lead.preferredContact || 'Not selected'}`,
    `Service address: ${lead.address || 'Not provided'}`,
    `Panel count: ${lead.panels || 'Not provided'}`,
    `Timing: ${lead.timing || 'Not provided'}`,
    '',
    'Notes:',
    lead.notes || 'None provided',
    '',
    'Lead attribution:',
    `Page URL: ${lead.pageUrl || 'Not captured'}`,
    `Landing page: ${lead.landingPage || 'Not captured'}`,
    `Referrer: ${lead.referrer || 'Not captured'}`,
    `UTM source: ${lead.utmSource || 'Not provided'}`,
    `UTM medium: ${lead.utmMedium || 'Not provided'}`,
    `UTM campaign: ${lead.utmCampaign || 'Not provided'}`,
    `UTM term: ${lead.utmTerm || 'Not provided'}`,
    `UTM content: ${lead.utmContent || 'Not provided'}`,
    '',
    `Submitted: ${lead.submittedAt}`,
    `Source: ${lead.source}`,
  ].join('\n');
}

function formatCustomerEmail(lead) {
  return [
    `Hi ${lead.name},`,
    '',
    'Thanks for requesting a solar service quote from Mile High Solar Care. We received your request and will review the details so we can reply with pricing and earliest availability.',
    '',
    'What happens next:',
    '1. We review the service address, panel count, service type, and any notes.',
    '2. We follow up by your preferred contact method.',
    '3. We confirm scope, pricing, earliest availability, and any prep notes before service.',
    '',
    'If you need faster help, call or text (970) 699-5484.',
    '',
    'Mile High Solar Care',
  ].join('\n');
}

async function sendEmail(env, payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('Resend delivery failed', response.status, detail);
    throw new Error('Email delivery failed');
  }

  return response.json();
}

export const onRequest = async ({ request, env }) => {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed. Submit quote requests with POST.' }, 405, {
      Allow: 'POST',
    });
  }

  let data;

  try {
    data = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  // Honeypot field. Return success to avoid teaching bots what failed.
  if (clean(data.website)) {
    return jsonResponse({ success: true });
  }

  const lead = buildLead(data, request);
  if (!lead.name || !isEmail(lead.email)) {
    return jsonResponse({ error: 'Please enter a valid name and email.' }, 400);
  }

  if (!env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY secret');
    return jsonResponse({ error: 'Quote email service is not configured.' }, 503);
  }

  const toEmail = clean(env.QUOTE_TO_EMAIL) || DEFAULT_TO_EMAIL;
  const fromEmail = clean(env.QUOTE_FROM_EMAIL) || DEFAULT_FROM_EMAIL;
  const fromName = clean(env.QUOTE_FROM_NAME) || DEFAULT_FROM_NAME;
  const from = `${fromName} <${fromEmail}>`;

  try {
    await sendEmail(env, {
      from,
      to: [toEmail],
      reply_to: lead.email,
      subject: `New quote request from ${lead.name}`,
      text: formatInternalEmail(lead),
    });

    await sendEmail(env, {
      from,
      to: [lead.email],
      reply_to: toEmail,
      subject: 'We received your Mile High Solar Care quote request',
      text: formatCustomerEmail(lead),
    });

    return jsonResponse({ success: true });
  } catch {
    return jsonResponse({ error: 'Email delivery failed' }, 502);
  }
};
