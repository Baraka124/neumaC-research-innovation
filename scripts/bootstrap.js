/* neumAC R&I — pre-render bootstrap
 * Tiny synchronous head script: restores persisted language before first paint
 * and registers shared visual/runtime enhancement layers.
 */
(function(){
  window.NEUMAC_CONFIG = Object.freeze({
    apiBase: 'https://neumac-manage-back-end-production.up.railway.app',
    siteBase: 'https://neumact.org'
  });

  function addStylesheet(id,href){
    if(document.getElementById(id))return;
    var link=document.createElement('link');
    link.id=id;link.rel='stylesheet';link.href=href;
    document.head.appendChild(link);
  }

  function addScript(id,src){
    if(document.getElementById(id))return;
    var script=document.createElement('script');
    script.id=id;script.src=src;script.async=false;
    document.head.appendChild(script);
  }

  addStylesheet('editorialSurfacesCss','/styles/editorial-surfaces.css');
  addStylesheet('mobileChromeCss','/styles/mobile-chrome.css');
  addStylesheet('editorialRhythmCss','/styles/editorial-rhythm.css');
  addStylesheet('editorialHierarchyCss','/styles/editorial-hierarchy.css');
  addStylesheet('editorialMediaCss','/styles/editorial-media.css');
  addStylesheet('inibicAffiliationCss','/styles/inibic-affiliation.css');
  addStylesheet('indexNavigationCss','/styles/index-navigation.css');
  addStylesheet('workstationCss','/styles/workstation.css');
  addScript('mobileChromeJs','/scripts/mobile-chrome.js');
  addScript('accessibilityHardeningJs','/scripts/accessibility-hardening.js');
  addScript('inibicAffiliationJs','/scripts/inibic-affiliation.js');
  addScript('indexNavigationJs','/scripts/index-navigation.js');

  try {
    var lang = localStorage.getItem('huac_lang') || localStorage.getItem('lang') || 'es';
    if (lang === 'en' || lang === 'es') {
      document.documentElement.dataset.lang = lang;
      document.documentElement.lang = lang;
    }
  } catch (e) {}
})();
