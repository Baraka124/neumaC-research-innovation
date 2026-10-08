/* Phase 4: extracted page-specific runtime */
(function(){
  var year = new URLSearchParams(location.search).get('year') || String(new Date().getFullYear());
  document.getElementById('rptYear').textContent = year;
  document.title = 'Annual Report ' + year + ' | neumACt R&I';
  var API = window.NEUMAC_CONFIG.apiBase;
  function j(u){ return fetch(API+u).then(function(r){ return r.json(); }); }
  j('/api/research-lines/website').then(function(res){
    var d = res.data||[];
    document.getElementById('rptLines').textContent = d.length || '—';
    var t = d.reduce(function(s,l){ return s+(l.active_trials||0); },0);
    document.getElementById('rptTrials').textContent = t ? t+'+' : '—';
  }).catch(function(){});
  j('/api/team/website').then(function(res){
    document.getElementById('rptMembers').textContent = (res.data||[]).length || '—';
  }).catch(function(){});
  j('/api/news/website?type=publication&limit=30').then(function(res){
    var pubs = (res.data||[]).filter(function(p){
      var d = p.published_at || p.created_at;
      return d && String(new Date(d).getFullYear()) === year;
    });
    document.getElementById('rptPubs').textContent = pubs.length;
    var ol = document.getElementById('rptPubList');
    if(!pubs.length){
      ol.innerHTML = '<li class="report-empty"><span lang="en">No publications recorded for '+year+' yet.</span><span lang="es">Aún no hay publicaciones registradas en '+year+'.</span></li>';
      return;
    }
    function esc(s){ var d=document.createElement('div'); d.textContent=s==null?'':String(s); return d.innerHTML; }
    ol.innerHTML = pubs.map(function(p){
      return '<li>'+esc(p.title||'')+
        (p.journal ? ' <span class="rp-j">'+esc(p.journal)+'</span>' : '')+
        (p.authors ? '<span class="rp-a">'+esc(p.authors)+'</span>' : '')+'</li>';
    }).join('');
  }).catch(function(){
    document.getElementById('rptPubList').innerHTML='<li class="report-empty">Data unavailable.</li>';
  });
  function txt(p,key){ var en=p[key+'_en']; if(en!=null&&String(en).trim())return String(en).trim(); var v=p[key]; if(v&&typeof v==='object'&&v.en)return String(v.en).trim(); return (v!=null&&typeof v!=='object')?String(v).trim():''; }
  j('/api/innovation-projects/website').then(function(res){
    var projects = (res.data||[]).filter(Boolean);
    document.getElementById('rptProjects').textContent = projects.length || '—';
    var ol = document.getElementById('rptProjectList');
    if(!projects.length){
      ol.innerHTML = '<li class="report-empty"><span lang="en">No public innovation projects recorded yet.</span><span lang="es">Aún no hay proyectos públicos de innovación.</span></li>';
      return;
    }
    function esc(s){ var d=document.createElement('div'); d.textContent=s==null?'':String(s); return d.innerHTML; }
    projects.sort(function(a,b){ return (b.is_featured?1:0)-(a.is_featured?1:0); });
    ol.innerHTML = projects.map(function(p){
      var title = txt(p,'title') || 'Innovation project';
      var stage = txt(p,'development_stage') || txt(p,'current_stage');
      var category = txt(p,'category');
      return '<li>'+esc(title)+
        (stage ? ' <span class="rp-j">'+esc(stage)+'</span>' : '')+
        (category ? '<span class="rp-a">'+esc(category)+'</span>' : '')+'</li>';
    }).join('');
  }).catch(function(){
    var ol=document.getElementById('rptProjectList'); if(ol) ol.innerHTML='<li class="report-empty">Data unavailable.</li>';
  });
})();
