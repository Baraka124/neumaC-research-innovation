/* neumAC R&I — pre-render bootstrap
 * Tiny synchronous head script: restores persisted language before first paint,
 * restores the dismissed homepage announcement state, and registers the shared
 * floating editorial surface layer as a progressive visual enhancement.
 */
(function(){
  window.NEUMAC_CONFIG = Object.freeze({
    apiBase: 'https://neumac-manage-back-end-production.up.railway.app',
    siteBase: 'https://neumact.org'
  });

  if (!document.getElementById('editorialSurfacesCss')) {
    var surfaceCss = document.createElement('link');
    surfaceCss.id = 'editorialSurfacesCss';
    surfaceCss.rel = 'stylesheet';
    surfaceCss.href = '/styles/editorial-surfaces.css';
    document.head.appendChild(surfaceCss);
  }

  try {
    var lang = localStorage.getItem('huac_lang') || localStorage.getItem('lang');
    if (lang === 'en' || lang === 'es') document.documentElement.dataset.lang = lang;
  } catch (e) {}
})();
