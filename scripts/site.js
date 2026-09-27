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
    document.querySelectorAll('.lang-opt[data-lang], .lt-btn[data-lang]').forEach(function(btn){
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
      var langButton=e.target.closest('.lang-opt[data-lang], .lt-btn[data-lang]');
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
    var pb=document.getElementById('pb');
    var stt=document.getElementById('scrollTop');
    var hdr=document.getElementById('hdr');
    var cur=document.querySelector('.hdr-nav-link[data-current="true"]');
    var ticking=false;
    var lastY=window.scrollY || 0;
    var directionStartY=lastY;
    var goingDown=false;

    function update(){
      var y=window.scrollY || 0;
      var total=document.documentElement.scrollHeight-window.innerHeight;

      if(pb) pb.style.width=(total>0?(y/total*100):0)+'%';
      if(stt){
        var threshold=Math.max(400,total*0.35);
        stt.classList.toggle('visible',y>threshold);
      }

      if(hdr){
        var path=location.pathname.replace(/\/+$/,'')||'/';
        if(path==='/'||path==='/team') hdr.classList.toggle('light',y>60);
        hdr.classList.toggle('scrolled',y>40);
        hdr.classList.remove('hdr-hidden');
}

      if(cur){
        var progress=total>0?Math.min(1,y/total):0;
        root.style.setProperty('--navprog',progress.toFixed(3));
      }

      lastY=y;
      ticking=false;
    }

    window.addEventListener('scroll',function(){
      if(!ticking){requestAnimationFrame(update);ticking=true;}
    },{passive:true});
    if(stt) stt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
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

  function initResearchInquiry(){
    var toggle=document.getElementById('researchInquiryToggle');
    var panel=document.getElementById('researchInquiryPanel');
    var close=document.getElementById('researchInquiryClose');
    if(!toggle||!panel)return;
    function setOpen(open,moveFocus){
      toggle.setAttribute('aria-expanded',open?'true':'false');
      panel.hidden=!open;
      if(open&&moveFocus){
        var first=panel.querySelector('input,select,textarea,button');
        if(first)requestAnimationFrame(function(){first.focus();});
      }else if(!open&&moveFocus){
        requestAnimationFrame(function(){toggle.focus();});
      }
    }
    toggle.addEventListener('click',function(){setOpen(toggle.getAttribute('aria-expanded')!=='true',true);});
    if(close)close.addEventListener('click',function(){setOpen(false,true);});
    document.querySelectorAll('a.research-text-link[href="#contact"],a.research-modal-contact[href="#contact"]').forEach(function(link){
      link.addEventListener('click',function(){setOpen(true,false);});
    });
  }

  function bootCore(){
    setLang(getSavedLang(),false);
    initChrome(); initScrollUI(); initAnchors(); initReveal(); initCookie(); initImageFallbacks(); initErrorSafety(); initResearchInquiry();
  }

  /* ================================================================
     Phase 4 — consolidated header/accessibility enhancements
     These functions now share the same runtime scope and boot lifecycle.
     ================================================================ */

  /* Language state/control synchronization is owned exclusively by the core runtime above. */

  /* ── 2. Sliding nav pill ──────────────────────────────────────── */
  function initNavPill(){
    var nav = document.querySelector('.hdr-nav');
    var pill = nav && nav.querySelector('.hdr-nav-pill');
    if (!nav || !pill) return;

    function moveTo(el){
      if (!el) return;
      var navRect = nav.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      // pill is a 1px base at left:0; translateX to the item and
      // scaleX up to its width — pure transform, no layout.
      var x = r.left - navRect.left;
      pill.style.transform = 'translateY(-50%) translateX(' + x + 'px) scaleX(' + r.width + ')';
      pill.style.opacity = '1';
    }
    function reset(){
      var current = nav.querySelector('.hdr-nav-link[data-current="true"]')
                 || nav.querySelector('.hdr-dd .hdr-nav-link[data-current="true"]');
      if (current) moveTo(current); else pill.style.opacity = '0';
    }

    nav.querySelectorAll('.hdr-nav-link').forEach(function(link){
      link.addEventListener('mouseenter', function(){ moveTo(link); });
    });
    var dd = nav.querySelector('.hdr-dd');
    if (dd) dd.addEventListener('mouseenter', function(){
      var l = dd.querySelector('.hdr-nav-link'); if (l) moveTo(l);
    });
    nav.addEventListener('mouseleave', reset);
    nav.addEventListener('focusin', function(e){
      var link=e.target.closest('.hdr-nav-link');
      if(link) moveTo(link);
    });
    nav.addEventListener('focusout', function(e){
      if(!nav.contains(e.relatedTarget)) reset();
    });
    reset();
    window.addEventListener('resize', reset, {passive:true});
  }

  /* Header scroll state is consolidated into initScrollUI() above. */

  /* ── 4. Mobile drawer focus trap ──────────────────────────────────
     Drawer state is owned by site.js. This enhancement watches the
     canonical "open" class via MutationObserver and adds keyboard
     focus containment without creating a second state owner. */
  function initDrawerFocusTrap(){
    var drawer = document.getElementById('mobDrawer');
    var toggle = document.getElementById('mobToggle');
    if (!drawer) return;
    var trapping = false;
    function focusable(){
      return Array.prototype.slice.call(
        drawer.querySelectorAll('a[href], button:not([disabled])')
      ).filter(function(el){ return el.offsetParent !== null; });
    }
    function onKeydown(e){
      if (e.key !== 'Tab') return;
      var f = focusable();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    var mo = new MutationObserver(function(){
      var isOpen = drawer.classList.contains('open');
      if (isOpen && !trapping) {
        trapping = true;
        document.addEventListener('keydown', onKeydown);
        var f = focusable();
        if (f.length) f[0].focus();
      } else if (!isOpen && trapping) {
        trapping = false;
        document.removeEventListener('keydown', onKeydown);
        if (toggle && drawer.contains(document.activeElement)) toggle.focus();
      }
    });
    mo.observe(drawer, { attributes: true, attributeFilter: ['class'] });
  }

  /* ── 5. Language switch: roving tabindex (arrow-key navigation) ──
     role="radiogroup"/"radio" implies arrow keys move selection, not
     just Tab — this is the standard interaction pattern for a
     two-state segmented control (matches how a native OS language
     toggle or a <select role="radio"> group behaves). Left/Right and
     Up/Down all move; Home/End jump to the ends (trivial with two
     items, kept for correctness if a third language is ever added). */
  function initLangRovingTabindex(){
    var group = document.querySelector('.lang-switch[role="radiogroup"]');
    if (!group) return;
    var opts = Array.prototype.slice.call(group.querySelectorAll('.lang-opt'));
    if (opts.length < 2) return;
    function focusAt(i){
      opts.forEach(function(o, idx){ o.tabIndex = idx === i ? 0 : -1; });
      opts[i].focus();
    }
    group.addEventListener('keydown', function(e){
      var i = opts.indexOf(document.activeElement);
      if (i === -1) return;
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % opts.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + opts.length) % opts.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = opts.length - 1;
      if (next === null) return;
      e.preventDefault();
      focusAt(next);
      opts[next].click();
    });
  }

  /* Pointer and keyboard nav-pill parity is consolidated in initNavPill(). */

  /* Nav read progress is consolidated into initScrollUI() above. */

  /* ── 14: first-visit language suggestion ─────────────────────
     Browser prefers Spanish, site is showing English, user has
     never chosen — one dismissible chip, asked exactly once. */
  function initLangToast(){
    try{
      if (localStorage.getItem('lang') || localStorage.getItem('huac_lang') ||
          localStorage.getItem('langToastDone')) return;
      var wantsEs = (navigator.language || '').toLowerCase().indexOf('es') === 0;
      var showingEn = (document.documentElement.dataset.lang || 'en') === 'en';
      if (!wantsEs || !showingEn) return;
      var t = document.createElement('div');
      t.className = 'lang-toast'; t.setAttribute('role','status');
      t.innerHTML = '¿Prefieres español? ' +
        '<button class="lt-yes">Sí</button><button class="lt-no" aria-label="No, gracias">×</button>';
      document.body.appendChild(t);
      function done(){ try{localStorage.setItem('langToastDone','1');}catch(e){} t.remove(); }
      t.querySelector('.lt-yes').addEventListener('click', function(){ if (window.selectLang) window.selectLang('es'); done(); });
      t.querySelector('.lt-no').addEventListener('click', done);
      setTimeout(function(){ if (t.parentNode) done(); }, 12000);
    }catch(e){}
  }

  /* ── 15: connection status dot ───────────────────────────────
     Amber when the network drops or the API banner fires; hover
     explains. Status belongs in the chrome, quietly. */
  /* ── 16: swipe-to-close the drawer ───────────────────────────
     Rightward swipe delegates to the canonical site.js drawer toggle,
     preserving the same overlay, aria and body-lock state transition. */
  function initDrawerSwipe(){
    var drawer = document.getElementById('mobDrawer');
    var toggle = document.getElementById('mobToggle');
    if (!drawer || !toggle) return;
    var x0 = null;
    drawer.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
    drawer.addEventListener('touchend', function(e){
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (dx > 64 && drawer.classList.contains('open')) toggle.click();
    }, {passive:true});
  }

  /* ── 18: scroll-linked header theming ────────────────────────
     Sections opting in via data-hdr="light" flip the header to a
     frosted-light scheme while they sit under it. Sentinel-based:
     cheap IntersectionObserver band at header height. */
  function initHeaderTheming(){
    var hdr = document.getElementById('hdr');
    var zones = document.querySelectorAll('[data-hdr="light"]');
    if (!hdr || !zones.length) return;
    var overCount = 0;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ overCount += en.isIntersecting ? 1 : -1; });
      hdr.classList.toggle('over-light', overCount > 0);
    }, { rootMargin: '-1px 0px -' + (window.innerHeight - 70) + 'px 0px' });
    zones.forEach(function(z){ io.observe(z); });
  }

  /* ── 20: skip-link menu ───────────────────────────────────────
     One skip link becomes three (content / navigation / footer),
     revealed on focus like the original. Footer gets an id if it
     lacks one. Screen-reader users get the same speed the sighted
     nav just gained. */
  function initSkipMenu(){
    var first = document.querySelector('.skip-link');
    if (!first || document.getElementById('skipNav')) return;
    var footer = document.querySelector('.site-footer');
    if (footer && !footer.id) footer.id = 'siteFooter';
    var nav = document.createElement('a');
    nav.className = 'skip-link skip-link--nav'; nav.id = 'skipNav'; nav.href = '#hdr';
    nav.textContent = 'Skip to navigation';
    var foot = document.createElement('a');
    foot.className = 'skip-link skip-link--footer'; foot.href = '#' + (footer ? footer.id : 'siteFooter');
    foot.textContent = 'Skip to footer';
    first.after(nav, foot);
  }

  /* ── 8 + 9: keyboard shortcuts, help overlay, command palette ─ */
  var GO = { h:'/', r:'/clinical/', i:'/innovation/', a:'/news/', t:'/team/', p:'/report/' };
  function initKeyboardLayer(){
    var pendingG = false, gTimer = null;

    function typingContext(e){
      var t = e.target;
      return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    }

    document.addEventListener('keydown', function(e){
      if (typingContext(e)) return;

      /* palette: Cmd/Ctrl+K */
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
        e.preventDefault(); openPalette(); return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      /* help overlay: ? */
      if (e.key === '?'){ e.preventDefault(); openHelp(); return; }

      /* vim-style go: g then destination */
      if (pendingG){
        pendingG = false; clearTimeout(gTimer);
        var dest = GO[e.key.toLowerCase()];
        if (dest){ e.preventDefault(); location.href = dest; }
        return;
      }
      if (e.key.toLowerCase() === 'g'){
        pendingG = true;
        gTimer = setTimeout(function(){ pendingG = false; }, 900);
      }
    });
    var searchBtn=document.getElementById('hdrSearchBtn');
    if(searchBtn) searchBtn.addEventListener('click', openPalette);
}

  function openHelp(){
    if (document.querySelector('.kbd-help')) return;
    var o = document.createElement('div');
    o.className = 'kbd-help'; o.setAttribute('role','dialog'); o.setAttribute('aria-label','Keyboard shortcuts');
    o.innerHTML = '<div class="kbd-help-card"><h3>Keyboard shortcuts</h3><dl>' +
      '<dt><kbd>⌘K</kbd></dt><dd>Quick search</dd>' +
      '<dt><kbd>g h</kbd></dt><dd>Home</dd>' +
      '<dt><kbd>g r</kbd></dt><dd>Research</dd>' +
      '<dt><kbd>g i</kbd></dt><dd>Innovation</dd>' +
      '<dt><kbd>g a</kbd></dt><dd>Articles</dd>' +
      '<dt><kbd>g t</kbd></dt><dd>Team</dd>' +
      '<dt><kbd>g p</kbd></dt><dd>Annual report</dd>' +
      '<dt><kbd>?</kbd></dt><dd>This overlay</dd></dl></div>';
    document.body.appendChild(o);
    function close(){ o.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e){ if (e.key === 'Escape') close(); }
    o.addEventListener('click', function(e){ if (e.target === o) close(); });
    document.addEventListener('keydown', onKey);
  }

  /* Palette index: static pages immediately; research lines join
     when their fetch resolves (reuses the dropdown's endpoint via
     the browser cache — no new cost worth worrying about). */
  var _palItems = [
    {k:'page', t:'Home · Inicio', href:'/'},
    {k:'page', t:'Research · Investigación', href:'/clinical/'},
    {k:'page', t:'Innovation · Innovación', href:'/innovation/'},
    {k:'page', t:'Articles · Artículos', href:'/news/'},
    {k:'page', t:'Team · Equipo', href:'/team/'},
    {k:'page', t:'Annual report · Memoria anual', href:'/report/'},
    {k:'page', t:'Contact · Contacto', href:'/#contact'},
    {k:'page', t:'Privacy · Privacidad', href:'/privacidad/'},
    {k:'page', t:'Accessibility · Accesibilidad', href:'/accesibilidad/'}
  ];
  var _palLinesLoaded = false;

  function openPalette(){
    if (document.querySelector('.cmdk-overlay')) return;
    if (!_palLinesLoaded && window.fetch){
      _palLinesLoaded = true;
      fetch(window.NEUMAC_CONFIG.apiBase + '/api/research-lines/website')
        .then(function(r){ return r.json(); })
        .then(function(res){
          (res.data || []).forEach(function(l){
            _palItems.push({ k:'L'+String(l.line_number).padStart(2,'0'),
                             t:(l.short_name || l.name || ''), href:'/line/?id='+l.id });
          });
          renderList(document.querySelector('.cmdk input') ?
            document.querySelector('.cmdk input').value : '');
        }).catch(function(){});
    }
    var o = document.createElement('div');
    o.className = 'cmdk-overlay'; o.setAttribute('role','dialog'); o.setAttribute('aria-label','Quick search');
    o.innerHTML = '<div class="cmdk"><input type="text" placeholder="Search pages and research lines…" aria-label="Search"/><div class="cmdk-list" role="listbox"></div></div>';
    document.body.appendChild(o);
    var input = o.querySelector('input');
    var sel = 0;

    window.renderList = function(q){
      var list = o.querySelector('.cmdk-list');
      if (!list) return;
      q = (q || '').trim().toLowerCase();
      var hits = _palItems.filter(function(it){
        return !q || it.t.toLowerCase().indexOf(q) > -1 || it.k.toLowerCase().indexOf(q) > -1;
      }).slice(0, 9);
      sel = 0;
      list.innerHTML = hits.length
        ? hits.map(function(it, i){
            return '<a class="cmdk-item" role="option" data-sel="'+(i===0?1:0)+'" href="'+it.href+'"><span class="ck-k">'+it.k+'</span><span class="ck-t">'+it.t+'</span></a>';
          }).join('')
        : '<div class="cmdk-empty">No matches — try a page name or L-number.</div>';
    };
    renderList('');
    input.focus();
    input.addEventListener('input', function(){ renderList(input.value); });

    function close(){ o.remove(); document.removeEventListener('keydown', onKey); window.renderList = null; }
    function onKey(e){
      var items = o.querySelectorAll('.cmdk-item');
      if (e.key === 'Escape'){ close(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
        e.preventDefault();
        if (!items.length) return;
        items[sel] && items[sel].setAttribute('data-sel','0');
        sel = e.key === 'ArrowDown' ? (sel+1)%items.length : (sel-1+items.length)%items.length;
        items[sel].setAttribute('data-sel','1');
        items[sel].scrollIntoView({block:'nearest'});
      }
      else if (e.key === 'Enter'){
        if (items[sel]) location.href = items[sel].getAttribute('href');
      }
    }
    o.addEventListener('click', function(e){ if (e.target === o) close(); });
    document.addEventListener('keydown', onKey);
  }

  function bootEnhancements(){
    initDrawerFocusTrap();
    initLangRovingTabindex();
    initLangToast();
    initDrawerSwipe();
    initSkipMenu();
    initKeyboardLayer();
  }

  function boot(){
    bootCore();
    bootEnhancements();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
