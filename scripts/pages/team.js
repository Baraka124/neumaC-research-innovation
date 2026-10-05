/* neumACt Team — Phase 7.12 final editorial convergence
   Public data stays authoritative. Leadership and coordination are roles inside
   one multidisciplinary team; the complete public roster remains first-class. */
(function(){
  'use strict';

  const PI_ID='c290a7e5-7bea-4652-a0ef-251fbc73184d';
  const portraitOverrides={
    'c290a7e5-7bea-4652-a0ef-251fbc73184d':'/assets/research/pi-pedro-marcos.jpg',
    '09ed9240-9442-4b80-ba12-8205724039f4':'/assets/research/coordinators/marina-blanco-aparicio.jpg',
    'e1cbfedb-a355-49f2-ba07-77f3bf81215c':'/assets/research/coordinators/angelica-consuegra-vanegas.jpg'
  };
  const roleLabels={
    attending_physician:['Physician','Médico/a'],
    specialist_physician:['Physician','Médico/a'],
    primary_care_physician:['Primary care physician','Médico/a de atención primaria'],
    medical_resident:['Resident physician','Médico/a residente'],
    fellow:['Research fellow','Investigador/a en formación'],
    researcher:['Researcher','Investigador/a'],
    research_scientist:['Research scientist','Personal investigador'],
    biologist:['Biologist','Biólogo/a'],
    nurse:['Nurse','Enfermero/a'],
    nurse_practitioner:['Nurse','Enfermero/a'],
    research_nurse:['Research nurse','Enfermero/a de investigación'],
    studies_coordinator:['Study coordinator','Coordinador/a de estudios'],
    clinical_research_coordinator:['Clinical research coordinator','Coordinador/a de investigación clínica'],
    data_manager:['Data manager','Gestor/a de datos'],
    labtech:['Laboratory technician','Técnico/a de laboratorio'],
    biomedical_engineer:['Biomedical engineer','Ingeniero/a biomédico/a'],
    computer_scientist:['Computer scientist','Profesional de informática'],
    data_scientist:['Data science','Ciencia de datos'],
    administrator:['Research administration','Administración de investigación']
  };


  const specialtyLabels={
    'neumología':['Pulmonology','Neumología'],
    'neumologia':['Pulmonology','Neumología'],
    'pulmonology':['Pulmonology','Neumología'],
    'cirugía torácica':['Thoracic Surgery','Cirugía Torácica'],
    'cirugia toracica':['Thoracic Surgery','Cirugía Torácica'],
    'thoracic surgery':['Thoracic Surgery','Cirugía Torácica'],
    'medicina de familia':['Family Medicine','Medicina de Familia'],
    'family medicine':['Family Medicine','Medicina de Familia'],
    'medicina interna':['Internal Medicine','Medicina Interna'],
    'internal medicine':['Internal Medicine','Medicina Interna'],
    'cardiología':['Cardiology','Cardiología'],
    'cardiologia':['Cardiology','Cardiología'],
    'cardiology':['Cardiology','Cardiología'],
    'radiología':['Radiology','Radiología'],
    'radiologia':['Radiology','Radiología'],
    'radiology':['Radiology','Radiología']
  };
  const lineLabels={
    1:['Transplantation, Pulmonary Hypertension & Diffuse Lung Disease','Trasplante, Hipertensión y Enfermedad Difusa Pulmonar'],
    2:['Airway Diseases','Enfermedades de la Vía Aérea'],
    3:['Interventional Pulmonology & Lung Cancer','Neumología Intervencionista y Cáncer de Pulmón'],
    4:['Respiratory Failure, Critical Care & Sleep Medicine','Insuficiencia Respiratoria, Cuidados Críticos y Medicina del Sueño'],
    5:['Innovation in Thoracic Surgery','Innovación en Cirugía Torácica'],
    6:['Personalised Respiratory Medicine, Management & Clinical Innovation','Medicina Respiratoria Personalizada, Gestión e Innovación Clínica']
  };

  const state={people:[],lines:[],memberships:new Map(),rosterPeople:[],profilePeople:[],activePersonId:null,lastProfileTrigger:null,profileCloseTimer:null,historyGuard:false};
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const bi=(en,es)=>`<span lang="en">${esc(en)}</span><span lang="es">${esc(es)}</span>`;
  const nameOf=p=>p?.display_name||p?.full_name||'';
  const initials=name=>String(name||'').replace(/\b(?:Dra|Dr|Prof)\.?\s*/gi,'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'—';

  const slugifyName=name=>String(name||'').replace(/\b(?:Dra|Dr|Prof)\.?\s*/gi,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

  function safeUrl(value){
    const raw=String(value||'').trim();
    if(!raw)return '';
    if(raw.startsWith('/'))return raw;
    try{const u=new URL(raw,location.origin);return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}
  }
  function documentaryPhotoUrl(p){return safeUrl(portraitOverrides[p?.id]||p?.public_photo_url||'');}
  function photoUrl(p){return documentaryPhotoUrl(p);}
  function hasDocumentaryPhoto(p){return Boolean(documentaryPhotoUrl(p));}
  function rolePair(p){
    if(roleLabels[p?.staff_type])return roleLabels[p.staff_type];
    const raw=String(p?.public_role||p?.specialization||'').trim();
    return raw?[raw,raw]:['Research team','Equipo de investigación'];
  }
  function specialtyPair(value){
    const raw=String(value||'').trim();
    if(!raw)return null;
    return specialtyLabels[raw.toLowerCase()]||[raw,raw];
  }
  function affiliationPair(value){
    const raw=String(value||'').trim();
    if(!raw)return null;
    if(/^(department of pulmonology|pulmonology department|servicio de neumolog[ií]a)$/i.test(raw))return ['Department of Pulmonology','Servicio de Neumología'];
    if(/primary care/i.test(raw)||/atenci[oó]n primaria/i.test(raw))return ['Primary Care','Atención Primaria'];
    return [raw,raw];
  }
  function lineNamePair(line){
    if(!line)return ['',''];
    const number=Number(line.line_number||0);
    const mapped=lineLabels[number];
    if(mapped)return mapped;
    const en=String(line.short_name_en||line.name_en||line.short_name||line.name||'').trim();
    const es=String(line.short_name_es||line.name_es||line.short_name||line.name||'').trim();
    return [en,es];
  }

  function bioPair(person){
    const raw=String(person?.public_bio||'').trim();
    const en=String(person?.public_bio_en||person?.bio_en||'').trim();
    const es=String(person?.public_bio_es||person?.bio_es||'').trim();
    if(en||es)return [en||raw||es,es||raw||en];
    return raw?[raw,raw]:null;
  }
  function scholarLinks(person){
    const links=[];
    const orcidRaw=String(person?.orcid_id||'').trim();
    if(orcidRaw){
      const orcidUrl=safeUrl(/^https?:\/\//i.test(orcidRaw)?orcidRaw:`https://orcid.org/${orcidRaw}`);
      if(orcidUrl)links.push({label:'ORCID',url:orcidUrl});
    }
    const scholar=safeUrl(person?.scholar_url||'');
    if(scholar)links.push({label:'Google Scholar',url:scholar});
    const pubmed=safeUrl(person?.pubmed_url||'');
    if(pubmed)links.push({label:'PubMed',url:pubmed});
    const webOfScience=safeUrl(person?.web_of_science_url||person?.researcher_id_url||'');
    if(webOfScience)links.push({label:'Web of Science',url:webOfScience});
    const institutional=safeUrl(person?.institutional_profile_url||'');
    if(institutional)links.push({label:'Institutional profile',url:institutional});
    const researchgate=safeUrl(person?.researchgate_url||'');
    if(researchgate)links.push({label:'ResearchGate',url:researchgate});
    return links;
  }
  function publicItems(...values){
    const raw=values.flatMap(value=>Array.isArray(value)?value:(value?[value]:[]));
    return raw.filter(item=>item&&(
      typeof item!=='object' ||
      (
        (!item.visibility || item.visibility==='approved_public') &&
        (!item.person_approval || item.person_approval==='approved')
      )
    ));
  }

  function itemPair(item){
    if(item==null)return null;
    if(typeof item==='string'||typeof item==='number'){
      const value=String(item).trim();
      return value?[value,value]:null;
    }
    if(typeof item!=='object')return null;
    const source=item.label||item.title||item.name||item.description||item.value||'';
    if(source&&typeof source==='object'){
      const en=String(source.en||source.english||source.es||'').trim();
      const es=String(source.es||source.spanish||source.en||'').trim();
      return en||es?[en||es,es||en]:null;
    }
    const en=String(item.label_en||item.title_en||item.name_en||item.description_en||source||item.label_es||item.title_es||'').trim();
    const es=String(item.label_es||item.title_es||item.name_es||item.description_es||source||item.label_en||item.title_en||'').trim();
    return en||es?[en||es,es||en]:null;
  }

  function evidenceList(items){
    const rows=publicItems(...items).map(item=>{
      const pair=itemPair(item);
      if(!pair)return '';
      const meta=typeof item==='object'?[item.organisation,item.role,item.period,item.year].filter(Boolean).join(' · '):'';
      return `<li class="team-profile__evidence-item"><span>${bi(pair[0],pair[1])}</span>${meta?`<small>${esc(meta)}</small>`:''}</li>`;
    }).filter(Boolean);
    return rows.length?`<ul class="team-profile__evidence-list">${rows.join('')}</ul>`:'';
  }

  function professionalEvidence(person){
    return {
      expertise:publicItems(person?.clinical_expertise,person?.expertise_areas,person?.areas_of_expertise,person?.clinical_domains),
      current:publicItems(person?.professional_contributions,person?.current_contributions,person?.clinical_contributions,person?.public_contributions),
      scientific:publicItems(person?.scientific_contributions,person?.research_contributions,person?.innovation_contributions),
      networks:publicItems(person?.professional_networks,person?.scientific_networks,person?.society_roles,person?.network_roles)
    };
  }

  function leadershipEvidence(person){
    const items=publicItems(person?.leadership_roles);
    if(person?.coordinates_line){
      const line=lineForCoordinator(person)||person.coordinates_line;
      const pair=lineNamePair(line);
      items.unshift({
        label:{en:`Coordinates research line: ${pair[0]}`,es:`Coordina la línea de investigación: ${pair[1]}`},
        type:'research_line_coordination',
        line_id:line?.id
      });
    }
    if(person?.is_chief_of_department){
      items.unshift({
        label:{en:'Department leadership · Respiratory Medicine',es:'Dirección de servicio · Neumología'},
        type:'department_leadership'
      });
    }
    return items;
  }

  function researchFootprint(person){
    const fp=person?.research_footprint;
    if(!fp||typeof fp!=='object')return '';
    if(fp.visibility&&fp.visibility!=='approved_public')return '';
    if(fp.person_approval&&fp.person_approval!=='approved')return '';
    const metrics=[
      fp.publications!=null?['Publications','Publicaciones',fp.publications]:null,
      fp.citations!=null?['Citations','Citas',fp.citations]:null,
      fp.h_index!=null?['h-index','Índice h',fp.h_index]:null
    ].filter(Boolean);
    if(!metrics.length)return '';
    return `<div class="team-profile__metrics">${metrics.map(m=>`<div><strong>${esc(m[2])}</strong><span>${bi(m[0],m[1])}</span></div>`).join('')}</div>
      ${fp.source||fp.verified_at?`<p class="team-profile__metric-source">${esc([fp.source,fp.verified_at].filter(Boolean).join(' · '))}</p>`:''}`;
  }

  function rosterPortrait(person){
    const src=photoUrl(person),ini=initials(nameOf(person));
    const pid=esc(person?.id||'');
    const documentary=hasDocumentaryPhoto(person);
    if(src)return `<span class="team-person__portrait media-photo-frame has-photo${documentary?'':' is-placeholder'}" data-media-kind="${documentary?'documentary':'placeholder'}" data-person-id="${pid}" aria-hidden="true"><img class="media-photo ${documentary?'media-photo--documentary':'media-photo--placeholder'}" src="${esc(src)}" alt="" loading="lazy" decoding="async" onerror="this.parentElement.classList.remove('has-photo');this.parentElement.classList.add('team-person__portrait--initials');this.parentElement.innerHTML='<span>${esc(ini)}</span>'"></span>`;
    return `<span class="team-person__portrait team-person__portrait--initials" data-media-kind="initials" data-person-id="${pid}" aria-hidden="true"><span>${esc(ini)}</span></span>`;
  }
  function profilePortrait(person){
    const src=photoUrl(person),ini=initials(nameOf(person));
    const documentary=hasDocumentaryPhoto(person);
    if(src)return `<figure class="team-profile__portrait media-photo-frame has-photo${documentary?'':' is-placeholder'}" data-media-kind="${documentary?'documentary':'placeholder'}" data-person-id="${esc(person?.id||'')}"${documentary?'':` aria-hidden="true"`}><img class="media-photo ${documentary?'media-photo--documentary':'media-photo--placeholder'}" src="${esc(src)}" alt="${documentary?esc(nameOf(person)):''}" decoding="async" onerror="this.parentElement.classList.remove('has-photo');this.parentElement.classList.add('team-profile__portrait--initials');this.parentElement.innerHTML='<span>${esc(ini)}</span>'"></figure>`;
    return `<div class="team-profile__portrait team-profile__portrait--initials" data-media-kind="initials" data-person-id="${esc(person?.id||'')}" aria-hidden="true"><span>${esc(ini)}</span></div>`;
  }

  function syncMediaLanguage(lang=document.documentElement.dataset.lang||'en'){
    const img=$('teamHeroImage');
    if(img)img.alt=img.dataset[lang==='es'?'altEs':'altEn']||img.alt;
    const fig=$('teamVisualHero');
    if(fig)fig.setAttribute('aria-label',fig.dataset[lang==='es'?'labelEs':'labelEn']||fig.getAttribute('aria-label')||'');
  }
  function lineForCoordinator(p){
    if(!p?.coordinates_line)return null;
    return state.lines.find(l=>l.id===p.coordinates_line.id)||p.coordinates_line;
  }
  function addRelation(personId,line){
    if(!personId||!line?.id)return;
    if(!state.memberships.has(personId))state.memberships.set(personId,new Map());
    state.memberships.get(personId).set(line.id,line);
  }
  function personLines(personId){
    return [...(state.memberships.get(personId)||new Map()).values()].sort((a,b)=>(a.line_number||99)-(b.line_number||99));
  }
  function portrait(p,cls,lazy=true){
    const src=photoUrl(p),ini=initials(nameOf(p));
    const pid=esc(p?.id||'');
    if(src)return `<figure class="${cls} media-photo-frame has-photo" data-media-kind="documentary" data-person-id="${pid}"><img class="media-photo media-photo--documentary" src="${esc(src)}" alt="${esc(nameOf(p))}" ${lazy?'loading="lazy"':'loading="eager"'} decoding="async" onerror="this.parentElement.classList.remove('has-photo');this.parentElement.classList.add('${cls}--initials');this.parentElement.innerHTML='${esc(ini)}'"></figure>`;
    return `<div class="${cls} ${cls}--initials" data-media-kind="initials" data-person-id="${pid}" aria-hidden="true"><span>${esc(ini)}</span></div>`;
  }

  function renderLeadership(){
    const host=$('teamLeadership'); if(!host)return;
    const pi=state.people.find(p=>p.id===PI_ID)||state.people.find(p=>p.is_chief_of_department)||state.people.find(p=>p.can_be_pi)||state.people[0];
    if(!pi){host.innerHTML=`<div class="team-empty state-panel"><span class="state-panel__label">${bi('Public information','Información pública')}</span><h3 class="state-panel__title">${bi('Scientific leadership is not currently available.','La dirección científica no está disponible en este momento.')}</h3></div>`;return;}
    const line=lineForCoordinator(pi);
    host.innerHTML=`<article class="team-lead">
      ${portrait(pi,'team-lead__portrait',false)}
      <div class="team-lead__body">
        <h3>${esc(nameOf(pi))}</h3>
        <p class="team-lead__role">${bi('Principal Investigator · neumACt','Investigador principal · neumACt')}</p>
        <p class="team-lead__position">${bi('Head of Respiratory Medicine · Área Sanitaria da Coruña e Cee','Jefe de Servicio de Neumología · Área Sanitaria da Coruña e Cee')}</p>
        <p class="team-lead__bio">${bi('His work includes precision respiratory medicine, rare respiratory diseases, clinical research and innovation applied to care.','Su actividad incluye medicina respiratoria de precisión, enfermedades respiratorias raras, investigación clínica e innovación aplicada a la asistencia.')}</p>
        ${line?.id?`<a class="team-inline-link" href="/line/?id=${encodeURIComponent(line.id)}">${bi('View coordinated research line','Ver línea de investigación coordinada')} <span aria-hidden="true">→</span></a>`:''}
        <button type="button" class="team-inline-link team-profile-launch" data-profile-id="${esc(pi.id)}">${bi('Professional profile','Perfil profesional')} <span aria-hidden="true">→</span></button>
      </div>
    </article>`;
  }

  function renderCoordinators(){
    const host=$('teamCoordinators'); if(!host)return;
    const coords=state.people.filter(p=>p.coordinates_line).sort((a,b)=>(a.coordinates_line?.line_number||99)-(b.coordinates_line?.line_number||99));
    if(!coords.length){host.innerHTML=`<div class="state-panel"><span class="state-panel__label">${bi('Public information','Información pública')}</span><h3 class="state-panel__title">${bi('Research-line coordinators are not currently available.','La coordinación de las líneas no está disponible en este momento.')}</h3></div>`;return;}
    host.innerHTML=coords.map(p=>{
      const line=lineForCoordinator(p)||{};
      const role=rolePair(p);
      const spec=specialtyPair(p.specialization);
      const lineName=lineNamePair(line);
      return `<article class="team-coordinator" data-line-number="${esc(line.line_number||'')}">
        <span class="team-coordinator__index" aria-hidden="true">L${String(line.line_number||'').padStart(2,'0')}</span>
        ${portrait(p,'team-coordinator__portrait')}
        <div class="team-coordinator__body">
          <h3>${esc(nameOf(p))}</h3>
          <p class="team-coordinator__role">${spec?bi(spec[0],spec[1]):bi(role[0],role[1])}</p>
          <p class="team-coordinator__line-name">${bi(lineName[0],lineName[1])}</p>
          ${line.id?`<a class="team-inline-link" href="/line/?id=${encodeURIComponent(line.id)}">${bi('View research line','Ver línea de investigación')}</a>`:''}
          <button type="button" class="team-inline-link team-profile-launch" data-profile-id="${esc(p.id)}">${bi('Professional profile','Perfil profesional')} <span aria-hidden="true">→</span></button>
        </div>
      </article>`;
    }).join('');
  }

  function renderRoster(){
    const host=$('teamRoster'); if(!host)return;

    // Programme leadership and named research-line coordinators are rendered once
    // in the sections above. The roster below is the remaining multidisciplinary
    // team, so those same people must not be duplicated here.
    const roleIds=new Set([
      PI_ID,
      ...state.people.filter(p=>p?.coordinates_line).map(p=>p.id)
    ]);
    const people=state.people
      .filter(p=>!roleIds.has(p.id))
      .sort((a,b)=>{
        const aBaraka=slugifyName(nameOf(a))==='baraka-laiza';
        const bBaraka=slugifyName(nameOf(b))==='baraka-laiza';
        if(aBaraka!==bBaraka)return aBaraka?1:-1;
        return nameOf(a).localeCompare(nameOf(b),undefined,{sensitivity:'base'});
      });
    state.rosterPeople=people;

    if(!people.length){host.innerHTML=`<div class="team-roster__empty state-panel"><span class="state-panel__label">${bi('Team directory','Directorio del equipo')}</span><h3 class="state-panel__title">${bi('No additional public profiles are available yet.','Todavía no hay perfiles públicos adicionales disponibles.')}</h3></div>`;return;}
    host.innerHTML=people.map(p=>{
      const role=rolePair(p);
      const spec=specialtyPair(p.specialization);
      const affiliation=affiliationPair(p.primary_dept_name);
      return `<article class="team-person">
        <button class="team-person__open" type="button" data-profile-id="${esc(p.id)}" aria-haspopup="dialog" aria-controls="teamProfileSheet">
          ${rosterPortrait(p)}
          <span class="team-person__body">
            <span class="team-person__name">${esc(nameOf(p))}</span>
            <span class="team-person__role">${bi(role[0],role[1])}${spec?` · ${bi(spec[0],spec[1])}`:''}</span>
            ${affiliation?`<span class="team-person__affiliation">${bi(affiliation[0],affiliation[1])}</span>`:''}
            <span class="team-person__view">${bi('View profile','Ver perfil')} <span aria-hidden="true">→</span></span>
          </span>
        </button>
      </article>`;
    }).join('');
  }

  function professionalFacts(person){
    const facts=[];
    const role=rolePair(person);
    const spec=specialtyPair(person.specialization);
    const affiliation=affiliationPair(person.primary_dept_name);
    if(role?.[0]||role?.[1])facts.push({label:['Professional role','Función profesional'],value:role});
    if(spec?.[0]||spec?.[1]){
      const sameRole=(spec[0]===role?.[0]&&spec[1]===role?.[1]);
      if(!sameRole)facts.push({label:['Specialty / discipline','Especialidad / disciplina'],value:spec});
    }
    if(affiliation?.[0]||affiliation?.[1])facts.push({label:['Service / affiliation','Servicio / afiliación'],value:affiliation});
    return facts;
  }

  function profilePosition(person){
    const index=state.profilePeople.findIndex(p=>p.id===person?.id);
    if(index<0)return {index:-1,previous:null,next:null};
    return {
      index,
      previous:index>0?state.profilePeople[index-1]:null,
      next:index<state.profilePeople.length-1?state.profilePeople[index+1]:null
    };
  }

  function profileNavigation(person){
    const pos=profilePosition(person);
    if(pos.index<0||state.profilePeople.length<2)return '';
    const prev=pos.previous;
    const next=pos.next;
    return `<nav class="team-profile__person-nav" aria-label="${document.documentElement.dataset.lang==='es'?'Navegar entre perfiles':'Navigate team profiles'}">
      <button type="button" class="team-profile__person-nav-btn team-profile__person-nav-btn--prev" ${prev?`data-profile-nav="${esc(prev.id)}"`:'disabled'}>
        <span class="team-profile__person-nav-direction">${bi('Previous','Anterior')}</span>
        <span class="team-profile__person-nav-name">${prev?esc(nameOf(prev)):'—'}</span>
      </button>
      <span class="team-profile__person-nav-count">${pos.index+1} / ${state.profilePeople.length}</span>
      <button type="button" class="team-profile__person-nav-btn team-profile__person-nav-btn--next" ${next?`data-profile-nav="${esc(next.id)}"`:'disabled'}>
        <span class="team-profile__person-nav-direction">${bi('Next','Siguiente')}</span>
        <span class="team-profile__person-nav-name">${next?esc(nameOf(next)):'—'}</span>
      </button>
    </nav>`;
  }

  function renderProfile(person){
    const content=$('teamProfileContent'); if(!content||!person)return;
    const role=rolePair(person);
    const spec=specialtyPair(person.specialization);
    const affiliation=affiliationPair(person.primary_dept_name);
    const bio=bioPair(person);
    const lines=personLines(person.id);
    const links=scholarLinks(person);
    const facts=professionalFacts(person);
    const evidence=professionalEvidence(person);
    const leadership=leadershipEvidence(person);
    const footprint=researchFootprint(person);
    const expertise=evidenceList(evidence.expertise);
    const current=evidenceList(evidence.current);
    const scientific=evidenceList(evidence.scientific);
    const networks=evidenceList(evidence.networks);
    const leadershipList=evidenceList(leadership);
    const moduleCount=[facts.length,bio,expertise,current,lines.length,scientific,networks,links.length,footprint,leadershipList].filter(Boolean).length;
    content.classList.toggle('is-sparse',moduleCount<=3);
    content.classList.toggle('is-rich',moduleCount>=7);

    content.innerHTML=`
      <div class="team-profile__identity">
        ${profilePortrait(person)}
        <div class="team-profile__identity-copy">
          <p class="team-profile__identity-kicker">${bi('Professional profile','Perfil profesional')}</p>
          <h2 id="teamProfileName">${esc(nameOf(person))}</h2>
          <p class="team-profile__role">${spec?bi(spec[0],spec[1]):bi(role[0],role[1])}</p>
          ${affiliation?`<p class="team-profile__affiliation">${bi(affiliation[0],affiliation[1])}</p>`:''}
        </div>
      </div>
      ${facts.length?`<section class="team-profile__section">
        <p class="team-profile__section-label">${bi('Professional identity','Identidad profesional')}</p>
        <dl class="team-profile__facts">${facts.map(f=>`<div class="team-profile__fact"><dt>${bi(f.label[0],f.label[1])}</dt><dd>${bi(f.value[0],f.value[1])}</dd></div>`).join('')}</dl>
      </section>`:''}
      ${bio?`<section class="team-profile__section">
        <p class="team-profile__section-label">${bi('Professional profile','Perfil profesional')}</p>
        <p class="team-profile__bio">${bi(bio[0],bio[1])}</p>
      </section>`:''}
      ${expertise?`<section class="team-profile__section">
        <p class="team-profile__section-label">${bi('Clinical / professional expertise','Experiencia clínica / profesional')}</p>
        ${expertise}
      </section>`:''}
      ${current?`<section class="team-profile__section">
        <p class="team-profile__section-label">${bi('Current contribution','Contribución actual')}</p>
        ${current}
      </section>`:''}
      ${lines.length?`<section class="team-profile__section">
        <p class="team-profile__section-label">${bi('Research relationships','Relaciones de investigación')}</p>
        <p class="team-profile__section-note">${bi('Current public research-line relationships.','Relaciones públicas actuales con líneas de investigación.')}</p>
        <div class="team-profile__lines">${lines.map(line=>{const label=lineNamePair(line);return `<a href="/line/?id=${encodeURIComponent(line.id)}"><span>${bi(label[0],label[1])}</span></a>`;}).join('')}</div>
      </section>`:''}
      ${scientific?`<section class="team-profile__section">
        <p class="team-profile__section-label">${bi('Research & innovation contribution','Contribución a investigación e innovación')}</p>
        ${scientific}
      </section>`:''}
      ${networks?`<section class="team-profile__section">
        <p class="team-profile__section-label">${bi('Professional networks','Redes profesionales')}</p>
        ${networks}
      </section>`:''}
      ${links.length?`<section class="team-profile__section">
        <p class="team-profile__section-label">${bi('Scientific identity','Identidad científica')}</p>
        <div class="team-profile__links">${links.map(link=>`<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>
      </section>`:''}
      ${footprint?`<section class="team-profile__section">
        <p class="team-profile__section-label">${bi('Research footprint','Huella investigadora')}</p>
        ${footprint}
      </section>`:''}
      ${leadershipList?`<section class="team-profile__section team-profile__section--leadership">
        <p class="team-profile__section-label">${bi('Leadership responsibilities','Responsabilidades de liderazgo')}</p>
        <p class="team-profile__section-note">${bi('Leadership is an additional responsibility within the same professional profile.','El liderazgo es una responsabilidad adicional dentro del mismo perfil profesional.')}</p>
        ${leadershipList}
      </section>`:''}
      ${profileNavigation(person)}
    `;
  }

  function personParam(person){return slugifyName(nameOf(person));}
  function profileUrlFor(person){
    const url=new URL(location.href);
    if(person)url.searchParams.set('person',personParam(person));
    else url.searchParams.delete('person');
    return `${url.pathname}${url.search}${url.hash}`;
  }
  function resolvePersonParam(value){
    const key=String(value||'').trim();
    if(!key)return null;
    return state.profilePeople.find(p=>p.id===key||personParam(p)===key)||null;
  }

  function openProfile(personId,trigger,{history=true}={}){
    const person=state.people.find(p=>p.id===personId);
    const overlay=$('teamProfileOverlay'),sheet=$('teamProfileSheet');
    if(!person||!overlay||!sheet)return;
    state.activePersonId=personId;
    state.lastProfileTrigger=trigger||document.activeElement;
    if(history&&!state.historyGuard){historyPush(person);}
    if(state.profileCloseTimer){window.clearTimeout(state.profileCloseTimer);state.profileCloseTimer=null;}
    renderProfile(person);
    const content=$('teamProfileContent');if(content)content.scrollTop=0;
    overlay.hidden=false;
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('team-profile-open');
    requestAnimationFrame(()=>{overlay.classList.add('is-open');sheet.focus({preventScroll:true});});
  }

  function historyPush(person){
    const next=profileUrlFor(person);
    const current=`${location.pathname}${location.search}${location.hash}`;
    if(next!==current)window.history.pushState({teamProfile:personParam(person)},'',next);
  }

  function closeProfile({history=true}={}){
    const overlay=$('teamProfileOverlay');
    if(!overlay||overlay.hidden)return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('team-profile-open');
    const restore=state.lastProfileTrigger;
    state.activePersonId=null;
    if(history&&!state.historyGuard){const clean=profileUrlFor(null);window.history.pushState({teamProfile:null},'',clean);}
    state.profileCloseTimer=window.setTimeout(()=>{overlay.hidden=true;state.profileCloseTimer=null;if(restore&&document.contains(restore))restore.focus({preventScroll:true});},240);
  }

  function initProfileSheet(){
    for(const host of [$('teamRoster'),$('teamLeadership'),$('teamCoordinators')]){
      host?.addEventListener('click',event=>{
        const trigger=event.target.closest('[data-profile-id]');
        if(trigger)openProfile(trigger.dataset.profileId,trigger);
      });
    }
    $('teamProfileContent')?.addEventListener('click',event=>{
      const nav=event.target.closest('[data-profile-nav]');
      if(!nav)return;
      const nextId=nav.dataset.profileNav;
      const person=state.profilePeople.find(p=>p.id===nextId);
      if(!person)return;
      historyPush(person);
      state.activePersonId=person.id;
      renderProfile(person);
      const content=$('teamProfileContent');if(content)content.scrollTop=0;
      $('teamProfileSheet')?.focus({preventScroll:true});
    });
    $('teamProfileClose')?.addEventListener('click',closeProfile);
    $('teamProfileBackdrop')?.addEventListener('click',closeProfile);
    document.addEventListener('keydown',event=>{
      const overlay=$('teamProfileOverlay');
      if(event.key==='Escape'&&overlay&&!overlay.hidden){event.preventDefault();closeProfile();return;}
      if(event.key!=='Tab'||!overlay||overlay.hidden)return;
      const focusable=[...overlay.querySelectorAll('button:not([disabled]),a[href], [tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&el.offsetParent!==null);
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      const sheet=$('teamProfileSheet');
      if(document.activeElement===sheet){event.preventDefault();(event.shiftKey?last:first).focus();}
      else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    });
    window.addEventListener('popstate',()=>{
      if(!state.profilePeople.length)return;
      const param=new URL(location.href).searchParams.get('person');
      state.historyGuard=true;
      const person=resolvePersonParam(param);
      if(person){openProfile(person.id,null,{history:false});}
      else if(state.activePersonId){closeProfile({history:false});}
      state.historyGuard=false;
    });
  }

  async function enrichMemberships(){
    for(let i=0;i<state.lines.length;i+=2){
      await Promise.all(state.lines.slice(i,i+2).map(async line=>{
        try{
          const res=await apiFetch(`/api/research-lines/${encodeURIComponent(line.id)}/website`);
          for(const p of (res?.data?.team||[]))if(p?.id)addRelation(p.id,line);
        }catch{}
      }));
    }
  }

  async function load(){
    const targets=[$('teamLeadership'),$('teamCoordinators'),$('teamRoster')].filter(Boolean);
    try{
      const results=await Promise.allSettled([apiFetch('/api/team/website'),apiFetch('/api/research-lines/website')]);
      if(results[0].status!=='fulfilled'||!Array.isArray(results[0].value?.data))throw new Error('Public team unavailable');
      state.people=results[0].value.data.filter(p=>p&&p.is_public!==false);
      state.profilePeople=[...state.people].sort((a,b)=>nameOf(a).localeCompare(nameOf(b),undefined,{sensitivity:'base'}));
      state.lines=results[1].status==='fulfilled'&&Array.isArray(results[1].value?.data)?results[1].value.data:[];
      for(const p of state.people){
        if(p.coordinates_line)addRelation(p.id,p.coordinates_line);
        for(const l of (p.research_lines||[]))addRelation(p.id,l);
      }
      const known=new Map(state.lines.map(l=>[l.id,l]));
      for(const p of state.people)for(const l of personLines(p.id))if(!known.has(l.id))known.set(l.id,l);
      state.lines=[...known.values()].sort((a,b)=>(a.line_number||99)-(b.line_number||99));
      renderLeadership();renderCoordinators();renderRoster();
      await enrichMemberships();renderRoster();
      const requested=resolvePersonParam(new URL(location.href).searchParams.get('person'));
      if(requested&&!state.activePersonId)openProfile(requested.id,null,{history:false});
      else if(state.activePersonId){const active=state.people.find(p=>p.id===state.activePersonId);if(active)renderProfile(active);}
    }catch(err){
      console.error('Team load failed:',err);
      targets.forEach(host=>host.innerHTML=`<div class="team-empty state-panel state-panel--error"><span class="state-panel__label">${bi('Temporary issue','Incidencia temporal')}</span><h3 class="state-panel__title">${bi('Public team profiles are temporarily unavailable.','Los perfiles públicos del equipo no están disponibles temporalmente.')}</h3><p class="state-panel__copy">${bi('Please try again shortly.','Inténtelo de nuevo en unos instantes.')}</p></div>`);
    }
  }

  syncMediaLanguage();
  document.addEventListener('neumac:languagechange',e=>{syncMediaLanguage(e.detail?.lang);if(state.activePersonId){const active=state.people.find(p=>p.id===state.activePersonId);if(active)renderProfile(active);}});
  initProfileSheet();
  load();
})();


/* ============================================================
   TEAM — PHASE 2
   Living scientific coordination index: L01 → L06.
   This is deliberately page-local and does not alter profile/data behavior.
   ============================================================ */
(function(){
  'use strict';

  var host=document.getElementById('teamCoordinators');
  if(!host)return;

  var rows=[];
  var raf=0;
  var observer=null;

  function prefersReducedMotion(){
    return !!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function refreshRows(){
    rows=Array.prototype.slice.call(host.querySelectorAll('.team-coordinator'));
    rows.forEach(function(row){row.classList.remove('is-active-coordinator');});
    requestUpdate();
  }

  function update(){
    raf=0;

    if(!rows.length||window.innerWidth<=640){
      host.style.removeProperty('--team-coordination-progress');
      rows.forEach(function(row){row.classList.remove('is-active-coordinator');});
      return;
    }

    var viewportH=window.innerHeight||document.documentElement.clientHeight;
    var anchor=viewportH*.46;
    var rect=host.getBoundingClientRect();
    var span=Math.max(1,rect.height);
    var progress=Math.max(0,Math.min(1,(anchor-rect.top)/span));

    host.style.setProperty(
      '--team-coordination-progress',
      (prefersReducedMotion()?1:progress).toFixed(3)
    );

    if(rect.bottom<0||rect.top>viewportH){
      rows.forEach(function(row){row.classList.remove('is-active-coordinator');});
      return;
    }

    var best=null;
    var bestDistance=Infinity;
    rows.forEach(function(row){
      var rr=row.getBoundingClientRect();
      var centre=rr.top+(rr.height*.5);
      var distance=Math.abs(centre-anchor);
      if(distance<bestDistance){
        bestDistance=distance;
        best=row;
      }
    });

    rows.forEach(function(row){
      row.classList.toggle('is-active-coordinator',row===best);
    });
  }

  function requestUpdate(){
    if(raf)return;
    raf=requestAnimationFrame(update);
  }

  observer=new MutationObserver(refreshRows);
  observer.observe(host,{childList:true,subtree:false});

  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',requestUpdate,{passive:true});
  document.addEventListener('neumac:languagechange',requestUpdate);

  refreshRows();
})();
