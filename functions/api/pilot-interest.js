// Cloudflare Pages Function for Colorado robotics pilot candidate submissions.
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

function buildCandidate(data, request) {
  const url = new URL(request.url);
  return {
    fullName: clean(data.fullName),
    workEmail: clean(data.workEmail).toLowerCase(),
    company: clean(data.company),
    role: clean(data.role),
    phone: clean(data.phone),
    siteName: clean(data.siteName),
    siteLocation: clean(data.siteLocation),
    siteSize: clean(data.siteSize),
    rackingType: clean(data.rackingType),
    rowSpacing: clean(data.rowSpacing),
    clearance: clean(data.clearance),
    terrain: clean(data.terrain),
    currentOm: clean(data.currentOm),
    authority: clean(data.authority),
    notes: clean(data.notes),
    consent: clean(data.consent),
    submittedAt: new Date().toISOString(),
    source: url.hostname,
  };
}

function formatInternalEmail(candidate) {
  return [
    'New Colorado robotics pilot candidate',
    '',
    `Contact: ${candidate.fullName}`,
    `Work email: ${candidate.workEmail}`,
    `Company: ${candidate.company}`,
    `Role / title: ${candidate.role}`,
    `Phone: ${candidate.phone || 'Not provided'}`,
    `Authority / connection: ${candidate.authority}`,
    '',
    `Candidate site: ${candidate.siteName}`,
    `Location: ${candidate.siteLocation}`,
    `Approximate size: ${candidate.siteSize || 'Not provided'}`,
    `Racking / tracker: ${candidate.rackingType || 'Not provided'}`,
    `Inter-row spacing: ${candidate.rowSpacing || 'Not provided'}`,
    `Lowest clearance: ${candidate.clearance || 'Not provided'}`,
    `Terrain: ${candidate.terrain || 'Not provided'}`,
    `Current O&M provider: ${candidate.currentOm || 'Not provided'}`,
    '',
    'Additional notes:',
    candidate.notes || 'None provided',
    '',
    `Contact consent: ${candidate.consent === 'yes' ? 'Yes' : 'No'}`,
    `Submitted: ${candidate.submittedAt}`,
    `Source: ${candidate.source}`,
  ].join('\n');
}

function formatConfirmationEmail(candidate) {
  return [
    `Hi ${candidate.fullName},`,
    '',
    `Thanks for submitting ${candidate.siteName} for the Colorado robotic solar cleaning pilot-site review.`,
    '',
    'Mile High Solar Care and O&M Robotics will review the available site geometry and operational information. If the site looks promising, we will contact you about a short suitability review before any access, scheduling, or field activity is proposed.',
    '',
    'Submitting a site does not create a service commitment. The existing O&M provider remains in place, and access, safety, insurance, scope, responsibilities, and permissions must be documented before any field evaluation.',
    '',
    'Mile High Solar Care',
    '(970) 699-5484',
    'jeremy@milehighsolarcare.com',
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
    return jsonResponse({ error: 'Method not allowed. Submit pilot candidates with POST.' }, 405, {
      Allow: 'POST',
    });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
  }

  if (clean(data.website)) {
    return jsonResponse({ success: true });
  }

  const candidate = buildCandidate(data, request);
  const requiredFields = [candidate.fullName, candidate.company, candidate.role, candidate.siteName, candidate.siteLocation, candidate.authority];
  if (requiredFields.some((value) => !value) || !isEmail(candidate.workEmail) || candidate.consent !== 'yes') {
    return jsonResponse({ error: 'Please complete all required fields and authorize pilot-related contact.' }, 400);
  }

  if (!env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY secret');
    return jsonResponse({ error: 'Pilot intake email service is not configured.' }, 503);
  }

  const toEmail = clean(env.QUOTE_TO_EMAIL) || DEFAULT_TO_EMAIL;
  const fromEmail = clean(env.QUOTE_FROM_EMAIL) || DEFAULT_FROM_EMAIL;
  const fromName = clean(env.QUOTE_FROM_NAME) || DEFAULT_FROM_NAME;
  const from = `${fromName} <${fromEmail}>`;

  try {
    await sendEmail(env, {
      from,
      to: [toEmail],
      reply_to: candidate.workEmail,
      subject: `New robotics pilot candidate: ${candidate.siteName}`,
      text: formatInternalEmail(candidate),
    });

    await sendEmail(env, {
      from,
      to: [candidate.workEmail],
      reply_to: toEmail,
      subject: 'We received your Colorado robotics pilot site submission',
      text: formatConfirmationEmail(candidate),
    });

    return jsonResponse({ success: true });
  } catch {
    return jsonResponse({ error: 'Email delivery failed.' }, 502);
  }
};
