// Shared quote form behavior for /#contact and /contact/.
(() => {
    // Lead tracking hooks: works with GA/dataLayer/Facebook Pixel if installed.
    function trackLeadEvent(eventName, detail = {}){
      const payload = {
        event_category: 'lead_capture',
        page_location: window.location.href,
        ...detail
      };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...payload });
      if(typeof window.gtag === 'function') window.gtag('event', eventName, payload);
      if(typeof window.fbq === 'function') window.fbq('trackCustom', eventName, payload);
    }

    document.addEventListener('click', (event)=>{
      const target = event.target.closest('[data-lead-event]');
      if(!target) return;
      trackLeadEvent(target.dataset.leadEvent, {
        event_label: target.dataset.leadLabel || target.textContent.trim(),
        link_url: target.href || ''
      });
    }, { capture: true });

		    // Form: progressive enhancement POST to /api/quote, fallback to mailto
    const form = document.getElementById('qform');
    const phoneDisplay = form.dataset.phoneDisplay;
    const quoteEmail = form.dataset.quoteEmail;
	    const formMsg = document.getElementById('formMsg');
	    const submitBtn = document.getElementById('submitBtn');
	    const landingKey = 'mhsc_landing_page';
    const GA_MEASUREMENT_ID = 'G-BY6MS8MRDG';
    const submitSuccessKey = 'mhsc_quote_submit_success';
    const duplicateWindowMs = 10 * 60 * 1000;
    const quoteSuccessMessage = [
      'Thanks — we received your solar care request.',
      'Jeremy or a member of the Mile High Solar Care team will review your information and follow up shortly.',
      "Here's what happens next:",
      '1. We review your system details and service needs.',
      '2. We confirm the right service and pricing.',
      "3. We schedule a convenient time if you're ready to move forward.",
      'For faster help, you can also call or text us directly at (970) 699-5484.',
      'Thank you for trusting us with your solar investment.',
      '— Jeremy & Meral, Mile High Solar Care'
    ].join('\n');
	    let quoteFormStarted = false;
	    if(!sessionStorage.getItem(landingKey)) sessionStorage.setItem(landingKey, window.location.href);

	    function setField(name, value){
	      const input = form.querySelector(`[name="${name}"]`);
	      if(input) input.value = value || '';
	    }

    function isValidEmail(value){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
    }

    function newSubmissionId(){
      if(window.crypto && typeof window.crypto.randomUUID === 'function'){
        return window.crypto.randomUUID();
      }
      return `mhsc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }

    function showFormError(message){
      formMsg.className = 'form-status form-status-error text-sm';
      formMsg.textContent = message;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Start My Quote';
    }

    function validateQuoteForm(data){
      if(!data.name || !isValidEmail(data.email)){
        return { reason: 'name_or_email', message: 'Please enter your name and a valid email.' };
      }
      if(!data.service){
        return { reason: 'service', message: 'Please choose the service you need.' };
      }
      if(!data.preferredContact){
        return { reason: 'preferred_contact', message: 'Please choose your preferred contact method.' };
      }
      if((data.preferredContact === 'Text' || data.preferredContact === 'Call') && !data.phone){
        return { reason: 'phone_for_selected_contact', message: 'Please enter a phone number for call or text follow-up.' };
      }
      if(!data.address){
        return { reason: 'address', message: 'Please enter the service address, city, or nearest cross streets.' };
      }
      return null;
    }

    function recentDuplicate(data){
      try {
        const saved = JSON.parse(sessionStorage.getItem(submitSuccessKey) || 'null');
        if(!saved || !saved.email || !saved.submittedAt) return false;
        const isRecent = Date.now() - Number(saved.submittedAt) < duplicateWindowMs;
        return isRecent && saved.email === String(data.email || '').trim().toLowerCase();
      } catch {
        return false;
      }
    }

    function rememberSubmission(data){
      try {
        sessionStorage.setItem(submitSuccessKey, JSON.stringify({
          email: String(data.email || '').trim().toLowerCase(),
          submissionId: data.submissionId || '',
          submittedAt: Date.now()
        }));
      } catch {}
    }

	    function populateAttributionFields(){
	      const params = new URLSearchParams(window.location.search);
	      setField('pageUrl', window.location.href);
      setField('landingPage', sessionStorage.getItem(landingKey));
      setField('referrer', document.referrer);
      setField('utmSource', params.get('utm_source'));
      setField('utmMedium', params.get('utm_medium'));
	      setField('utmCampaign', params.get('utm_campaign'));
	      setField('utmTerm', params.get('utm_term'));
	      setField('utmContent', params.get('utm_content'));
	      const submissionIdInput = form.querySelector('[name="submissionId"]');
	      if(submissionIdInput && !submissionIdInput.value) submissionIdInput.value = newSubmissionId();
	    }

    function captureGaClientId(){
      return new Promise((resolve)=>{
        let settled = false;
        const finish = (clientId = '')=>{
          if(settled) return;
          settled = true;
          setField('gaClientId', clientId);
          resolve(clientId);
        };
        window.setTimeout(()=>finish(''), 800);
        if(typeof window.gtag !== 'function') return finish('');
        try {
          window.gtag('get', GA_MEASUREMENT_ID, 'client_id', (clientId)=>finish(clientId));
        } catch {
          finish('');
        }
      });
    }

    function applyQuotePreset(){
      const params = new URLSearchParams(window.location.search);
      const servicePresets = {
        maintenance: 'Solar maintenance check / photo condition report',
        cleaning: 'Solar panel cleaning',
        critter: 'Critter guard installation',
        'critter-repair': 'Limited critter guard repair',
        'critter-install': 'Critter guard installation',
        commercial: 'Commercial rooftop solar / O&M support',
        plugin: 'Plug-in / balcony solar planning'
      };
      const requestedService = params.get('service');
      const serviceValue = servicePresets[requestedService];
      const serviceSelect = form.querySelector('[name="service"]');
      if(serviceSelect && serviceValue){
        serviceSelect.value = serviceValue;
      }
      const requestedReview = params.get('request');
      const notesInput = form.querySelector('[name="notes"]');
      if(requestedReview === 'capability-coi' && notesInput && !notesInput.value){
        notesInput.value = 'Capability + COI requirements review requested.';
      }
    }

    function updateCommercialFields(){
      const serviceSelect = form.querySelector('[name="service"]');
      const organizationGroup = document.getElementById('quote-organization-group');
      if(!serviceSelect || !organizationGroup) return;
      organizationGroup.classList.toggle('hidden', serviceSelect.value !== 'Commercial rooftop solar / O&M support');
    }

    applyQuotePreset();
    updateCommercialFields();
    form.querySelector('[name="service"]')?.addEventListener('change', updateCommercialFields);

	    form.addEventListener('input', ()=>{
	      if(quoteFormStarted) return;
	      quoteFormStarted = true;
	      trackLeadEvent('quote_form_start', { event_label: 'quote_form' });
	    }, { capture: true });

	    form.addEventListener('change', ()=>{
	      if(quoteFormStarted) return;
	      quoteFormStarted = true;
	      trackLeadEvent('quote_form_start', { event_label: 'quote_form' });
	    }, { capture: true });

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      populateAttributionFields();
      await captureGaClientId();
      trackLeadEvent('quote_form_submit_attempt', { event_label: 'quote_form' });
	      formMsg.className = 'form-status form-status-info text-sm';
	      formMsg.textContent = 'Sending your request...';
	      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

		      const data = Object.fromEntries(new FormData(form).entries());
      const validationError = validateQuoteForm(data);
      if(validationError){
	      trackLeadEvent('quote_form_validation_error', {
	        event_label: 'quote_form',
	        validation_reason: validationError.reason
	      });
	      showFormError(validationError.message);
        return;
      }
      if(recentDuplicate(data)){
	      trackLeadEvent('quote_form_duplicate_blocked', { event_label: 'quote_form' });
        showFormError(`This quote request appears to have been sent already. If you need faster help, call or text ${phoneDisplay}.`);
        return;
      }
		      try {
		        const res = await fetch('/api/quote', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
		        if(res.ok){
	          const result = await res.json().catch(()=>({ success: true, confirmationSent: true }));
	            if(result.analyticsSubmissionAccepted === true){
	              trackLeadEvent('quote_form_submit_success', { event_label: 'quote_form' });
	            }
	            if(result.analyticsLeadEligible === true){
	              trackLeadEvent('generate_lead', {
                  event_label: 'quote_form',
                  method: 'quote_form',
                  submission_id: data.submissionId || '',
                  lead_source: data.utmSource || 'website'
                });
	            }
            rememberSubmission(data);
		          formMsg.className = 'form-status form-status-success text-sm';
		          formMsg.style.whiteSpace = 'pre-line';
		          formMsg.textContent = quoteSuccessMessage;
		          form.reset();
		          submitBtn.disabled = true;
	          submitBtn.textContent = 'Request sent';
		          return;
		        }
	        throw new Error('Bad status');
      } catch(err){
        trackLeadEvent('quote_form_mailto_fallback', { event_label: 'quote_form' });
        // Fallback to mailto:
        const body = encodeURIComponent(
          `Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone||''}
Service: ${data.service||''}
Property type: ${data.propertyType||''}
Company or organization: ${data.organization||''}
Preferred contact: ${data.preferredContact||''}
Address: ${data.address||''}
Panels: ${data.panels||''}
Timing: ${data.timing||''}
Notes: ${data.notes||''}
Page URL: ${data.pageUrl||''}
Landing page: ${data.landingPage||''}
Referrer: ${data.referrer||''}
UTM source: ${data.utmSource||''}
UTM medium: ${data.utmMedium||''}
UTM campaign: ${data.utmCampaign||''}
UTM term: ${data.utmTerm||''}
UTM content: ${data.utmContent||''}
GA client ID: ${data.gaClientId||''}
Submission ID: ${data.submissionId||''}`
		        );
	        window.location.href = `mailto:${quoteEmail}?subject=New%20Quote%20Request&body=${body}`;
	        formMsg.className = 'form-status form-status-info text-sm';
	        formMsg.textContent = `Opening your email app as a backup. If it does not open, email ${quoteEmail} or call/text ${phoneDisplay}.`;
	        submitBtn.disabled = false;
        submitBtn.textContent = 'Start My Quote';
	      }
		    });
})();
