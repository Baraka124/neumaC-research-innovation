/* neumACt — Research Line 2.0
   Adds scientific scope, contribution provenance and cross-programme relationships
   to the shared line template without changing the shared masthead/footer system. */
(function(){
  'use strict';

  if (document.body?.dataset?.page !== 'line') return;

  const PI_ID = 'c290a7e5-7bea-4652-a0ef-251fbc73184d';
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[ch]));
  const bi = (en, es) => `<span lang="en">${esc(en)}</span><span lang="es">${esc(es)}</span>`;

  const lineLabels = {
    1:['Transplantation & Pulmonary Hypertension','Trasplante e hipertensión pulmonar'],
    2:['Airway Diseases','Enfermedades de la vía aérea'],
    3:['Interventional Pneumology & Lung Cancer','Neumología intervencionista y cáncer de pulmón'],
    4:['Respiratory Failure & Sleep Medicine','Insuficiencia respiratoria y medicina del sueño'],
    5:['Innovation in Thoracic Surgery','Innovación en cirugía torácica'],
    6:['Precision Medicine & Clinical Innovation','Medicina de precisión e innovación clínica']
  };

  const staffRoleLabels = {
    attending_physician:['Physician','Médico/a'],
    specialist_physician:['Physician','Médico/a'],
    medical_resident:['Resident physician','Médico/a residente'],
    fellow:['Research fellow','Investigador/a en formación'],
    researcher:['Researcher','Investigador/a'],
    research_scientist:['Research scientist','Personal investigador'],
    biologist:['Biologist','Biólogo/a'],
    nurse:['Nurse','Enfermero/a'],
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

  function slugifyName(name){
    return String(name || '')
      .replace(/\b(?:Dra|Dr|Prof)\.?\s*/gi,'')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }

  function linePair(line){
    const n = Number(line?.line_number || 0);
    const mapped = lineLabels[n];
    if (mapped) return mapped;
    const raw = String(line?.short_name || line?.name || '').trim();
    return [raw, raw];
  }

  function rolePair(person){
    const mapped = staffRoleLabels[person?.staff_type];
    if (mapped) return mapped;
    const raw = String(person?.specialization || person?.public_role || '').trim();
    return raw ? [raw, raw] : ['Research contributor','Colaborador/a de investigación'];
  }

  function safeArray(value){
    if (Array.isArray(value)) return value;
    if (value == null || value === '') return [];
    if (typeof value === 'string') {
      const text = value.trim();
      if (!text) return [];
      if ((text.startsWith('[') && text.endsWith(']')) || (text.startsWith('{') && text.endsWith('}'))) {
        try { return safeArray(JSON.parse(text)); } catch {}
      }
      return text.split(/\r?\n|;\s*/).map(v=>v.trim()).filter(Boolean);
    }
    return [value];
  }

  function readableItem(item){
    if (item == null) return null;
    if (typeof item === 'string' || typeof item === 'number') {
      const text = String(item).trim();
      return text ? { en:text, es:text, meta:'' } : null;
    }
    if (typeof item !== 'object') return null;

    const titleEn = item.title_en || item.name_en || item.label_en || item.text_en || '';
    const titleEs = item.title_es || item.name_es || item.label_es || item.text_es || '';
    const fallback = item.title || item.name || item.label || item.text || item.description || item.value || '';
    const meta = [item.year, item.date, item.status].filter(Boolean).join(' · ');
    const en = String(titleEn || fallback || titleEs || '').trim();
    const es = String(titleEs || fallback || titleEn || '').trim();
    return en || es ? { en:en || es, es:es || en, meta:String(meta || '') } : null;
  }

  function textPair(value){
    if (value == null) return ['', ''];
    if (typeof value === 'object' && !Array.isArray(value)) {
      const en = String(value.en || value.english || value.text_en || value.description_en || '').trim();
      const es = String(value.es || value.spanish || value.text_es || value.description_es || '').trim();
      if (en || es) return [en || es, es || en];
    }
    const raw = String(value).trim();
    if (!raw) return ['', ''];
    if ((raw.startsWith('{') && raw.endsWith('}')) || (raw.startsWith('[') && raw.endsWith(']'))) {
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return textPair(parsed);
      } catch {}
    }
    return [raw, raw];
  }

  function paragraphMarkup(value){
    const [en, es] = textPair(value);
    if (!en && !es) return '';
    const enParts = String(en).split(/\n{2,}/).map(v=>v.trim()).filter(Boolean);
    const esParts = String(es).split(/\n{2,}/).map(v=>v.trim()).filter(Boolean);
    const count = Math.max(enParts.length, esParts.length);
    const out = [];
    for (let i=0;i<count;i++){
      const e = enParts[i] || enParts[enParts.length-1] || '';
      const s = esParts[i] || esParts[esParts.length-1] || e;
      if (e === s) out.push(`<p>${esc(e)}</p>`);
      else out.push(`<p>${bi(e,s)}</p>`);
    }
    return out.join('');
  }

  function listMarkup(value){
    const items = safeArray(value).map(readableItem).filter(Boolean);
    return items.map(item => `
      <div class="line-overview__item">
        <div>${item.en === item.es ? esc(item.en) : bi(item.en,item.es)}
          ${item.meta ? `<small>${esc(item.meta)}</small>` : ''}
        </div>
      </div>`).join('');
  }

  const capabilityLabels = {
    clinical_domains:['Clinical domains','Ámbitos clínicos'],
    clinical_capabilities:['Clinical capabilities','Capacidades clínicas'],
    research_capabilities:['Research capabilities','Capacidades de investigación'],
    translational_capabilities:['Translational capabilities','Capacidades traslacionales'],
    digital_innovation_capabilities:['Digital & innovation capabilities','Capacidades digitales e innovación']
  };

  function capabilityGroupsMarkup(line){
    const groups = safeArray(line?.capability_groups)
      .filter(group => group && (!group.visibility || group.visibility === 'approved_public'))
      .map(group => {
        const type = String(group.type || '').trim();
        const fallbackLabel = capabilityLabels[type] || ['Scientific capabilities','Capacidades científicas'];
        const labelPair = textPair(group.label);
        const summaryPair = textPair(group.summary);
        const items = safeArray(group.items)
          .filter(item => !item || typeof item !== 'object' || !item.visibility || item.visibility === 'approved_public')
          .map(readableItem)
          .filter(Boolean)
          .sort((a,b) => Number(a?.display_priority ?? 50) - Number(b?.display_priority ?? 50));
        if (!items.length) return '';
        return `<section class="line-capability-group" data-capability-type="${esc(type || 'general')}">
          <div class="line-capability-group__head">
            <h3>${bi(labelPair[0] || fallbackLabel[0],labelPair[1] || fallbackLabel[1])}</h3>
            ${summaryPair[0] || summaryPair[1] ? `<p>${bi(summaryPair[0] || summaryPair[1],summaryPair[1] || summaryPair[0])}</p>` : ''}
          </div>
          <ul class="line-capability-group__items">
            ${items.map(item => `<li>${item.en === item.es ? esc(item.en) : bi(item.en,item.es)}${item.meta ? `<small>${esc(item.meta)}</small>` : ''}</li>`).join('')}
          </ul>
        </section>`;
      }).filter(Boolean);
    return groups.join('');
  }

  function renderOverview(line){
    const section = $('lineOverviewSection');
    if (!section || !line) return;

    const narrative = paragraphMarkup(line.deep_content);
    const groupedCapabilities = capabilityGroupsMarkup(line);
    const legacyCapabilities = groupedCapabilities ? '' : listMarkup(line.capabilities);
    const capabilities = groupedCapabilities || legacyCapabilities;
    const track = listMarkup(line.track_record);

    const narrativeEl = $('lineOverviewNarrative');
    const capabilitiesBlock = $('lineCapabilitiesBlock');
    const capabilitiesList = $('lineCapabilitiesList');
    const trackBlock = $('lineTrackRecordBlock');
    const trackList = $('lineTrackRecordList');

    if (narrativeEl) narrativeEl.innerHTML = narrative;
    if (capabilitiesList) {
      capabilitiesList.classList.toggle('is-grouped',Boolean(groupedCapabilities));
      capabilitiesList.innerHTML = capabilities;
    }
    if (trackList) trackList.innerHTML = track;

    if (capabilitiesBlock) capabilitiesBlock.hidden = !capabilities;
    if (trackBlock) trackBlock.hidden = !track;

    const main = section.querySelector('.line-overview__main');
    if (main) main.hidden = !narrative;

    if (narrative || capabilities || track) section.hidden = false;
  }

  function normalizeIds(value){
    return safeArray(value).map(item => {
      if (item && typeof item === 'object') return String(item.id || item.staff_id || item.user_id || '').trim();
      return String(item || '').trim();
    }).filter(Boolean);
  }

  function sourceRole(type, role){
    const map = {
      study_pi:['Clinical study · Principal investigator','Estudio clínico · Investigador principal'],
      study_co:['Clinical study · Co-investigator','Estudio clínico · Coinvestigador/a'],
      study_sub:['Clinical study · Sub-investigator','Estudio clínico · Subinvestigador/a'],
      project_lead:['Clinical innovation · Project lead','Innovación clínica · Responsable del proyecto'],
      project_co:['Clinical innovation · Contributor','Innovación clínica · Colaborador/a']
    };
    return map[`${type}_${role}`] || ['Research contribution','Contribución de investigación'];
  }

  function contributionSources(personId, studies, projects){
    const sources = [];

    for (const study of studies || []) {
      let role = '';
      if (String(study?.principal_investigator_id || '') === personId) role = 'pi';
      else if (normalizeIds(study?.co_investigators).includes(personId)) role = 'co';
      else if (normalizeIds(study?.sub_investigators).includes(personId)) role = 'sub';
      if (role) {
        const label = sourceRole('study', role);
        sources.push({
          kind:'study',
          en:label[0], es:label[1],
          title:study.title || study.protocol_id || 'Clinical study'
        });
      }
    }

    for (const project of projects || []) {
      let role = '';
      if (String(project?.lead_investigator_id || '') === personId) role = 'lead';
      else if (normalizeIds(project?.co_investigators).includes(personId)) role = 'co';
      if (role) {
        const label = sourceRole('project', role);
        sources.push({
          kind:'project',
          en:label[0], es:label[1],
          title:project.title || 'Innovation project'
        });
      }
    }
    return sources;
  }

  function profileEligible(person){
    return Boolean(person && !person.coordinates_line && !person.is_chief_of_department && person.id !== PI_ID);
  }

  function portraitMarkup(person){
    const name = person?.display_name || person?.full_name || '';
    const initials = String(name).replace(/\b(?:Dra|Dr|Prof)\.?\s*/gi,'')
      .split(/\s+/).filter(Boolean).slice(0,2).map(v=>v[0]).join('').toUpperCase() || '—';
    const src = String(person?.public_photo_url || '').trim();
    return src
      ? `<div class="line-contributor__portrait"><img src="${esc(src)}" alt="${esc(name)}" loading="lazy" decoding="async" onerror="this.parentElement.textContent='${esc(initials)}'"></div>`
      : `<div class="line-contributor__portrait" aria-hidden="true">${esc(initials)}</div>`;
  }

  function membershipMapForCurrent(contributors, otherMemberships){
    const map = new Map();
    for (const person of contributors) {
      map.set(person.id, (otherMemberships.get(person.id) || []).slice().sort((a,b)=>(a.line_number||99)-(b.line_number||99)));
    }
    return map;
  }

  function renderContributors(line, teamIndex, studies, projects, otherMemberships){
    const host = $('lineTeamChips');
    if (!host || !Array.isArray(line?.team)) return;

    const contributors = line.team
      .filter(m => m && m.id !== line.coordinator?.id && !(m.id === PI_ID && line.coordinator?.id !== PI_ID))
      .map(m => ({...m, ...(teamIndex.get(m.id) || {}), role_on_line:m.role_on_line || (teamIndex.get(m.id)?.role_on_line || null)}));

    if (!contributors.length) return;

    const cross = membershipMapForCurrent(contributors, otherMemberships);
    host.classList.add('is-contribution-ledger');

    host.innerHTML = contributors.map(person => {
      const name = person.display_name || person.full_name || '';
      const role = rolePair(person);
      const sources = contributionSources(String(person.id), studies, projects);
      const otherLines = (cross.get(person.id) || []).filter(l => l.id !== line.id);
      const profileUrl = profileEligible(person) ? `/team/?person=${encodeURIComponent(slugifyName(name))}` : '/team/';

      const sourceRows = sources.slice(0,3).map(source => `
        <div class="line-contribution-source">
          <p class="line-contribution-source__meta">${bi(source.en,source.es)}</p>
          <p class="line-contribution-source__title">${esc(source.title)}</p>
        </div>`).join('');

      return `<article class="line-contributor">
        ${portraitMarkup(person)}
        <div class="line-contributor__main">
          <h3 class="line-contributor__name"><a href="${profileUrl}">${esc(name)}</a></h3>
          <p class="line-contributor__role">${person.specialization ? esc(person.specialization) : bi(role[0],role[1])}</p>
          ${person.role_on_line ? `<p class="line-contributor__explicit-role">${esc(person.role_on_line)}</p>` : ''}
          ${sourceRows ? `<div class="line-contributor__sources">${sourceRows}</div>` : ''}
          ${sources.length > 3 ? `<p class="line-contributor__more">${bi(`${sources.length-3} additional public contribution${sources.length-3===1?'':'s'}`,`${sources.length-3} contribución${sources.length-3===1?' adicional':'es adicionales'}`)}</p>` : ''}
        </div>
        <aside class="line-contributor__side">
          ${otherLines.length ? `
            <p class="line-contributor__side-label">${bi('Also contributes to','También contribuye a')}</p>
            <div class="line-contributor__line-links">${otherLines.map(other => {
              const pair = linePair(other);
              return `<a href="/line/?id=${encodeURIComponent(other.id)}">${bi(pair[0],pair[1])}</a>`;
            }).join('')}</div>` : `
            <p class="line-contributor__side-label">${bi('Current public relationship','Relación pública actual')}</p>
            <p class="line-contributor__role">${bi('This research area','Este ámbito de investigación')}</p>`}
          <a class="line-contributor__profile-link" href="${profileUrl}">${bi('Team profile','Perfil en el equipo')}</a>
        </aside>
      </article>`;
    }).join('');
  }

  function addConnection(map, line, kind, value){
    if (!line?.id || !value) return;
    if (!map.has(line.id)) {
      map.set(line.id, { line, people:new Map(), studies:new Map(), projects:new Map() });
    }
    const bucket = map.get(line.id);
    bucket[kind].set(value.id || value, value);
  }

  function extractRelatedLine(record, key){
    const rels = safeArray(record?.[key]);
    return rels.map(rel => rel?.research_lines || rel?.research_line || rel).filter(r => r?.id);
  }

  function renderConnections(currentLine, studies, projects, contributors, otherMemberships, lineById){
    const section = $('lineConnectionsSection');
    const host = $('lineConnectionsList');
    if (!section || !host) return;

    const map = new Map();

    // Cross-line study/project relationships already exposed by the governed public endpoints.
    for (const study of studies || []) {
      for (const other of extractRelatedLine(study, 'clinical_trial_lines')) {
        if (other.id !== currentLine.id) addConnection(map, lineById.get(other.id) || other, 'studies', study);
      }
    }
    for (const project of projects || []) {
      for (const other of extractRelatedLine(project, 'innovation_project_lines')) {
        if (other.id !== currentLine.id) addConnection(map, lineById.get(other.id) || other, 'projects', project);
      }
    }

    // Shared people are inferred from each line's own public contributor projection.
    for (const person of contributors) {
      for (const other of (otherMemberships.get(person.id) || [])) {
        if (other.id !== currentLine.id) addConnection(map, lineById.get(other.id) || other, 'people', person);
      }
    }

    const rows = [...map.values()]
      .filter(item => item.people.size || item.studies.size || item.projects.size)
      .sort((a,b)=>(a.line.line_number||99)-(b.line.line_number||99));

    if (!rows.length) {
      section.hidden = true;
      return;
    }

    host.innerHTML = rows.map(item => {
      const pair = linePair(item.line);
      const bits = [];
      if (item.people.size) {
        bits.push(bi(
          `${item.people.size} shared contributor${item.people.size===1?'':'s'}`,
          `${item.people.size} colaborador${item.people.size===1?' compartido':'es compartidos'}`
        ));
      }
      if (item.studies.size) {
        bits.push(bi(
          `${item.studies.size} linked stud${item.studies.size===1?'y':'ies'}`,
          `${item.studies.size} estudio${item.studies.size===1?' vinculado':'s vinculados'}`
        ));
      }
      if (item.projects.size) {
        bits.push(bi(
          `${item.projects.size} linked innovation activit${item.projects.size===1?'y':'ies'}`,
          `${item.projects.size} actividad${item.projects.size===1?' de innovación vinculada':'es de innovación vinculadas'}`
        ));
      }
      const peopleNames = [...item.people.values()].map(p=>p.display_name || p.full_name || '').filter(Boolean);

      return `<a class="line-connection-row" href="/line/?id=${encodeURIComponent(item.line.id)}">
        <span class="line-connection-row__name">${bi(pair[0],pair[1])}</span>
        <span class="line-connection-row__evidence">
          ${bits.map(bit=>`<span>${bit}</span>`).join('')}
          ${peopleNames.length ? `<span class="line-connection-row__people">${esc(peopleNames.join(' · '))}</span>` : ''}
        </span>
      </a>`;
    }).join('');
    section.hidden = false;
  }

  async function fetchPublic(path){
    if (typeof window.apiFetch === 'function') return window.apiFetch(path);
    if (typeof apiFetch === 'function') return apiFetch(path);
    const base = window.NEUMAC_CONFIG?.apiBase || '';
    const response = await fetch(base + path);
    if (!response.ok) throw new Error(`API ${response.status}`);
    return response.json();
  }

  async function waitForBaseRender(timeoutMs=16000){
    const loading = $('lineLoadingState');
    const error = $('lineLoadError');
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (error?.classList.contains('is-visible')) return false;
      if (!loading || loading.classList.contains('is-hidden')) return true;
      await new Promise(r=>setTimeout(r,80));
    }
    return false;
  }

  async function enrichOtherMemberships(lines, currentLineId){
    const map = new Map();
    const others = (lines || []).filter(line => line?.id && line.id !== currentLineId);

    for (let i=0;i<others.length;i+=2) {
      const batch = others.slice(i,i+2);
      const results = await Promise.allSettled(batch.map(line =>
        fetchPublic(`/api/research-lines/${encodeURIComponent(line.id)}/website`)
      ));
      results.forEach((result, idx) => {
        if (result.status !== 'fulfilled') return;
        const line = batch[idx];
        const detail = result.value?.data;
        const ids = new Set();
        if (detail?.coordinator?.id) ids.add(detail.coordinator.id);
        for (const person of detail?.team || []) if (person?.id) ids.add(person.id);
        for (const id of ids) {
          if (!map.has(id)) map.set(id, []);
          map.get(id).push(line);
        }
      });
    }
    return map;
  }

  async function enhance(){
    const ready = await waitForBaseRender();
    if (!ready) return;

    const lineId = new URLSearchParams(location.search).get('id');
    if (!lineId) return;

    try {
      const [lineRes, linesRes, teamRes, studiesRes, projectsRes] = await Promise.allSettled([
        fetchPublic(`/api/research-lines/${encodeURIComponent(lineId)}/website`),
        fetchPublic('/api/research-lines/website'),
        fetchPublic('/api/team/website'),
        fetchPublic(`/api/clinical-trials/website?line=${encodeURIComponent(lineId)}`),
        fetchPublic(`/api/innovation-projects/website?line=${encodeURIComponent(lineId)}`)
      ]);

      if (lineRes.status !== 'fulfilled' || !lineRes.value?.data) return;
      const line = lineRes.value.data;
      const lines = linesRes.status === 'fulfilled' && Array.isArray(linesRes.value?.data) ? linesRes.value.data : [];
      const team = teamRes.status === 'fulfilled' && Array.isArray(teamRes.value?.data) ? teamRes.value.data : [];
      const studies = studiesRes.status === 'fulfilled' && Array.isArray(studiesRes.value?.data) ? studiesRes.value.data : [];
      const projects = projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value?.data) ? projectsRes.value.data : [];

      // Make the scientific identity concise and bilingual while retaining the backend
      // description as the substantive summary immediately beneath it.
      const title = $('lineTitle');
      const pair = linePair(line);
      if (title && pair[0]) title.innerHTML = bi(pair[0],pair[1]);

      renderOverview(line);

      const teamIndex = new Map(team.filter(Boolean).map(person => [person.id, person]));
      const baseContributors = (line.team || [])
        .filter(m => m && m.id !== line.coordinator?.id && !(m.id === PI_ID && line.coordinator?.id !== PI_ID))
        .map(m => ({...m, ...(teamIndex.get(m.id) || {})}));

      // Render once immediately from this line's own public evidence.
      const emptyMemberships = new Map();
      renderContributors(line, teamIndex, studies, projects, emptyMemberships);

      // Then enrich cross-line participation in small batches so the page stays responsive.
      if (lines.length && baseContributors.length) {
        const otherMemberships = await enrichOtherMemberships(lines, line.id);
        renderContributors(line, teamIndex, studies, projects, otherMemberships);
        const lineById = new Map(lines.map(item => [item.id, item]));
        renderConnections(line, studies, projects, baseContributors, otherMemberships, lineById);
      }
    } catch (err) {
      // Enhancement must never break the stable base line page.
      console.warn('Research line relationship enhancement unavailable:', err?.message || err);
    }
  }

  document.addEventListener('DOMContentLoaded', enhance);
})();
