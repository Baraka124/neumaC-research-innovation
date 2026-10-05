/* Home page — mobile research-line disclosure.
 * Desktop/laptop preserve the existing programme matrix.
 * Institutional research-line titles are rendered unchanged by api.js.
 */
(function(){
  'use strict';

  var BREAKPOINT=640;
  var button=document.getElementById('homeLinesDisclosure');
  var grid=document.getElementById('researchLinesGrid');
  if(!button||!grid) return;

  var mq=window.matchMedia('(max-width:'+BREAKPOINT+'px)');

  function setExpanded(expanded){
    button.setAttribute('aria-expanded',expanded?'true':'false');
    grid.classList.toggle('is-mobile-collapsed',mq.matches&&!expanded);
  }

  function syncMode(){
    if(mq.matches){
      setExpanded(button.getAttribute('aria-expanded')==='true');
    }else{
      grid.classList.remove('is-mobile-collapsed');
      button.setAttribute('aria-expanded','false');
    }
  }

  button.addEventListener('click',function(){
    if(!mq.matches) return;
    setExpanded(button.getAttribute('aria-expanded')!=='true');
  });

  if(typeof mq.addEventListener==='function') mq.addEventListener('change',syncMode);
  else if(typeof mq.addListener==='function') mq.addListener(syncMode);

  syncMode();
})();