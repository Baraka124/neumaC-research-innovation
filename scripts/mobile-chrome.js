/* neumACt — M3 mobile chrome behaviour
 * Small enhancement layer around the canonical Editorial Index runtime.
 * site.js remains the state owner; this file only stabilises mobile opening
 * position and keeps the menu button label in sync with aria-expanded.
 */
(function(){
  'use strict';

  function isMobile(){return window.matchMedia('(max-width: 880px)').matches;}

  function resetIndexScroll(){
    if(!isMobile())return;
    var panel=document.getElementById('globalIndex');
    if(!panel||panel.hidden||!panel.classList.contains('is-open'))return;
    var surface=document.getElementById('globalIndexSurface');
    if(surface)surface.scrollTop=0;
    var indexView=document.getElementById('globalIndexIndexView');
    if(indexView&&!indexView.hidden)indexView.scrollTop=0;
  }

  function syncToggleLabel(){
    var toggle=document.getElementById('mobToggle');
    if(!toggle)return;
    var open=toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-label',open?'Close index / Cerrar índice':'Open index / Abrir índice');
  }

  function init(){
    var toggle=document.getElementById('mobToggle');
    if(toggle){
      syncToggleLabel();
      new MutationObserver(function(mutations){
        mutations.forEach(function(m){
          if(m.type==='attributes'&&m.attributeName==='aria-expanded'){
            syncToggleLabel();
            if(toggle.getAttribute('aria-expanded')==='true')requestAnimationFrame(resetIndexScroll);
          }
        });
      }).observe(toggle,{attributes:true,attributeFilter:['aria-expanded']});
    }

    var panel=document.getElementById('globalIndex');
    if(panel){
      new MutationObserver(function(){requestAnimationFrame(resetIndexScroll);})
        .observe(panel,{attributes:true,attributeFilter:['class','hidden','aria-hidden']});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
