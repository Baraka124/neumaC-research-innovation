/* neumACt — M6.1 device-aware Index/navigation choreography
 * Enhances the canonical site.js Index without becoming a second state owner.
 * - Contact is removed from the masthead.
 * - Desktop Index trigger joins the primary navigation.
 * - Mobile hamburger becomes an explicit Index trigger.
 * - Research lines use progressive disclosure on small screens.
 */
(function(){
  'use strict';

  var MOBILE_DISCLOSURE=620;
  var DESKTOP_INDEX=880;
  var READY_RETRIES=20;
  var READY_DELAY=50;

  function bi(en,es){
    return '<span lang="en">'+en+'</span><span lang="es">'+es+'</span>';
  }

  function removeHeaderContact(){
    document.querySelectorAll('.hdr .hdr-contact-btn').forEach(function(link){link.remove();});
  }

  function prepareMobileTrigger(){
    var toggle=document.getElementById('mobToggle');
    if(!toggle)return;
    if(!toggle.querySelector('.mob-index-label')){
      toggle.innerHTML='<span class="mob-index-glyph" aria-hidden="true"><i></i><i></i><i></i></span><span class="mob-index-label">'+bi('Index','Índice')+'</span>';
    }
    toggle.setAttribute('aria-label','Open index / Abrir índice');
    toggle.setAttribute('title','Index / Índice');
  }

  function placeDesktopIndex(){
    var btn=document.getElementById('hdrIndexBtn');
    var nav=document.querySelector('.hdr-nav');
    var right=document.querySelector('.hdr-right');
    if(!btn||!nav||!right)return;

    if(window.innerWidth>DESKTOP_INDEX){
      if(btn.parentElement!==nav)nav.appendChild(btn);
      btn.classList.add('hdr-index-btn--nav');
    }else{
      if(btn.parentElement!==right)right.insertBefore(btn,right.firstChild||null);
      btn.classList.remove('hdr-index-btn--nav');
    }
  }

  function setLinesExpanded(expanded,focus){
    var section=document.querySelector('.global-index__lines');
    var toggle=section&&section.querySelector('.global-index__lines-toggle');
    if(!section||!toggle)return;

    section.classList.toggle('is-lines-expanded',expanded);
    section.classList.toggle('is-lines-collapsed',!expanded);
    toggle.setAttribute('aria-expanded',String(expanded));

    var mark=toggle.querySelector('.global-index__lines-toggle-mark');
    var nextMark=expanded?'−':'+';
    if(mark&&mark.textContent!==nextMark)mark.textContent=nextMark;

    if(focus&&expanded){
      var first=section.querySelector('.global-index__line');
      if(first)requestAnimationFrame(function(){first.focus({preventScroll:true});});
    }
  }


  function activeChapter(){
    var current=document.querySelector('[data-index-chapter][aria-pressed="true"],[data-index-chapter].is-current');
    return current&&current.dataset.indexChapter||'research';
  }

  function syncDisclosureContext(){
    var section=document.querySelector('.global-index__lines');
    var toggle=section&&section.querySelector('.global-index__lines-toggle');
    var label=toggle&&toggle.querySelector('.global-index__lines-toggle-label');
    var list=document.getElementById('globalIndexLines');
    var all=section&&section.querySelector('.global-index__lines-all');
    var open=document.getElementById('globalIndexChapterOpen');
    if(!section||!toggle||!label||!list)return;

    var chapter=activeChapter();
    var count=list.querySelectorAll('.global-index__line').length;
    if(chapter==='research'){
      label.innerHTML=bi((count||6)+' lines',(count||6)+' líneas');
    }else{
      label.innerHTML=bi((count||0)+' sections',(count||0)+' secciones');
    }

    if(all&&open){
      all.href=open.getAttribute('href')||'#';
      var en=open.querySelector('[lang="en"]');
      var es=open.querySelector('[lang="es"]');
      all.innerHTML=bi((en&&en.textContent||'Open chapter')+' →',(es&&es.textContent||'Abrir capítulo')+' →');
    }
  }

  function ensureLinesDisclosure(){
    var section=document.querySelector('.global-index__lines');
    var head=section&&section.querySelector('.global-index__section-head');
    var list=document.getElementById('globalIndexLines');
    if(!section||!head||!list)return false;

    var toggle=head.querySelector('.global-index__lines-toggle');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='global-index__lines-toggle';
      toggle.setAttribute('aria-controls','globalIndexLines');
      toggle.innerHTML='<span class="global-index__lines-toggle-label"></span><span class="global-index__lines-toggle-mark" aria-hidden="true">+</span>';
      head.appendChild(toggle);
      toggle.addEventListener('click',function(){
        var expanded=toggle.getAttribute('aria-expanded')==='true';
        setLinesExpanded(!expanded,true);
      });
    }

    if(!section.querySelector('.global-index__lines-all')){
      var source=document.getElementById('globalIndexChapterOpen');
      var all=document.createElement('a');
      all.className='global-index__lines-all';
      all.href='/clinical/';
      all.innerHTML=bi('Research programme →','Programa de investigación →');
      list.insertAdjacentElement('afterend',all);
      if(source)source.classList.add('global-index__lines-head-link');
    }

    syncDisclosureContext();
    if(window.innerWidth<=MOBILE_DISCLOSURE){
      if(section.dataset.mobilePrepared!=='true'){
        section.dataset.mobilePrepared='true';
        setLinesExpanded(true,false);
      }
    }else{
      if(section.dataset.mobilePrepared!=='false')section.dataset.mobilePrepared='false';
      setLinesExpanded(true,false);
    }
    return true;
  }

  function cleanMobileInstitutionDuplication(){
    var institutions=document.querySelector('.global-index__institutions');
    if(!institutions)return;
    if(window.innerWidth<=DESKTOP_INDEX)institutions.setAttribute('aria-hidden','true');
    else institutions.removeAttribute('aria-hidden');
  }

  function reconcile(){
    removeHeaderContact();
    prepareMobileTrigger();
    placeDesktopIndex();
    var indexReady=ensureLinesDisclosure();
    cleanMobileInstitutionDuplication();
    return indexReady;
  }

  function reconcileWhenReady(attempt){
    if(reconcile())return;
    if(attempt>=READY_RETRIES)return;
    setTimeout(function(){reconcileWhenReady(attempt+1);},READY_DELAY);
  }

  function start(){
    /* site.js owns the Index and can finish its DOMContentLoaded boot after
       this enhancement has already seen the static masthead. Retry only until
       the canonical Index exists, then stop permanently. */
    reconcileWhenReady(0);

    var resizeTimer=null;
    window.addEventListener('resize',function(){
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(function(){reconcileWhenReady(0);},80);
    },{passive:true});
    document.addEventListener('neumac:languagechange',function(){reconcileWhenReady(0);});
    document.addEventListener('click',function(e){
      if(!e.target.closest('[data-index-chapter]'))return;
      requestAnimationFrame(function(){
        syncDisclosureContext();
        if(window.innerWidth<=MOBILE_DISCLOSURE)setLinesExpanded(true,false);
      });
    });

    var mobileTrigger=document.getElementById('mobToggle');
    if(mobileTrigger){
      mobileTrigger.addEventListener('click',function(){
        requestAnimationFrame(function(){
          if(window.innerWidth<=MOBILE_DISCLOSURE&&mobileTrigger.getAttribute('aria-expanded')==='true'){
            syncDisclosureContext();
            setLinesExpanded(true,false);
          }
        });
      });
    }
  }

  document.addEventListener('neumac:indexready',function(){
    reconcileWhenReady(0);
  });

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
