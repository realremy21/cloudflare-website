// Shared homepage and newsletter footer.
export function renderSiteFooter() {
  return `	  <footer class="border-t border-slate-700 py-10 bg-black text-white">
	    <div class="max-w-6xl mx-auto px-4 text-sm text-slate-300">
	      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
	        <p>© <span id="y"></span> Mile High Solar Care — Colorado Clean. Peak Power.</p>
        <p>Serving Denver, Aurora & the Front Range • <a class="text-link" href="/colorado-plug-in-balcony-solar/" data-lead-event="click_local_page" data-lead-label="footer_plugin_balcony_solar">Plug-in solar planning</a> • <a class="text-link" href="tel:+19706995484" data-lead-event="click_call" data-lead-label="footer_call">(970) 699‑5484</a></p>
      </div>
    </div>
    <script>document.getElementById('y').textContent = new Date().getFullYear();</script>
  </footer>`;
}
