// One source for the homepage #contact section and the dedicated contact page.
// Field names, options, contact facts, and form fallback live here; behavior lives in /assets/quote-form.js.
export const CONTACT = Object.freeze({
  phone: '+19706995484',
  displayPhone: '(970) 699-5484',
  email: 'hello@milehighsolarcare.com',
  quoteEmail: 'quote@milehighsolarcare.com',
  hours: 'Mon–Sat 8:00–6:00',
  serviceArea: 'Aurora, Denver, Golden, Boulder, Fort Collins, and Colorado Springs',
});

const CERTIFICATIONS = `<div id="certifications" class="pt-2">
					            <p class="text-xs uppercase tracking-wider text-[var(--gold)]">Certifications</p>
					            <div class="mt-3 flex flex-wrap items-center gap-5 justify-start">
					              <img src="/images/osha-badge.png" alt="OSHA badge" class="cert-badge" width="720" height="480" loading="lazy" decoding="async" />
					              <img src="/images/isca-badge.png" alt="ISCA badge" class="cert-badge" width="720" height="480" loading="lazy" decoding="async" />
					            </div>
				          </div>`;

export function renderContactSection({ home = false } = {}) {
  return `<section id="contact" class="py-16 sm:py-20 bg-black text-white">
			    <div class="max-w-6xl mx-auto px-4">
				      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight">Start Your Service Quote</h2>
					    <p class="mt-2 text-slate-300">Share the best contact route, service address or nearest cross streets, rough panel count if you know it, and what you want checked. We review every request before quoting so pricing, access, scope, and timing are clear before service.</p>
					    <p class="mt-3 text-sm text-slate-400">The form usually takes about a minute. Most quote requests receive same-day follow-up during business hours.</p>

	      <div class="mt-6 flex flex-wrap gap-3" aria-label="Call or text Mile High Solar Care">
        <a class="cta-btn cta-primary text-sm" href="tel:${CONTACT.phone}" data-lead-event="click_call" data-lead-label="contact_primary_call">Call ${CONTACT.displayPhone}</a>
        <a class="cta-btn cta-secondary text-sm" href="sms:${CONTACT.phone}" data-lead-event="click_sms" data-lead-label="contact_primary_text">Text ${CONTACT.displayPhone}</a>
      </div>
      <div class="mt-8 grid gap-8 md:grid-cols-2">
        <form id="qform" class="grid grid-cols-1 gap-4" action="mailto:${CONTACT.quoteEmail}" data-phone-display="${CONTACT.displayPhone}" data-quote-email="${CONTACT.quoteEmail}" method="post" enctype="text/plain" novalidate>
          <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden" />
          <input type="hidden" name="pageUrl" />
          <input type="hidden" name="landingPage" />
          <input type="hidden" name="referrer" />
          <input type="hidden" name="utmSource" />
          <input type="hidden" name="utmMedium" />
	          <input type="hidden" name="utmCampaign" />
	          <input type="hidden" name="utmTerm" />
	          <input type="hidden" name="utmContent" />
          <input type="hidden" name="submissionId" />
          <input type="hidden" name="gaClientId" />
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-name">Name <span class="text-xs font-normal text-slate-400">Required</span></label>
          <input id="quote-name" class="glass px-4 py-3 rounded-xl" type="text" name="name" autocomplete="name" placeholder="Your name" required />
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-email">Email <span class="text-xs font-normal text-slate-400">Required</span></label>
          <input id="quote-email" class="glass px-4 py-3 rounded-xl" type="email" name="email" autocomplete="email" placeholder="you@example.com" required />
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-phone">Phone <span class="text-xs font-normal text-slate-400"><span id="quote-phone-requirement">Required for text or call follow-up</span></span></label>
          <input id="quote-phone" class="glass px-4 py-3 rounded-xl" type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="(###) ###-####" />
          <p class="text-xs text-slate-400">Choose Email for email-only follow-up. Text or Call requires a phone number. Email is required for your request confirmation.</p>
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-service">Service needed <span class="text-xs font-normal text-slate-400">Required</span></label>
          <select id="quote-service" class="glass px-4 py-3 rounded-xl" name="service" required>
            <option value="">Service needed</option>
            <option value="Solar panel cleaning">Solar panel cleaning</option>
            <option value="Solar maintenance check / photo condition report">Solar maintenance check / photo condition report</option>
            <option value="Critter guard installation">Critter guard installation</option>
            <option value="Critter guard maintenance">Critter guard maintenance</option>
            <option value="Limited critter guard repair">Limited critter guard repair</option>
            <option value="Commercial rooftop solar / O&M support">Commercial rooftop solar / O&amp;M support</option>
            <option value="Attic solar fan cleaning or maintenance">Attic solar fan cleaning or maintenance</option>
            <option value="Plug-in solar panel cleaning">Plug-in solar panel cleaning</option>
            <option value="Plug-in / balcony solar planning">Plug-in / balcony solar planning</option>
            <option value="Holiday light installation">Holiday light installation</option>
            <option value="Window cleaning">Window cleaning</option>
            <option value="Gutter cleaning">Gutter cleaning</option>
            <option value="Not sure">Not sure yet</option>
          </select>
          <p class="text-xs text-slate-400">Not sure is fine. Choose the closest option and use the notes box for cleaning, critter guard, maintenance photos, storm residue, bird activity, commercial/HOA access, seasonal services, or timing details.</p>
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-property">Property type <span class="text-xs font-normal text-slate-400">Optional</span></label>
          <select id="quote-property" class="glass px-4 py-3 rounded-xl" name="propertyType">
            <option value="">Property type</option>
            <option value="Homeowner / residential">Homeowner / residential</option>
            <option value="Commercial building">Commercial building</option>
            <option value="HOA / property manager">HOA / property manager</option>
            <option value="Solar company / partner">Solar company / partner</option>
          </select>
          <div id="quote-organization-group" class="hidden grid gap-2">
            <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-organization">Company or organization <span class="text-xs font-normal text-slate-400">Recommended for commercial requests</span></label>
            <input id="quote-organization" class="glass px-4 py-3 rounded-xl" type="text" name="organization" autocomplete="organization" placeholder="Company, HOA, facility, or partner name" />
          </div>
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-contact">Preferred contact method <span class="text-xs font-normal text-slate-400">Required</span></label>
          <select id="quote-contact" class="glass px-4 py-3 rounded-xl" name="preferredContact" required>
            <option value="">Preferred contact method</option>
            <option value="Text">Text</option>
            <option value="Call">Call</option>
            <option value="Email">Email</option>
          </select>
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-address">Service location <span class="text-xs font-normal text-slate-400">Required</span></label>
          <input id="quote-address" class="glass px-4 py-3 rounded-xl" type="text" name="address" autocomplete="street-address" placeholder="Address, city, or nearest cross streets" required />
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-panels">Approximate panel count <span class="text-xs font-normal text-slate-400">Optional</span></label>
          <input id="quote-panels" class="glass px-4 py-3 rounded-xl" type="text" name="panels" inputmode="numeric" placeholder="For example, 20" />
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-timing">Preferred timing or urgency <span class="text-xs font-normal text-slate-400">Optional</span></label>
          <input id="quote-timing" class="glass px-4 py-3 rounded-xl" type="text" name="timing" placeholder="For example, this month" />
          <label class="grid gap-2 text-sm font-semibold text-slate-200" for="quote-notes">Project details <span class="text-xs font-normal text-slate-400">Optional</span></label>
          <textarea id="quote-notes" class="glass px-4 py-3 rounded-xl" name="notes" rows="4" placeholder="Roof height, debris, bird activity, access, reporting, or other helpful details"></textarea>
		          <button id="submitBtn" class="cta-btn cta-primary glossy-btn text-base font-semibold w-full" type="submit">Start My Quote</button>
	          <p class="text-xs text-slate-400">By submitting, you agree that Mile High Solar Care may contact you about your quote request. Trouble? Email <a class="text-link" href="mailto:${CONTACT.quoteEmail}" data-lead-event="click_email" data-lead-label="form_help_email">${CONTACT.quoteEmail}</a> or call/text.</p>
	          <div id="formMsg" class="hidden text-sm" aria-live="polite"></div>
        </form>
		        <div class="space-y-4 text-slate-300">
		          <div class="quote-trust-card p-5 text-sm text-slate-200">
			            <p class="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">What happens next</p>
			            <p class="mt-2 text-lg font-semibold text-white">Fast intake, careful quote, no surprise add-ons.</p>
			            <ul class="quote-trust-list mt-4" style="list-style:none; padding-left:0;">
			              <li>
			                <span class="quote-trust-check" aria-hidden="true">✓</span>
			                <span><strong class="text-white">We confirm receipt.</strong> You should see an on-page success message and a confirmation email.</span>
			              </li>
			              <li>
			                <span class="quote-trust-check" aria-hidden="true">✓</span>
			                <span><strong class="text-white">We check the basics.</strong> Address, panel count, roof/access notes, service type, and timing are reviewed before quoting.</span>
			              </li>
			              <li>
			                <span class="quote-trust-check" aria-hidden="true">✓</span>
			                <span><strong class="text-white">Photos can follow by reply.</strong> After the confirmation email arrives, reply to it with roofline, array, access, or damage photos if requested—no need to upload them here.</span>
			              </li>
			              <li>
			                <span class="quote-trust-check" aria-hidden="true">✓</span>
			                <span><strong class="text-white">Clear price before service.</strong> We reply with scope, price, earliest availability, and any prep notes before service.</span>
			              </li>
			              <li>
			                <span class="quote-trust-check" aria-hidden="true">✓</span>
			                <span><strong class="text-white">No automatic payment or scheduling.</strong> Payment links, invoices, scheduling, and photo/proof packets happen only after quote review and customer approval.</span>
			              </li>
			            </ul>
		          </div>
		          <p><span class="font-semibold">Email:</span> <a class="text-link" href="mailto:${CONTACT.email}" data-lead-event="click_email" data-lead-label="contact_email">${CONTACT.email}</a></p>
		          <p class="text-sm text-slate-400">Hours: ${CONTACT.hours}</p>
                  <p class="text-sm text-slate-400">Service area: ${CONTACT.serviceArea}</p>
				          ${home ? CERTIFICATIONS : ''}
			        </div>
		      </div>
						    </div>
						  </section>`;
}
