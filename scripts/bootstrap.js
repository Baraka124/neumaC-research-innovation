/* neumAC R&I — pre-render bootstrap
 * Tiny synchronous head script: restores persisted language before first paint
 * and restores the dismissed homepage announcement state.
 */
(function(){
  window.NEUMAC_CONFIG = Object.freeze({
    apiBase: 'https://neumac-manage-back-end-production.up.railway.app',
    siteBase: 'https://neumact.org'
  });
  try {
    var lang = localStorage.getItem('huac_lang') || localStorage.getItem('lang');
    if (lang === 'en' || lang === 'es') document.documentElement.dataset.lang = lang;
  } catch (e) {}
})();
