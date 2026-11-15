/* nexbia — banner de cookies + etiqueta de Google Ads (Consent Mode v2, modo básico)
   La etiqueta de Google NO se carga hasta que el visitante pulsa «Aceptar».
   Conversión «Contacto»: reserva enviada, auditoría GEO enviada, clic en WhatsApp o teléfono. */
(function(){
  var TAG_ID = 'GTM-N9B7QQNZ';
  var ADS_ID = 'AW-18571290832';
  var CONVERSION = 'AW-18571290832/AGOlCM7b97gdENDRvZdF';
  var KEY = 'nexbia-cookies';
  var MAX_AGE = 365 * 24 * 3600 * 1000; // volvemos a preguntar a los 12 meses

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted'
  });

  function readChoice(){
    try{
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (v && (v.c === 'granted' || v.c === 'denied') && Date.now() - v.t < MAX_AGE) return v.c;
    }catch(e){}
    return null;
  }
  function saveChoice(c){ try{ localStorage.setItem(KEY, JSON.stringify({ c: c, t: Date.now() })); }catch(e){} }

  var loaded = false;
  function loadTag(){
    if (loaded) return; loaded = true;
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + TAG_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', TAG_ID);
    gtag('config', ADS_ID);
  }
  function clearGoogleCookies(){
    document.cookie.split(';').forEach(function(c){
      var n = c.split('=')[0].trim();
      if (/^(_gcl|_ga|_gid|_gac)/.test(n)){
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + host, '; domain=.' + host].forEach(function(d){
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  // ---- Conversión «Contacto» (una vez por tipo y por página) ----
  var sent = {};
  function conversion(kind){
    if (!loaded || sent[kind]) return;
    sent[kind] = true;
    gtag('event', 'conversion', { send_to: CONVERSION, event_label: kind, transport_type: 'beacon' });
  }
  window.nexbiaConversion = conversion;

  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/wa\.me\/|api\.whatsapp\.com/i.test(href)) conversion('whatsapp');
    else if (/^tel:/i.test(href)) conversion('telefono');
  });

  function watchShown(id, kind){
    var el = document.getElementById(id);
    if (!el || !window.MutationObserver) return;
    new MutationObserver(function(){ if (!el.hidden) conversion(kind); })
      .observe(el, { attributes: true, attributeFilter: ['hidden'] });
  }

  // ---- Banner ----
  var css = '' +
    '.ck-bar{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:720px;margin:0 auto;background:#fff;color:#1d1b2e;' +
    'border-radius:16px;box-shadow:0 12px 40px rgba(40,25,90,.18);padding:18px 20px;font:15px/1.5 Inter,system-ui,sans-serif;display:flex;gap:16px;align-items:center;flex-wrap:wrap}' +
    '.ck-bar p{margin:0;flex:1 1 320px}.ck-bar a{color:#4B3AA6;font-weight:600}' +
    '.ck-btns{display:flex;gap:8px;flex:0 0 auto}' +
    '.ck-btns button{font:600 14px Inter,system-ui,sans-serif;padding:10px 18px;border-radius:999px;cursor:pointer;border:1.5px solid #4B3AA6;min-width:110px}' +
    '.ck-yes{background:#4B3AA6;color:#fff}.ck-no{background:#fff;color:#4B3AA6}' +
    '.ck-btns button:focus-visible{outline:3px solid #C6A9FF;outline-offset:2px}' +
    '@media (max-width:640px){.ck-bar{left:10px;right:10px;bottom:84px;padding:16px}.ck-btns{width:100%}.ck-btns button{flex:1}}';

  var bar = null;
  function showBanner(){
    if (bar) { bar.hidden = false; return; }
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    bar = document.createElement('div');
    bar.className = 'ck-bar'; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', 'Cookies');
    bar.innerHTML = '<p>Usamos cookies de Google Ads para saber si nuestros anuncios funcionan. Solo se activan si las aceptas. <a href="cookies.html">Más información</a></p>' +
      '<div class="ck-btns"><button type="button" class="ck-no">Rechazar</button><button type="button" class="ck-yes">Aceptar</button></div>';
    document.body.appendChild(bar);
    bar.querySelector('.ck-yes').addEventListener('click', function(){ saveChoice('granted'); bar.hidden = true; loadTag(); });
    bar.querySelector('.ck-no').addEventListener('click', function(){
      var wasOn = loaded;
      saveChoice('denied'); bar.hidden = true; clearGoogleCookies();
      if (wasOn){
        gtag('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
        location.reload();
      }
    });
  }
  window.nexbiaCookieSettings = showBanner;

  function init(){
    watchShown('bookOk', 'reserva');
    watchShown('geoOk', 'auditoria-geo');
    document.querySelectorAll('[data-cookie-settings]').forEach(function(el){
      el.addEventListener('click', function(e){ e.preventDefault(); showBanner(); });
    });
    var c = readChoice();
    if (c === 'granted') loadTag();
    else if (c === null) showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
