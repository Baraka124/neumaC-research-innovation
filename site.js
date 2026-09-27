/* neumAC R&I — Shared Site Runtime
 * Canonical owner for language, mobile drawer, cookie banner,
 * scroll progress/back-to-top, smooth anchors and reveal safety.
 * Page scripts should own only page-specific behaviour.
 */
(function(){
  'use strict';

  var root=document.documentElement;
  var LANG_KEY='huac_lang';

  function getSavedLang(){
    try{return localStorage.getItem(LANG_KEY)||localStorage.getItem('lang')||root.dataset.lang||'en';}
    catch(e){return root.dataset.lang||'en';}
  }

  function syncLangControls(lang){
    document.querySelectorAll('[data-lang]').forEach(function(btn){
      var on=btn.dataset.lang===lang;
      if(btn.classList.contains('lt-btn')) btn.classList.toggle('lt-btn--active',on);
      if(btn.classList.contains('lang-opt')) btn.tabIndex=on?0:-1;
      if(btn.getAttribute('role')==='radio') btn.setAttribute('aria-checked',String(on));
    });
    var en=document.getElementById('mobLangEn'), es=document.getElementById('mobLangEs');
    if(en) en.classList.toggle('active',lang==='en');
    if(es) es.classList.toggle('active',lang==='es');
    var label=document.getElementById('langLabel');
    if(label) label.textContent=lang.toUpperCase();
  }

  function setLang(lang,emit){
    if(lang!=='en'&&lang!=='es') return;
    root.dataset.lang=lang;
    root.lang=lang;
    try{localStorage.setItem(LANG_KEY,lang);localStorage.setItem('lang',lang);}catch(e){}
    syncLangControls(lang);
    closeLangMenu();
    closeDrawer();
    if(emit!==false){
      document.dispatchEvent(new CustomEvent('neumac:languagechange',{detail:{lang:lang}}));
    }
  }
  window.selectLang=function(lang){setLang(lang,true);};

  function drawerParts(){
    return {
      toggle:document.getElementById('mobToggle'),
      drawer:document.getElementById('mobDrawer'),
      overlay:document.getElementById('mobOverlay'),
      close:document.getElementById('mobClose')
    };
  }
  function openDrawer(){
    var p=drawerParts(); if(!p.drawer)return;
    p.drawer.classList.add('open');
    if(p.overlay)p.overlay.classList.add('open');
    if(p.toggle){p.toggle.classList.add('open');p.toggle.setAttribute('aria-expanded','true');}
    document.body.classList.add('is-drawer-open');
    closeLangMenu();
  }
  function closeDrawer(){
    var p=drawerParts();
    if(p.drawer)p.drawer.classList.remove('open');
    if(p.overlay)p.overlay.classList.remove('open');
    if(p.toggle){p.toggle.classList.remove('open');p.toggle.setAttribute('aria-expanded','false');}
    document.body.classList.remove('is-drawer-open');
  }
  window.neumACDrawer={open:openDrawer,close:closeDrawer};

  function closeLangMenu(){
    var sw=document.getElementById('langSw'), btn=document.getElementById('langBtn');
    if(sw)sw.classList.remove('open','open-up');
    if(btn)btn.setAttribute('aria-expanded','false');
  }
  function toggleLangMenu(){
    var sw=document.getElementById('langSw'), btn=document.getElementById('langBtn');
    if(!sw||!btn)return;
    if(sw.classList.contains('open')){closeLangMenu();return;}
    closeDrawer(); sw.classList.add('open'); btn.setAttribute('aria-expanded','true');
  }

  function initChrome(){
    var p=drawerParts();
    if(p.toggle)p.toggle.addEventListener('click',function(){
      if(p.drawer&&p.drawer.classList.contains('open'))closeDrawer();else openDrawer();
    });
    if(p.close)p.close.addEventListener('click',closeDrawer);
    if(p.overlay)p.overlay.addEventListener('click',closeDrawer);

    var langBtn=document.getElementById('langBtn'), langSw=document.getElementById('langSw');
    if(langBtn)langBtn.addEventListener('click',function(e){e.stopPropagation();toggleLangMenu();});
    if(langSw)langSw.addEventListener('click',function(e){e.stopPropagation();});

    document.addEventListener('click',function(e){
      var langButton=e.target.closest('[data-lang]');
      if(langButton){
        var lang=langButton.dataset.lang;
        if(lang==='en'||lang==='es'){e.preventDefault();window.selectLang(lang);}
      }
      if(!e.target.closest('#langSw'))closeLangMenu();
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){closeDrawer();closeLangMenu();}
    });
  }

  function initScrollUI(){
    var pb=document.getElementById('pb'), stt=document.getElementById('scrollTop'), hdr=document.getElementById('hdr');
    var ticking=false;
    function update(){
      var y=window.scrollY, total=document.documentElement.scrollHeight-window.innerHeight;
      if(pb)pb.style.width=(total>0?(y/total*100):0)+'%';
      if(stt){var threshold=Math.max(400,total*0.35);stt.classList.toggle('visible',y>threshold);}
      var path=location.pathname.replace(/\/+$/,'')||'/';
      if(hdr&&(path==='/'||path==='/team'))hdr.classList.toggle('light',y>60);
      ticking=false;
    }
    window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});
    if(stt)stt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
    update();
  }

  function initAnchors(){
    document.addEventListener('click',function(e){
      var a=e.target.closest('a[href^="#"]'); if(!a)return;
      var raw=a.getAttribute('href'); if(!raw||raw==='#')return;
      var id=raw.slice(1), el=document.getElementById(id); if(!el)return;
      e.preventDefault(); closeDrawer();
      setTimeout(function(){
        window.scrollTo({top:Math.max(0,el.offsetTop-96),behavior:'smooth'});
        try{history.pushState(null,'','#'+id);}catch(_e){}
      },50);
    });
  }

  function revealAll(){document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});}
  function initReveal(){
    if(!('IntersectionObserver' in window)){revealAll();return;}
    try{
      window._revealObserver=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){entry.target.classList.add('in');window._revealObserver.unobserve(entry.target);}
        });
      },{threshold:.08,rootMargin:'0px 0px -32px 0px'});
      document.querySelectorAll('.reveal').forEach(function(el){window._revealObserver.observe(el);});
    }catch(e){revealAll();return;}
    setTimeout(function(){
      function sweep(){
        document.querySelectorAll('.reveal:not(.in)').forEach(function(el){
          var r=el.getBoundingClientRect(); if(r.top<window.innerHeight&&r.bottom>0)el.classList.add('in');
        });
      }
      sweep();
      if(document.querySelector('.reveal:not(.in)'))window.addEventListener('scroll',sweep,{passive:true});
    },2500);
  }

  function initCookie(){
    var banner=document.getElementById('cookieBanner'); if(!banner)return;
    var accepted=false; try{accepted=!!localStorage.getItem('cookieOk');}catch(e){}
    banner.classList.toggle('is-visible',!accepted);
    banner.addEventListener('click',function(e){
      var btn=e.target.closest('.cookie-banner__button'); if(!btn)return;
      banner.classList.remove('is-visible'); try{localStorage.setItem('cookieOk','1');}catch(_e){}
    });
  }

  function initImageFallbacks(){
    document.addEventListener('error',function(e){
      var target=e.target;
      if(target&&target.matches&&target.matches('.hdr-logo-img'))target.classList.add('is-image-error');
    },true);
  }

  function initErrorSafety(){
    function rescue(){try{document.querySelectorAll('.reveal:not(.in)').forEach(function(el){el.classList.add('in');});}catch(_e){}}
    window.addEventListener('error',rescue,true);
    window.addEventListener('unhandledrejection',rescue);
  }

  function boot(){
    setLang(getSavedLang(),false);
    initChrome(); initScrollUI(); initAnchors(); initReveal(); initCookie(); initImageFallbacks(); initErrorSafety();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
