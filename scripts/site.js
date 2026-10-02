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

  /* ================================================================
     GLOBAL H1 — EDITORIAL INDEX MASTHEAD
     Shared across every public page. The existing primary navigation remains
     visible on desktop; Index/Search open one common editorial surface.
     On tablet/mobile the same surface becomes the full navigation reader.
     ================================================================ */
  var INDEX_BREAKPOINT=880;
  var indexState={
    panel:null,surface:null,indexView:null,searchView:null,input:null,results:null,
    mode:'index',open:false,lastFocus:null,lines:[],people:[],posts:[],loaded:false,loading:false,
    filter:'all',projects:[]
  };

  function ixEsc(v){
    return String(v==null?'':v).replace(/[&<>'\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c];});
  }
  function ixBi(en,es){return '<span lang="en">'+ixEsc(en)+'</span><span lang="es">'+ixEsc(es)+'</span>';}
  function ixSlug(v){
    return String(v||'').replace(/\b(?:Dra|Dr|Prof)\.?\s*/gi,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }
  var IX_LINE_LABELS={
    1:['Transplantation & Pulmonary Hypertension','Trasplante e hipertensión pulmonar'],
    2:['Airway Diseases','Enfermedades de la vía aérea'],
    3:['Interventional Pneumology & Lung Cancer','Neumología intervencionista y cáncer de pulmón'],
    4:['Respiratory Failure & Sleep Medicine','Insuficiencia respiratoria y medicina del sueño'],
    5:['Innovation in Thoracic Surgery','Innovación en cirugía torácica'],
    6:['Precision Medicine & Clinical Innovation','Medicina de precisión e innovación clínica']
  };
  var IX_ROLE_LABELS={
    attending_physician:['Physician','Médico/a'],specialist_physician:['Physician','Médico/a'],
    primary_care_physician:['Primary care physician','Médico/a de atención primaria'],
    medical_resident:['Resident physician','Médico/a residente'],researcher:['Researcher','Investigador/a'],
    research_scientist:['Research scientist','Personal investigador'],biologist:['Biologist','Biólogo/a'],
    nurse:['Nurse','Enfermero/a'],research_nurse:['Research nurse','Enfermero/a de investigación'],
    biomedical_engineer:['Biomedical engineer','Ingeniero/a biomédico/a'],computer_scientist:['Computer scientist','Profesional de informática'],
    data_scientist:['Data science','Ciencia de datos'],data_manager:['Data manager','Gestor/a de datos']
  };
  function ixReadLocalized(obj,key,lang){
    if(!obj)return '';
    var direct=obj[key+'_'+lang]; if(direct!=null&&String(direct).trim())return String(direct).trim();
    var value=obj[key];
    if(value&&typeof value==='object'&&value[lang]!=null&&String(value[lang]).trim())return String(value[lang]).trim();
    return value!=null&&typeof value!=='object'?String(value).trim():'';
  }
  function ixLinePair(l){
    var mapped=IX_LINE_LABELS[Number(l&&l.line_number||0)]||['',''];
    var en=ixReadLocalized(l,'short_name','en')||ixReadLocalized(l,'name','en')||mapped[0]||String(l&&l.short_name||l&&l.name||'').trim();
    var es=ixReadLocalized(l,'short_name','es')||ixReadLocalized(l,'name','es')||mapped[1]||en;
    return [en,es];
  }
  function ixPersonRolePair(p){
    if(p&&IX_ROLE_LABELS[p.staff_type])return IX_ROLE_LABELS[p.staff_type];
    var raw=String(p&&p.public_role||p&&p.specialization||'').trim();
    if(/^neumolog[ií]a$/i.test(raw)||/^pulmonology$/i.test(raw))return ['Pulmonology','Neumología'];
    if(/^medicina de familia$/i.test(raw)||/^family medicine$/i.test(raw))return ['Family Medicine','Medicina de Familia'];
    return raw?[raw,raw]:['Team','Equipo'];
  }
  function ixProjectPair(p,key){
    var en=ixReadLocalized(p,key,'en');var es=ixReadLocalized(p,key,'es');
    if(!en)en=es||'';if(!es)es=en||'';return [en,es];
  }
  function ixSearchSvg(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4 4"></path></svg>';}
  function ixApi(path){
    if(!window.fetch)return Promise.reject(new Error('fetch unavailable'));
    var base=(window.NEUMAC_CONFIG&&window.NEUMAC_CONFIG.apiBase)||'';
    return fetch(base+path,{headers:{'Accept':'application/json'}}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});
  }
  function ixPageKey(){
    var h=document.getElementById('hdr');
    var p=(h&&h.dataset.page)||'';
    if(p==='clinical'||p==='line')return 'research';
    if(p==='news')return 'articles';
    return p;
  }
  function h2PageContext(){
    var hdr=document.getElementById('hdr');
    var page=(hdr&&hdr.dataset.page)||document.body.dataset.page||'home';
    var map={
      home:{section:['neumACt','neumACt'],detail:['Research & Innovation','Investigación e Innovación']},
      clinical:{section:['Research','Investigación'],detail:['Research programme','Programa de investigación']},
      innovation:{section:['Innovation','Innovación'],detail:['Clinical innovation','Innovación clínica']},
      news:{section:['Publications','Publicaciones'],detail:['Scientific output','Producción científica']},
      team:{section:['Team','Equipo'],detail:['Multidisciplinary team','Equipo multidisciplinar']},
      line:{section:['Research','Investigación'],detail:['Research line','Línea de investigación']}
    };
    var ctx=map[page]||map.home;
    if(page==='line'){
      var title=document.getElementById('lineTitle');
      if(title){
        var en=title.querySelector('[lang="en"]');
        var es=title.querySelector('[lang="es"]');
        var raw=String(title.textContent||'').trim();
        ctx={section:['Research','Investigación'],detail:[String(en&&en.textContent||raw||'Research line').trim(),String(es&&es.textContent||raw||'Línea de investigación').trim()]};
      }
    }
    return ctx;
  }

  function h2SyncContextRail(){
    var rail=document.getElementById('hdrContextRail');if(!rail)return;
    var ctx=h2PageContext();
    var section=rail.querySelector('.hdr-context__section');
    var detail=rail.querySelector('.hdr-context__detail');
    if(section)section.innerHTML=ixBi(ctx.section[0],ctx.section[1]);
    if(detail)detail.innerHTML=ixBi(ctx.detail[0],ctx.detail[1]);
  }

  function h2BuildMasthead(){
    var hdr=document.getElementById('hdr');if(!hdr)return;
    hdr.classList.add('hdr--scientific');
    document.body.classList.add('has-scientific-masthead');

    var nav=hdr.querySelector('.hdr-nav');
    if(nav&&!nav.querySelector('.hdr-nav-signature')){
      var signature=document.createElement('span');
      signature.className='hdr-nav-signature';
      signature.setAttribute('aria-hidden','true');
      nav.appendChild(signature);
    }

    var search=hdr.querySelector('#hdrSearchBtn');
    if(search&&!search.querySelector('.hdr-search-label')){
      var label=document.createElement('span');
      label.className='hdr-search-label';
      label.innerHTML=ixBi('Search','Buscar');
      search.appendChild(label);
    }

    if(!document.getElementById('hdrContextRail')){
      var rail=document.createElement('div');
      rail.className='hdr-context';rail.id='hdrContextRail';
      rail.setAttribute('aria-label','Page context / Contexto de página');
      rail.innerHTML='<div class="hdr-context__inner"><span class="hdr-context__section"></span><span class="hdr-context__mark" aria-hidden="true"></span><span class="hdr-context__detail"></span><span class="hdr-context__rule" aria-hidden="true"></span><span class="hdr-context__statement">'+ixBi('Science for better respiratory health','Ciencia para una mejor salud respiratoria')+'</span></div>';
      hdr.appendChild(rail);
    }
    h2SyncContextRail();

    var lineTitle=document.getElementById('lineTitle');
    if(lineTitle&&window.MutationObserver){
      new MutationObserver(h2SyncContextRail).observe(lineTitle,{childList:true,subtree:true,characterData:true});
    }
    document.addEventListener('neumac:languagechange',h2SyncContextRail);
  }

  function ixBuild(){
    if(indexState.panel)return;
    var hdr=document.getElementById('hdr'); if(!hdr)return;

    var right=hdr.querySelector('.hdr-right');
    if(right&&!document.getElementById('hdrIndexBtn')){
      var indexBtn=document.createElement('button');
      indexBtn.type='button'; indexBtn.className='hdr-index-btn'; indexBtn.id='hdrIndexBtn';
      indexBtn.setAttribute('aria-haspopup','dialog'); indexBtn.setAttribute('aria-controls','globalIndex'); indexBtn.setAttribute('aria-expanded','false');
      indexBtn.innerHTML='<span class="hdr-index-glyph" aria-hidden="true"><i></i><i></i><i></i></span><span class="hdr-index-label">'+ixBi('Index','Índice')+'</span>';
      var contact=right.querySelector('.hdr-contact-btn');
      if(contact)right.insertBefore(indexBtn,contact); else right.appendChild(indexBtn);
    }

    var active=ixPageKey();
    var wrap=document.createElement('div');
    wrap.className='global-index global-index--h2'; wrap.id='globalIndex'; wrap.hidden=true; wrap.setAttribute('aria-hidden','true');
    wrap.innerHTML='\
      <div class="global-index__backdrop" id="globalIndexBackdrop" aria-hidden="true"></div>\
      <section class="global-index__surface" id="globalIndexSurface" role="dialog" aria-modal="true" aria-labelledby="globalIndexTitle" tabindex="-1">\
        <div class="global-index__mobile-head">\
          <a href="/" class="global-index__mobile-brand" aria-label="neumACt"><img src="/logo.svg" alt="neumACt"></a>\
          <button type="button" class="global-index__close global-index__close--mobile" data-index-close aria-label="Close / Cerrar"><span aria-hidden="true">×</span></button>\
        </div>\
        <div class="global-index__toolbar">\
          <p class="global-index__title" id="globalIndexTitle">'+ixBi('Index','Índice')+'</p>\
          <div class="global-index__toolbar-actions">\
            <button type="button" class="global-index__search-trigger" id="globalIndexSearchOpen">'+ixSearchSvg()+'<span>'+ixBi('Search neumACt…','Buscar en neumACt…')+'</span></button>\
            <button type="button" class="global-index__close" data-index-close aria-label="Close / Cerrar"><span aria-hidden="true">×</span></button>\
          </div>\
        </div>\
        <div class="global-index__index-view" id="globalIndexIndexView">\
          <nav class="global-index__chapters" aria-label="Site index">\
            <a href="/clinical/" class="global-index__chapter '+(active==='research'?'is-current':'')+'"><span class="global-index__chapter-no">01</span><span class="global-index__chapter-name">'+ixBi('Research','Investigación')+'</span></a>\
            <a href="/innovation/" class="global-index__chapter '+(active==='innovation'?'is-current':'')+'"><span class="global-index__chapter-no">02</span><span class="global-index__chapter-name">'+ixBi('Innovation','Innovación')+'</span></a>\
            <a href="/news/" class="global-index__chapter '+(active==='articles'?'is-current':'')+'"><span class="global-index__chapter-no">03</span><span class="global-index__chapter-name">'+ixBi('Publications','Publicaciones')+'</span></a>\
            <a href="/team/" class="global-index__chapter '+(active==='team'?'is-current':'')+'"><span class="global-index__chapter-no">04</span><span class="global-index__chapter-name">'+ixBi('Team','Equipo')+'</span></a>\
          </nav>\
          <section class="global-index__lines" aria-labelledby="globalIndexLinesTitle">\
            <div class="global-index__section-head">\
              <h2 id="globalIndexLinesTitle">'+ixBi('Research lines','Líneas de investigación')+'</h2>\
              <a href="/clinical/">'+ixBi('View research','Ver investigación')+'</a>\
            </div>\
            <div class="global-index__line-list" id="globalIndexLines"><div class="global-index__loading">'+ixBi('Loading research lines…','Cargando líneas de investigación…')+'</div></div>\
          </section>\
          <aside class="global-index__utilities">\
            <p class="global-index__utility-label">'+ixBi('Explore','Explorar')+'</p>\
            <button type="button" class="global-index__utility-link" data-open-index-search>'+ixBi('Search neumACt','Buscar en neumACt')+'</button>\
            <a class="global-index__utility-link" href="/#contact">'+ixBi('Contact','Contacto')+'</a>\
            <div class="global-index__latest" id="globalIndexLatest" hidden></div>\
            <div class="global-index__institutions" aria-label="Institutions">\
              <span>Área Sanitaria da Coruña e Cee</span><span>INIBIC</span><span>SERGAS</span>\
            </div>\
          </aside>\
        </div>\
        <div class="global-index__search-view" id="globalIndexSearchView" hidden>\
          <div class="global-search__head">\
            <button type="button" class="global-search__back" id="globalIndexSearchBack">← '+ixBi('Index','Índice')+'</button>\
            <p>'+ixBi('Search neumACt','Buscar en neumACt')+'</p>\
            <button type="button" class="global-index__close global-search__close" data-index-close aria-label="Close / Cerrar"><span aria-hidden="true">×</span></button>\
          </div>\
          <label class="global-search__field">\
            <span class="global-search__icon" aria-hidden="true">'+ixSearchSvg()+'</span>\
            <input id="globalIndexSearchInput" type="search" autocomplete="off" aria-label="Search neumACt / Buscar en neumACt" placeholder="Search research, people, publications…" data-placeholder-en="Search research, people, publications…" data-placeholder-es="Buscar investigación, personas, publicaciones…">\
          </label>\
          <div class="global-search__filters" id="globalIndexSearchFilters" role="group" aria-label="Search filters">\
            <button type="button" data-filter="all" class="is-active">'+ixBi('All','Todo')+'</button>\
            <button type="button" data-filter="research">'+ixBi('Research','Investigación')+'</button>\
            <button type="button" data-filter="people">'+ixBi('People','Personas')+'</button>\
            <button type="button" data-filter="articles">'+ixBi('Publications','Publicaciones')+'</button>\
            <button type="button" data-filter="innovation">'+ixBi('Innovation','Innovación')+'</button>\
          </div>\
          <div class="global-search__results" id="globalIndexSearchResults" aria-live="polite"></div>\
        </div>\
        <div class="global-index__footer">\
          <span>Área Sanitaria da Coruña e Cee</span><span aria-hidden="true">·</span><span>INIBIC</span><span aria-hidden="true">·</span><span>SERGAS</span>\
          <div class="global-index__footer-lang" role="radiogroup" aria-label="Language / Idioma">\
            <button class="lt-btn" data-lang="en" role="radio">EN</button><button class="lt-btn" data-lang="es" role="radio">ES</button>\
          </div>\
        </div>\
      </section>';
    hdr.after(wrap);
    indexState.panel=wrap;
    indexState.surface=wrap.querySelector('#globalIndexSurface');
    indexState.indexView=wrap.querySelector('#globalIndexIndexView');
    indexState.searchView=wrap.querySelector('#globalIndexSearchView');
    indexState.input=wrap.querySelector('#globalIndexSearchInput');
    indexState.results=wrap.querySelector('#globalIndexSearchResults');

    var idxBtn=document.getElementById('hdrIndexBtn');
    if(idxBtn)idxBtn.addEventListener('click',function(){indexState.open?ixClose(true):ixOpen('index',idxBtn);});
    wrap.querySelectorAll('[data-index-close]').forEach(function(btn){btn.addEventListener('click',function(){ixClose(true);});});
    wrap.querySelector('#globalIndexBackdrop').addEventListener('click',function(){ixClose(true);});
    wrap.querySelector('#globalIndexSearchOpen').addEventListener('click',function(){ixSetMode('search',true);});
    wrap.querySelectorAll('[data-open-index-search]').forEach(function(btn){btn.addEventListener('click',function(){ixSetMode('search',true);});});
    wrap.querySelector('#globalIndexSearchBack').addEventListener('click',function(){ixSetMode('index',true);});
    wrap.querySelector('#globalIndexSearchFilters').addEventListener('click',function(e){
      var b=e.target.closest('[data-filter]');if(!b)return;
      indexState.filter=b.dataset.filter||'all';
      wrap.querySelectorAll('#globalIndexSearchFilters [data-filter]').forEach(function(x){x.classList.toggle('is-active',x===b);});
      ixRenderSearch();
    });
    indexState.input.addEventListener('input',ixRenderSearch);
    wrap.addEventListener('click',function(e){if(e.target.closest('a[href]'))ixClose(false);});

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&indexState.open){e.preventDefault();ixClose(true);return;}
      if(e.key!=='Tab'||!indexState.open)return;
      var focusable=Array.prototype.slice.call(indexState.surface.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(function(el){return !el.hidden&&el.offsetParent!==null;});
      if(!focusable.length)return;
      var first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });
    document.addEventListener('neumac:languagechange',function(){ixSyncLanguage();ixRenderLines();ixRenderLatest();ixRenderSearch();});
    ixSyncLanguage();
  }

  function ixSyncLanguage(){
    if(!indexState.panel)return;
    var lang=root.dataset.lang||'en';
    if(indexState.input)indexState.input.placeholder=indexState.input.getAttribute('data-placeholder-'+lang)||'';
    indexState.panel.querySelectorAll('.global-index__footer-lang [data-lang]').forEach(function(btn){
      var on=btn.dataset.lang===lang;btn.classList.toggle('lt-btn--active',on);btn.setAttribute('aria-checked',String(on));
    });
  }

  function ixOpen(mode,trigger){
    ixBuild(); if(!indexState.panel)return;
    if(indexState.open&&mode===indexState.mode){return;}
    indexState.lastFocus=trigger||document.activeElement;
    indexState.panel.hidden=false;indexState.panel.setAttribute('aria-hidden','false');
    document.body.classList.add('is-index-open');
    indexState.open=true;
    var idxBtn=document.getElementById('hdrIndexBtn'); if(idxBtn)idxBtn.setAttribute('aria-expanded','true');
    var mob=document.getElementById('mobToggle'); if(mob)mob.setAttribute('aria-expanded','true');
    ixSetMode(mode||'index',false);
    requestAnimationFrame(function(){indexState.panel.classList.add('is-open');if(mode==='search'&&indexState.input)indexState.input.focus();else indexState.surface.focus({preventScroll:true});});
    ixLoadData();
  }
  function ixClose(restore){
    if(!indexState.panel||!indexState.open)return;
    indexState.panel.classList.remove('is-open');indexState.panel.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-index-open');indexState.open=false;
    var idxBtn=document.getElementById('hdrIndexBtn'); if(idxBtn)idxBtn.setAttribute('aria-expanded','false');
    var mob=document.getElementById('mobToggle'); if(mob)mob.setAttribute('aria-expanded','false');
    setTimeout(function(){if(indexState.panel&&!indexState.open)indexState.panel.hidden=true;},230);
    if(restore&&indexState.lastFocus&&document.contains(indexState.lastFocus)){try{indexState.lastFocus.focus({preventScroll:true});}catch(_e){}}
  }
  function ixSetMode(mode,focus){
    ixBuild();
    indexState.mode=mode==='search'?'search':'index';
    indexState.indexView.hidden=indexState.mode!=='index';
    indexState.searchView.hidden=indexState.mode!=='search';
    indexState.panel.classList.toggle('is-search',indexState.mode==='search');
    if(indexState.mode==='search'){
      ixLoadData();ixRenderSearch();
      if(focus&&indexState.input)requestAnimationFrame(function(){indexState.input.focus();});
    }else if(focus){requestAnimationFrame(function(){indexState.surface.focus({preventScroll:true});});}
  }

  function ixLineLabel(l){var pair=ixLinePair(l);return pair[root.dataset.lang==='es'?1:0]||pair[0]||'';}
  function ixRenderLines(){
    var host=document.getElementById('globalIndexLines');if(!host)return;
    if(!indexState.lines.length){host.innerHTML='<div class="global-index__loading">'+ixBi('Research lines are temporarily unavailable.','Las líneas de investigación no están disponibles temporalmente.')+'</div>';return;}
    host.innerHTML=indexState.lines.map(function(l){return '<a class="global-index__line" href="/line/?id='+encodeURIComponent(l.id)+'"><strong>'+ixEsc(ixLineLabel(l))+'</strong></a>';}).join('');
  }
  function ixRenderLatest(){
    var host=document.getElementById('globalIndexLatest');if(!host)return;
    var p=indexState.posts[0];if(!p){host.hidden=true;return;}
    var when=p.published_at||p.created_at||'';
    var d='';try{d=when?new Intl.DateTimeFormat(root.dataset.lang==='es'?'es-ES':'en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(when)):'';}catch(_e){}
    host.hidden=false;
    host.innerHTML='<p>'+ixBi('Latest publication','Última publicación')+'</p><a href="/news/?post='+encodeURIComponent(p.id)+'"><strong>'+ixEsc(p.title||'')+'</strong>'+(d?'<span>'+ixEsc(d)+'</span>':'')+'</a>';
  }
  function ixLoadData(){
    if(indexState.loaded||indexState.loading)return;
    indexState.loading=true;
    Promise.allSettled([
      ixApi('/api/research-lines/website'),
      ixApi('/api/team/website'),
      ixApi('/api/news/website?limit=24'),
      ixApi('/api/innovation-projects/website')
    ]).then(function(res){
      indexState.lines=res[0].status==='fulfilled'?((res[0].value&&res[0].value.data)||[]):[];
      indexState.people=res[1].status==='fulfilled'?((res[1].value&&res[1].value.data)||[]):[];
      indexState.posts=res[2].status==='fulfilled'?((res[2].value&&res[2].value.data)||[]):[];
      indexState.projects=res[3].status==='fulfilled'?((res[3].value&&res[3].value.data)||[]):[];
      indexState.lines.sort(function(a,b){return Number(a.line_number||0)-Number(b.line_number||0);});
      indexState.posts.sort(function(a,b){return new Date(b.published_at||b.created_at||0)-new Date(a.published_at||a.created_at||0);});
      indexState.loaded=true;indexState.loading=false;
      ixRenderLines();ixRenderLatest();ixRenderSearch();
    });
  }
  function ixSearchItems(){
    var items=[
      {type:'research',code:'01',title:['Research','Investigación'],sub:['Research overview','Resumen de investigación'],href:'/clinical/',keywords:''},
      {type:'innovation',code:'02',title:['Innovation','Innovación'],sub:['Clinical innovation projects','Proyectos de innovación clínica'],href:'/innovation/',keywords:''},
      {type:'articles',code:'03',title:['Publications','Publicaciones'],sub:['Scientific publications, articles and updates','Publicaciones científicas, artículos y actualizaciones'],href:'/news/',keywords:''},
      {type:'people',code:'04',title:['Team','Equipo'],sub:['Multidisciplinary team','Equipo multidisciplinar'],href:'/team/',keywords:''}
    ];
    indexState.lines.forEach(function(l){var pair=ixLinePair(l);items.push({type:'research',code:'',title:pair,sub:['Research line','Línea de investigación'],href:'/line/?id='+encodeURIComponent(l.id),keywords:pair.join(' ')+' L'+String(l.line_number||'').padStart(2,'0')});});
    indexState.people.forEach(function(p){var n=p.display_name||p.full_name||'';if(!n)return;var role=ixPersonRolePair(p);items.push({type:'people',code:'Person',title:[n,n],sub:role,href:'/team/?person='+ixSlug(n),keywords:[role[0],role[1],p.specialization||'',p.primary_dept_name||''].join(' ')});});
    indexState.posts.slice(0,30).forEach(function(p){if(!p.title)return;items.push({type:'articles',code:(p.post_type||'article'),title:[p.title,p.title],sub:['Publication / article','Publicación / artículo'],href:'/news/?post='+encodeURIComponent(p.id),keywords:String(p.excerpt||p.summary||'')});});
    indexState.projects.forEach(function(p){var title=ixProjectPair(p,'title');if(!title[0]&&!title[1])return;var desc=ixProjectPair(p,'description');items.push({type:'innovation',code:'INN',title:title,sub:['Innovation project','Proyecto de innovación'],href:'/innovation/',keywords:[desc[0],desc[1],ixReadLocalized(p,'category','en'),ixReadLocalized(p,'category','es')].join(' ')});});
    return items;
  }

  function ixRenderSearch(){
    if(!indexState.results)return;
    var q=(indexState.input?indexState.input.value:'').trim().toLowerCase();
    if(!q){
      indexState.results.innerHTML='<div class="global-search__prompt"><strong>'+ixBi('Research · People · Publications · Innovation','Investigación · Personas · Publicaciones · Innovación')+'</strong><p>'+ixBi('Type a name, topic or DOI.','Escriba un nombre, tema o DOI.')+'</p></div>';
      return;
    }
    var lang=root.dataset.lang==='es'?1:0;
    var hits=ixSearchItems().filter(function(it){
      if(indexState.filter!=='all'&&it.type!==indexState.filter)return false;
      return (it.title[lang]+' '+it.title[0]+' '+it.title[1]+' '+it.sub[lang]+' '+it.sub[0]+' '+it.sub[1]+' '+it.code+' '+(it.keywords||'')).toLowerCase().indexOf(q)>-1;
    }).slice(0,14);
    indexState.results.innerHTML=hits.length?hits.map(function(it){return '<a class="global-search__result'+(!it.code?' global-search__result--no-code':'')+'" href="'+ixEsc(it.href)+'">'+(it.code?'<span class="global-search__result-code">'+ixEsc(it.code)+'</span>':'')+'<span><strong>'+ixEsc(it.title[lang])+'</strong><small>'+ixEsc(it.sub[lang])+'</small></span></a>';}).join(''):'<div class="global-search__prompt"><strong>'+ixBi('No matches','Sin resultados')+'</strong><p>'+ixBi('Try another name or topic.','Pruebe otro nombre o tema.')+'</p></div>';
  }

  function normalizePublicationsLabel(){
    document.querySelectorAll('a[href="/news/"]').forEach(function(a){
      var en=a.querySelector('[lang="en"]');
      var es=a.querySelector('[lang="es"]');
      if(en)en.textContent='Publications';
      if(es)es.textContent='Publicaciones';
    });
  }

  function initEditorialIndex(){
    h2BuildMasthead();
    ixBuild();
    if(!indexState.panel)return;
    var mob=document.getElementById('mobToggle');
    if(mob){
      mob.setAttribute('aria-controls','globalIndex');
      mob.setAttribute('aria-label','Open index / Abrir índice');
    }
    window.neumACIndex={
      open:function(){ixOpen('index',document.getElementById('hdrIndexBtn')||document.getElementById('mobToggle'));},
      openSearch:function(){ixOpen('search',document.getElementById('hdrSearchBtn'));},
      close:function(){ixClose(true);},
      isOpen:function(){return indexState.open;}
    };
    /* Canonical readiness signal for bounded enhancement layers.
       Avoids making secondary scripts guess when the Index DOM exists. */
    document.dispatchEvent(new CustomEvent('neumac:indexready'));
  }

  function openGlobalSearch(){
    if(window.neumACIndex&&window.neumACIndex.openSearch)window.neumACIndex.openSearch();
    else openPalette();
  }

  function drawerParts(){
    return {
      toggle:document.getElementById('mobToggle'),
      drawer:document.getElementById('mobDrawer'),
      overlay:document.getElementById('mobOverlay'),
      close:document.getElementById('mobClose')
    };
  }
  function openDrawer(){
    if(window.innerWidth<=INDEX_BREAKPOINT&&window.neumACIndex){window.neumACIndex.open();return;}
    var p=drawerParts(); if(!p.drawer)return;
    p.drawer.classList.add('open');
    if(p.overlay)p.overlay.classList.add('open');
    if(p.toggle){p.toggle.classList.add('open');p.toggle.setAttribute('aria-expanded','true');}
    document.body.classList.add('is-drawer-open');
    closeLangMenu();
  }
  function closeDrawer(){
    if(window.neumACIndex&&window.neumACIndex.isOpen&&window.neumACIndex.isOpen()){window.neumACIndex.close();return;}
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
      if(window.innerWidth<=INDEX_BREAKPOINT&&window.neumACIndex){
        if(window.neumACIndex.isOpen&&window.neumACIndex.isOpen())window.neumACIndex.close();else window.neumACIndex.open();
        return;
      }
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
        hdr.classList.toggle('hdr--context-compact',y>120);
        document.body.classList.toggle('has-scrolled-masthead',y>40);
        document.body.classList.toggle('has-compact-masthead',y>120);
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
    normalizePublicationsLabel();
    initEditorialIndex();
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
    var signature = nav && nav.querySelector('.hdr-nav-signature');
    if (!nav || (!pill && !signature)) return;

    function moveTo(el){
      if (!el) return;
      var navRect = nav.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      var x = r.left - navRect.left;
      if(pill){
        pill.style.transform = 'translateY(-50%) translateX(' + x + 'px) scaleX(' + r.width + ')';
        pill.style.opacity = '1';
      }
      if(signature){
        var sigWidth=Math.max(24,Math.min(42,r.width*.38));
        var sigX=x+(r.width-sigWidth)/2;
        signature.style.width=sigWidth+'px';
        signature.style.transform='translateX('+sigX+'px)';
        signature.style.opacity='1';
      }
    }
    function reset(){
      var current = nav.querySelector('.hdr-nav-link[data-current="true"]');
      if (current) moveTo(current);
      else {
        if(pill)pill.style.opacity='0';
        if(signature)signature.style.opacity='0';
      }
    }

    nav.querySelectorAll('.hdr-nav-link').forEach(function(link){
      link.addEventListener('mouseenter', function(){ moveTo(link); });
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
        e.preventDefault(); openGlobalSearch(); return;
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
    if(searchBtn) searchBtn.addEventListener('click', openGlobalSearch);
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
      '<dt><kbd>g a</kbd></dt><dd>Publications</dd>' +
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
    {k:'page', t:'Publications · Publicaciones', href:'/news/'},
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
    initNavPill();
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
