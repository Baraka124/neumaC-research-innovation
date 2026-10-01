/* neumACt — M5.3 shared accessibility hardening
 * Small runtime safeguards for semantics that are shared across public pages.
 * Page-specific interaction remains owned by its existing page/runtime files.
 */
(function(){
  'use strict';

  function enhance(){
    var banner=document.getElementById('cookieBanner');
    if(banner){
      /* The cookie element is an informational notice, not a modal workflow. */
      banner.setAttribute('role','region');
      banner.setAttribute('aria-label','Cookie notice / Aviso de cookies');
      banner.removeAttribute('aria-modal');
    }

    document.querySelectorAll('a[target="_blank"]').forEach(function(link){
      var rel=(link.getAttribute('rel')||'').split(/\s+/).filter(Boolean);
      if(rel.indexOf('noopener')===-1)rel.push('noopener');
      if(rel.indexOf('noreferrer')===-1)rel.push('noreferrer');
      link.setAttribute('rel',rel.join(' '));
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});
  else enhance();
})();
