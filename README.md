# cloudflare-website
Repository for Cloudflare website

## Quote Form Backend

The quote form posts to `functions/api/quote.js`, a Cloudflare Pages Function.

Production requires these Cloudflare Pages secrets/variables:

- `RESEND_API_KEY` secret: Resend API key for transactional email.
- `QUOTE_TO_EMAIL` variable: recipient for internal quote alerts. Defaults to `quote@milehighsolarcare.com`.
- `QUOTE_FROM_EMAIL` variable: verified sender address. Defaults to `quote@milehighsolarcare.com`.
- `QUOTE_FROM_NAME` variable: sender display name. Defaults to `Mile High Solar Care`.

Current MHSC email routing standard:

- `quote@milehighsolarcare.com` is the canonical website quote-form/backend lead inbox.
- `hello@milehighsolarcare.com` is the public/business-card/general intake email.
- Keep both roles distinct in future website copy, calendar notes, and operations docs.

After configuring secrets, submit a clearly labeled test lead and confirm:

1. The form shows a success message.
2. `QUOTE_TO_EMAIL` receives the internal quote alert.
3. The test customer email receives the confirmation.

The form also captures lead attribution fields for the internal alert:

- submitted page URL
- first landing page in the current session
- referrer
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content`

Clickable call, text, email, quote, and local-page CTAs include `data-lead-event` hooks. If Google Analytics, Google Tag Manager, Facebook Pixel, or another listener is installed later, the existing frontend hook will send lead-capture events without changing the markup again.

## Analytics

Google Analytics 4 is installed with measurement ID `G-BY6MS8MRDG`.

Lead-capture events sent from the site include:

- `click_quote_cta`
- `click_call`
- `click_sms`
- `click_email`
- `click_local_page`
- `quote_form_submit_attempt`
- `quote_form_submit_success`
- `quote_form_mailto_fallback`
- `generate_lead`

Recommended GA4 key events:

- `generate_lead`
- `quote_form_submit_success`
- `click_call`
- `click_sms`

## SEO / Routing Notes

- `sitemap.xml` and `404.html` must live at the deployed asset root.
- `robots.txt` uses the absolute sitemap URL required by crawlers.
- Canonical host redirect from `milehighsolarcare.com` to `www.milehighsolarcare.com` should be configured as a Cloudflare Redirect Rule. Cloudflare Pages `_redirects` only accepts relative source paths, so the host-level redirect does not belong in this repository file.

Recommended Cloudflare Redirect Rule:

- Rule name: `Redirect apex to www`
- If incoming requests match: hostname equals `milehighsolarcare.com`
- Then: Static redirect to `https://www.milehighsolarcare.com${uri.path}${uri.query}`
- Status code: `301` or `308`
- Preserve query string: yes

Recommended Google Search Console actions after each SEO deployment:

1. Submit `https://www.milehighsolarcare.com/sitemap.xml`.
2. Request indexing for:
   - `https://www.milehighsolarcare.com/`
   - `https://www.milehighsolarcare.com/solar-panel-cleaning-denver/`
   - `https://www.milehighsolarcare.com/solar-panel-cleaning-aurora/`
   - `https://www.milehighsolarcare.com/solar-panel-maintenance-denver/`
   - `https://www.milehighsolarcare.com/commercial-rooftop-solar-cleaning/`
   - `https://www.milehighsolarcare.com/robotics-pilot/`
   - `https://www.milehighsolarcare.com/solar-panel-critter-guard-denver/`
   - `https://www.milehighsolarcare.com/water-guidelines/`
3. If old preview domains appear in search, use Search Console removals or Cloudflare preview-domain controls to reduce duplicate results.

## Robotics Pilot Intake

- The public pilot page is `/robotics-pilot/`.
- Candidate submissions post JSON to `/api/pilot-interest`.
- The Pages Function reuses `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL`, and `QUOTE_FROM_NAME` from the production quote workflow.
- Valid submissions send an internal candidate summary and a confirmation to the submitter. Do not submit production test data unless sending both emails is intended.

For a Cloudflare dashboard drag-and-drop deployment, bundle `deployment/worker-entry.js` as a single `_worker.js` file and place it at the uploaded asset root. This preserves both `/api/quote` and `/api/pilot-interest` while forwarding all other requests to `env.ASSETS`.
