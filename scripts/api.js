/**
 * neumAC R&I — Website Data Layer
 * api.js — shared script loaded by all pages
 *  
 * Architecture:
 *   Website → Railway backend (public endpoints, no auth)
 *   App     → Railway backend (authenticated endpoints)
 *   Both    → same Supabase DB (one source of truth)
 *
 * Public endpoints:
 *   GET /api/research-lines/website
 *   GET /api/clinical-trials/website?line=&phase=&status=&search= 
 *   GET /api/innovation-projects/website
 *   GET /api/news/website?type=&line=
 */

const API_BASE = window.NEUMAC_CONFIG.apiBase;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function apiFetch(path, _isRetry = false) {
  // Hardened: 12s timeout + a single retry with backoff on 429
  // (rate limit), 5xx, or network failure. Every page load fires
  // several calls at once (header dropdown + page data + stats), so
  // a user clicking through the nav quickly can burst the backend
  // rate limiter — previously any 429 threw straight through all 23
  // call sites with no second chance. 4xx other than 429 still
  // throws immediately (retrying a 404 is pointless). The call-site
  // contract is unchanged: resolves to parsed JSON or throws.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { signal: ctrl.signal });
  } catch (err) {
    clearTimeout(timer);
    if (!_isRetry) {
      await new Promise(r => setTimeout(r, 1200));
      return apiFetch(path, true);
    }
    throw err;
  }
  clearTimeout(timer);
  if (!res.ok) {
    const retryable = res.status === 429 || res.status >= 500;
    if (retryable && !_isRetry) {
      const retryAfter = parseInt(res.headers.get('Retry-After'), 10);
      const waitMs = !isNaN(retryAfter) ? Math.min(retryAfter * 1000, 5000) : 1200;
      await new Promise(r => setTimeout(r, waitMs));
      return apiFetch(path, true);
    }
    throw new Error(`API ${res.status}: ${path}`);
  }
  return res.json();
}

/** Inject shared styles once — using new design palette.
 *  NOTE: .api-skeleton/.api-skeleton-dark are NOT defined here on purpose.
 *  Each page's own <style> block already defines the real shimmer version
 *  (background-position keyframe, not opacity-pulse). This script tag is
 *  appended to <head> at runtime, after the page's own <style> block —
 *  so on equal specificity it would always win the cascade and silently
 *  replace the real shimmer with a plain grey pulsing box. Keep skeleton
 *  styling page-side only. */
if (!document.getElementById('api-js-styles')) {
  const s = document.createElement('style');
  s.id = 'api-js-styles';
  s.textContent = `
    .api-error {
      padding: 2rem;
      text-align: center;
      color: #767676;
      font-size: .8125rem;
      font-family: var(--ff-mono, monospace);
    }
    .api-error svg { margin: 0 auto .75rem; display: block; opacity: .4; }
    tr[onclick]:hover td { background: var(--teal-lt, #E6F7F7); }
  `;
  document.head.appendChild(s);
}

/** Skeleton loader — light for light sections, dark for dark sections */
function setLoading(el, rows = 3, dark = false) {
  const cls = dark ? 'api-skeleton-dark' : 'api-skeleton';
  // tbody only accepts tr elements — use tr/td skeleton for tables
  if (el.tagName === 'TBODY') {
    el.innerHTML = Array(rows).fill(
      `<tr>${Array(6).fill(`<td><div class="${cls} api-skeleton--table-cell"></div></td>`).join('')}</tr>`
    ).join('');
  } else {
    el.innerHTML = Array(rows).fill(
      `<div class="${cls} api-skeleton--row"></div>`
    ).join('');
  }
}

function setError(el, msg = 'Could not load data. Please try again later.') {
  el.innerHTML = `
    <div class="api-error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4M12 16h.01"/>
      </svg>
      ${msg}
    </div>`;
  showApiDownBanner();
}

/* One sitewide banner when live data is unavailable. Before this, a
   full backend outage rendered as five independent "could not load"
   boxes scattered down the page — technically accurate, but it reads
   as five separate broken features rather than one upstream outage.
   The per-widget messages stay (they explain each empty area locally);
   this adds the single global explanation, shown once, dismissible. */
function showApiDownBanner() {
  if (document.getElementById('apiDownBanner')) return;
  const b = document.createElement('div');
  b.id = 'apiDownBanner';
  b.setAttribute('role', 'status');
  b.className = 'api-down-banner';
  b.innerHTML =
    '<span lang="en">Live data is temporarily unavailable — page content may be incomplete. Please try again shortly.</span>' +
    '<span lang="es">Los datos en vivo no están disponibles temporalmente; el contenido puede estar incompleto. Inténtelo de nuevo en breve.</span>' +
    '<button class="api-notice__dismiss" aria-label="Dismiss">×</button>';
  b.querySelector('.api-notice__dismiss')?.addEventListener('click', () => b.remove());
  document.body.appendChild(b);
}

// ─────────────────────────────────────────────
// STATUS / CATEGORY MAPS
// ─────────────────────────────────────────────

const STATUS_CLASS = {
  'Reclutando':     'recruiting',
  'Activo':         'active',
  'Completado':     'completed',
  'En preparación': 'prep'
};

const STATUS_LABEL_EN = {
  'Reclutando':     'Recruiting',
  'Activo':         'Active',
  'Completado':     'Completed',
  'En preparación': 'In Preparation'
};

const CATEGORY_CLASS = {
  'Dispositivo':           'cat-device',
  'Salud Digital':         'cat-digital',
  'IA / ML':               'cat-ai',
  'Tecnología Quirúrgica': 'cat-surgical'
};

const CATEGORY_ICON = {
  'Dispositivo':           `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="9" height="9"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M7 7h2l1 3 2-6 1 3h3"/></svg>`,
  'Salud Digital':         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="9" height="9"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
  'IA / ML':               `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="9" height="9"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6" y2="6"/><line x1="6" y1="18" x2="6" y2="18"/></svg>`,
  'Tecnología Quirúrgica': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="9" height="9"><path d="M20 7l-9 9-4-4 9-9 4 4z"/><path d="M4 20l1-4"/></svg>`
};

// ─────────────────────────────────────────────
// PAGE DETECTION
// ─────────────────────────────────────────────

const PAGE = (() => {
  // Folder-based URLs (e.g. /team or /team/) mean the old
  // "last path segment" logic breaks on a trailing slash — splitting
  // "/team/" by '/' ends in an empty string, which used to silently
  // fall through to the index-page fallback and load the wrong content
  // entirely. Filter out empty segments before taking the last one.
  const segments = location.pathname.split('/').filter(Boolean);
  const p = segments[segments.length - 1] || 'index.html';
  if (p.startsWith('clinical'))   return 'clinical';
  if (p.startsWith('innovation')) return 'innovation';
  if (p.startsWith('news'))       return 'news';
  if (p.startsWith('team'))       return 'team';
  if (p.startsWith('line'))       return 'line';
  return 'index';
})();

// ─────────────────────────────────────────────
// 1. RESEARCH LINES (index.html + clinical.html)
// ─────────────────────────────────────────────


const RESEARCH_LINE_MEDIA = {
  1: '/assets/research/line-transplantation-pulmonary-hypertension.jpg',
  2: '/assets/research/line-heroes/airway-diseases.jpg',
  3: '/assets/research/line-interventional-lung-cancer.jpg',
  4: '/assets/research/line-heroes/respiratory-failure-sleep.jpg',
  5: '/assets/research/line-thoracic-surgery.jpg',
  6: '/assets/research/line-precision-medicine.jpg'
};

/* Institutional INIBIC nomenclature — public source of truth.
   Spanish labels are preserved exactly; English is a direct public-site
   translation of the same institutional research lines. */
const INSTITUTIONAL_RESEARCH_LINES = {
  1: ['Transplantation, Pulmonary Hypertension & Diffuse Lung Disease','Trasplante, Hipertensión y Enfermedad Difusa Pulmonar'],
  2: ['Airway Diseases','Enfermedades de la Vía Aérea'],
  3: ['Interventional Pulmonology & Lung Cancer','Neumología Intervencionista y Cáncer de Pulmón'],
  4: ['Respiratory Failure, Critical Care & Sleep Medicine','Insuficiencia Respiratoria, Cuidados Críticos y Medicina del Sueño'],
  5: ['Innovation in Thoracic Surgery','Innovación en Cirugía Torácica'],
  6: ['Personalised Respiratory Medicine, Management & Clinical Innovation','Medicina Respiratoria Personalizada, Gestión e Innovación Clínica']
};

function institutionalResearchLinePair(line) {
  const number = Number(line?.line_number || line || 0);
  const mapped = INSTITUTIONAL_RESEARCH_LINES[number];
  if (mapped) return mapped;
  const fallback = String(line?.short_name || line?.name || '').trim();
  return [fallback, fallback];
}

function institutionalResearchLineLabel(line, lang = document.documentElement.dataset.lang || 'es') {
  const pair = institutionalResearchLinePair(line);
  return lang === 'en' ? pair[0] : pair[1];
}

// Phase 6.0 — public coordinator media can be overridden by an approved
// editorial asset without changing the backend person record. Backend
// public_photo_url remains the default source for everyone else.
const LINE_COORDINATOR_MEDIA = {
  'marina blanco aparicio': '/assets/research/coordinators/marina-blanco-aparicio.jpg',
  'angélica consuegra vanegas': '/assets/research/coordinators/angelica-consuegra-vanegas.jpg',
  'angelica consuegra vanegas': '/assets/research/coordinators/angelica-consuegra-vanegas.jpg',
  'pedro jorge marcos rodríguez': '/assets/research/coordinators/pedro-jorge-marcos-rodriguez.jpg',
  'pedro jorge marcos rodriguez': '/assets/research/coordinators/pedro-jorge-marcos-rodriguez.jpg'
};

// Approved public editorial summaries. These are deliberately concise: the
// line page is about the science, not a staff CV. Backend public_bio remains
// the fallback for coordinators without an authored public-page summary.
const LINE_COORDINATOR_EDITORIAL = {
  'marina blanco aparicio': {
    en: 'Pulmonologist specialising in airway disease, with a particular focus on severe asthma, COPD, bronchiectasis and cystic fibrosis. Her work brings together clinical characterisation, advanced therapies and precision follow-up.',
    es: 'Neumóloga especializada en enfermedades de la vía aérea, con especial interés en asma grave, EPOC, bronquiectasias y fibrosis quística. Su trabajo integra caracterización clínica, terapias avanzadas y seguimiento de precisión.'
  },
  'angélica consuegra vanegas': {
    en: 'Pulmonologist specialising in acute and chronic respiratory failure, non-invasive ventilation, home oxygen therapy and sleep medicine. Her research includes multicentre work on ventilatory support and the management of complex respiratory patients.',
    es: 'Neumóloga especializada en insuficiencia respiratoria aguda y crónica, ventilación no invasiva, oxigenoterapia domiciliaria y medicina del sueño. Su investigación incluye estudios multicéntricos sobre soporte ventilatorio y manejo del paciente respiratorio complejo.'
  },
  'angelica consuegra vanegas': {
    en: 'Pulmonologist specialising in acute and chronic respiratory failure, non-invasive ventilation, home oxygen therapy and sleep medicine. Her research includes multicentre work on ventilatory support and the management of complex respiratory patients.',
    es: 'Neumóloga especializada en insuficiencia respiratoria aguda y crónica, ventilación no invasiva, oxigenoterapia domiciliaria y medicina del sueño. Su investigación incluye estudios multicéntricos sobre soporte ventilatorio y manejo del paciente respiratorio complejo.'
  },
  'pedro jorge marcos rodríguez': {
    en: 'Pulmonologist and head of service with experience in clinical research, personalised respiratory medicine and healthcare innovation. His work connects clinical leadership, multicentre research and the development of new models of respiratory care.',
    es: 'Neumólogo y jefe de servicio con experiencia en investigación clínica, medicina respiratoria personalizada e innovación sanitaria. Su trabajo conecta liderazgo clínico, investigación multicéntrica y desarrollo de nuevos modelos de atención respiratoria.'
  },
  'pedro jorge marcos rodriguez': {
    en: 'Pulmonologist and head of service with experience in clinical research, personalised respiratory medicine and healthcare innovation. His work connects clinical leadership, multicentre research and the development of new models of respiratory care.',
    es: 'Neumólogo y jefe de servicio con experiencia en investigación clínica, medicina respiratoria personalizada e innovación sanitaria. Su trabajo conecta liderazgo clínico, investigación multicéntrica y desarrollo de nuevos modelos de atención respiratoria.'
  }
};

const NEUMACT_PI_STAFF_ID = 'c290a7e5-7bea-4652-a0ef-251fbc73184d';

function coordinatorEditorialPhoto(person) {
  if (!person) return '';
  const key = String(person.full_name || '').trim().toLowerCase();
  return LINE_COORDINATOR_MEDIA[key] || person.public_photo_url || '';
}

function coordinatorEditorialBio(person, line) {
  if (!person) return '';
  const key = String(person.full_name || '').trim().toLowerCase();
  const authored = LINE_COORDINATOR_EDITORIAL[key];
  if (authored) {
    return `<span lang="en">${escHtml(authored.en)}</span><span lang="es">${escHtml(authored.es)}</span>`;
  }
  const raw = publicText(person.public_bio || '').replace(/\s+/g, ' ').trim();
  if (raw) {
    const excerpt = raw.length > 420 ? raw.slice(0, 417).replace(/\s+\S*$/, '') + '…' : raw;
    return escHtml(excerpt);
  }
  const lineName = escHtml(line?.short_name || line?.name || 'this research line');
  return `<span lang="en">Coordinates the ${lineName} research line within neumACt.</span><span lang="es">Coordina la línea ${lineName} dentro de neumACt.</span>`;
}

function lineDetailHeroMedia(line) {
  return RESEARCH_LINE_MEDIA[Number(line?.line_number)] || '/assets/research/research-hero-clinician-lungs.jpg';
}

function lineCleanSummary(value) {
  return researchOverviewSummary(value);
}


function researchOverviewSummary(value) {
  let text = publicText(typeof value === 'string' ? value : (value?.es || value?.en || ''));
  if (!text) return '';
  // The overview explains the scope of each line. Operational listings belong
  // to the dedicated line page / study portfolio, so strip embedded project or
  // study inventories from legacy description copy without mutating source data.
  text = text
    .replace(/\s*(?:Proyectos activos|Active projects)\s*:\s*[^.]+\.?/ig, ' ')
    .replace(/\s*(?:Estudios activos|Active studies)\s*:\s*[^.]+\.?/ig, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

function researchLineArrow() {
  return `<svg class="research-line__cta-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h10.5M11.5 6.5 15 10l-3.5 3.5"/></svg>`;
}

async function loadResearchLines() {
  const indexGrid    = document.getElementById('researchLinesGrid');
  const clinicalList = document.getElementById('researchLinesList');

  if (!indexGrid && !clinicalList) return;

  try {
    let { data } = await apiFetch('/api/research-lines/website');
    if (!data?.length) {
      // Retry once before giving up — a transient backend hiccup
      // shouldn't leave visitors staring at the loading skeleton forever
      // with no indication anything went wrong.
      await new Promise(r => setTimeout(r, 800));
      ({ data } = await apiFetch('/api/research-lines/website'));
    }
    if (!data?.length) {
      if (indexGrid) setError(indexGrid, 'Unable to load research lines right now. Please refresh the page.');
      if (clinicalList) setError(clinicalList, 'Unable to load research lines right now. Please refresh the page.');
      return;
    }

    // ── INDEX: landing research programme ──────────────────────────
    if (indexGrid) {
      const sorted = [...data].sort((a,b) => Number(a.line_number||0)-Number(b.line_number||0));
      indexGrid.style.transition = 'none';
      indexGrid.style.opacity = '0';
      indexGrid.innerHTML = sorted.map(line => {
        const n = Number(line.line_number) || 0;
        const pair = institutionalResearchLinePair(line);
        return `
          <a href="/line/?id=${encodeURIComponent(line.id)}" class="home-line-row reveal">
            <span class="home-line-copy">
              <span class="home-line-title"><span lang="en">${escHtml(pair[0])}</span><span lang="es">${escHtml(pair[1])}</span></span>
            </span>
          </a>`;
      }).join('');
      requestAnimationFrame(() => {
        indexGrid.style.transition = 'opacity .22s var(--ease-clinical)';
        indexGrid.style.opacity = '1';
      });
      if (window._revealObserver) indexGrid.querySelectorAll('.reveal').forEach(el => window._revealObserver.observe(el));
    }

    // ── RESEARCH PAGE: accepted editorial media rows ───────────────
    // Build line_number -> id map for study filtering and populate the
    // research filter from the same governed source of truth.
    window._researchLineMap = {};
    data.forEach(line => { window._researchLineMap[String(line.line_number)] = line.id; });

    const filterLineEl = document.getElementById('filterLine');
    if (filterLineEl && filterLineEl.options.length <= 1) {
      data.forEach(line => {
        const opt = document.createElement('option');
        opt.value = String(line.line_number);
        const pair = institutionalResearchLinePair(line);
        opt.dataset.labelEn = pair[0];
        opt.dataset.labelEs = pair[1];
        opt.textContent = institutionalResearchLineLabel(line);
        filterLineEl.appendChild(opt);
      });
    }

    if (clinicalList) {
      clinicalList.style.transition = 'none';
      clinicalList.style.opacity = '0';
      const sortedLines = [...data].sort((a,b) => Number(a.line_number||0)-Number(b.line_number||0));
      clinicalList.innerHTML = sortedLines.map(line => {
        const titlePair = institutionalResearchLinePair(line);
        const coordinator = line.coordinator?.full_name ? escHtml(line.coordinator.full_name) : '';
        const summaryRaw = researchOverviewSummary(line.description);
        const summary = summaryRaw || 'Clinical and translational research within this respiratory medicine area.';
        const lineNum = Number(line.line_number) || 0;
        const media = RESEARCH_LINE_MEDIA[lineNum] || '/assets/research/research-hero-clinician-lungs.jpg';
        return `
          <a class="research-line-row" data-line="${lineNum}" href="/line/?id=${encodeURIComponent(line.id)}">
            <span class="research-line__media" aria-hidden="true"><img src="${media}" alt="" loading="lazy" decoding="async"></span>
            <span class="research-line__content">
              <span class="research-line__title"><span lang="en">${escHtml(titlePair[0])}</span><span lang="es">${escHtml(titlePair[1])}</span></span>
              <span class="research-line__summary">${escHtml(summary)}</span>
            </span>
            ${coordinator ? `<span class="research-line__side"><span class="research-line__coord-label"><span lang="en">Coordination</span><span lang="es">Coordinación</span></span><span class="research-line__coordinator">${coordinator}</span></span>` : '<span class="research-line__side" aria-hidden="true"></span>'}
          </a>`;
      }).join('');
      requestAnimationFrame(() => {
        clinicalList.style.transition = 'opacity .22s var(--ease-clinical)';
        clinicalList.style.opacity = '1';
      });
    }

  } catch (err) {
    console.error('Research lines load failed:', err);
    if (indexGrid)    setError(indexGrid);
    if (clinicalList) setError(clinicalList);
  }
}


window.toggleLine = function(id) {
  const card = document.getElementById(id);
  if (card) card.classList.toggle('open');
};

// ─────────────────────────────────────────────
// 2. CLINICAL TRIALS (clinical.html)
// ─────────────────────────────────────────────

async function loadTrials(filters = {}) {
  const listEl  = document.getElementById('studiesBody');
  const countEl = document.getElementById('studiesCount');
  if (!listEl) return;

  setLoading(listEl, 4);

  const params = new URLSearchParams();
  if (filters.line && filters.line !== 'all') {
    const lineId = window._researchLineMap && window._researchLineMap[filters.line];
    if (lineId) params.set('line', lineId);
  }
  if (filters.phase  && filters.phase  !== 'all') params.set('phase',  filters.phase);
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);

  try {
    const { data } = await apiFetch(`/api/clinical-trials/website?${params}`);
    const priority = { 'Reclutando':0, 'Recruiting':0, 'Activo':1, 'Active':1, 'En preparación':2, 'Completado':3, 'Completed':3 };
    const trials = (data || []).slice().sort((a,b) => (priority[a.status] ?? 9) - (priority[b.status] ?? 9));

    if (countEl) countEl.textContent = trials.length;

    const studiesShown   = document.getElementById('studiesShown');
    const studiesShownEs = document.getElementById('studiesShownEs');
    if (studiesShown) studiesShown.textContent = trials.length;
    if (studiesShownEs) studiesShownEs.textContent = trials.length;

    const expandBtn = document.getElementById('studiesExpandBtn');
    if (!trials.length) {
      listEl.innerHTML = `<div class="api-error"><span lang="en">No studies match the current filters.</span><span lang="es">No hay estudios que coincidan con los filtros actuales.</span></div>`;
      if (expandBtn) expandBtn.hidden = true;
      return;
    }

    listEl.classList.remove('show-all');
    listEl.innerHTML = trials.map((t, index) => {
      window._trialData[t.id] = t;
      const statusClass = STATUS_CLASS[t.status] || 'active';
      const line = t.research_line || (t.additional_lines || [])[0] || null;
      const lineText = line ? escHtml(line.short_name || line.name) : '—';
      const phaseText = t.phase ? escHtml(t.phase) : '—';
      const hiddenClass = index >= 6 ? ' is-collapsed' : '';
      return `
        <button type="button" class="study-row${hiddenClass}" data-trial-id="${escHtml(t.id)}">
          <span class="study-row__protocol">${escHtml(t.protocol_id || '—')}</span>
          <span class="study-row__main">
            <span class="study-row__title">${escHtml(t.title || 'Untitled study')}</span>
            <span class="study-row__line">${lineText}</span>
          </span>
          <span class="study-row__facts">
            <span>${phaseText}</span>
            <span class="study-status ${statusClass}"><span lang="en">${STATUS_LABEL_EN[t.status] || escHtml(t.status || '—')}</span><span lang="es">${escHtml(t.status || '—')}</span></span>
          </span>
          <span class="study-row__sponsor">${t.sponsor_name ? escHtml(t.sponsor_name) : '—'}</span>
        </button>`;
    }).join('');

    listEl.querySelectorAll('.study-row[data-trial-id]').forEach(row => {
      row.addEventListener('click', () => openTrialModal(row.dataset.trialId, row));
    });

    if (expandBtn) {
      expandBtn.hidden = trials.length <= 6;
      if (!expandBtn.hidden) {
        const collapsed = trials.length - 6;
        const setLabel = (open) => {
          expandBtn.innerHTML = open
            ? `<span lang="en">Show fewer studies</span><span lang="es">Mostrar menos estudios</span>`
            : `<span lang="en">Show ${collapsed} more ${collapsed===1?'study':'studies'}</span><span lang="es">Mostrar ${collapsed} ${collapsed===1?'estudio más':'estudios más'}</span>`;
        };
        setLabel(false);
        expandBtn.onclick = () => {
          const open = listEl.classList.toggle('show-all');
          setLabel(open);
        };
      }
    }

  } catch (err) {
    console.error('Trials load failed:', err);
    setError(listEl);
    if (countEl) countEl.textContent = '—';
    const expandBtn = document.getElementById('studiesExpandBtn');
    if (expandBtn) expandBtn.hidden = true;
  }
}

// ─────────────────────────────────────────────
// 3. INNOVATION PROJECTS (innovation.html)
// ─────────────────────────────────────────────

async function loadProjects() {
  const host = document.getElementById('projectsGrid');
  if (!host) return;

  const readText = (project, key, lang) => {
    const direct = project?.[`${key}_${lang}`];
    if (direct != null && String(direct).trim()) return String(direct).trim();
    const value = project?.[key];
    if (value && typeof value === 'object') {
      const localised = value[lang];
      if (localised != null && String(localised).trim()) return String(localised).trim();
    }
    return value != null && typeof value !== 'object' ? String(value).trim() : '';
  };
  const localised = (project, key, fallback = '') => {
    const en = readText(project, key, 'en') || fallback;
    const es = readText(project, key, 'es') || en;
    return `<span lang="en">${escHtml(en)}</span><span lang="es">${escHtml(es)}</span>`;
  };
  const safeProjectUrl = project => {
    const value = String(project?.public_url || project?.website_url || project?.url || '').trim();
    return /^https?:\/\//i.test(value) ? value : '';
  };
  const partnerNeeds = project => Array.isArray(project?.partner_needs)
    ? project.partner_needs.map(v => String(v || '').trim()).filter(Boolean).join(' · ')
    : '';

  try {
    let { data } = await apiFetch('/api/innovation-projects/website');
    if (!Array.isArray(data)) {
      await new Promise(r => setTimeout(r, 500));
      ({ data } = await apiFetch('/api/innovation-projects/website'));
    }
    const projects = Array.isArray(data) ? data.filter(Boolean) : [];
    if (!projects.length) {
      host.innerHTML = `<p class="innovation-projects__empty"><span lang="en">No public innovation projects are available right now.</span><span lang="es">No hay proyectos públicos de innovación disponibles en este momento.</span></p>`;
      return;
    }

    host.innerHTML = projects.map(project => {
      const category = readText(project, 'category', 'en');
      const stage = readText(project, 'development_stage', 'en') || readText(project, 'current_stage', 'en');
      const needs = partnerNeeds(project);
      const url = safeProjectUrl(project);
      const meta = [category, project.is_featured ? 'Featured' : ''].filter(Boolean);
      return `<article class="innovation-project-row">
        <div class="innovation-project__main">
          ${meta.length ? `<p class="innovation-project__meta">${meta.map((m, i) => i === 1 ? `<span><span lang="en">Featured project</span><span lang="es">Proyecto destacado</span></span>` : `<span>${escHtml(m)}</span>`).join('')}</p>` : ''}
          <h3 class="innovation-project__title">${localised(project, 'title', 'Innovation project')}</h3>
          ${readText(project, 'description', 'en') || readText(project, 'description', 'es') ? `<p class="innovation-project__desc">${localised(project, 'description', '')}</p>` : ''}
        </div>
        <aside class="innovation-project__side">
          ${stage ? `<div class="innovation-project__fact"><span><span lang="en">Current stage</span><span lang="es">Etapa actual</span></span><p>${escHtml(stage)}</p></div>` : ''}
          ${needs ? `<div class="innovation-project__fact"><span><span lang="en">Collaboration sought</span><span lang="es">Colaboración buscada</span></span><p>${escHtml(needs)}</p></div>` : ''}
          ${url ? `<a class="innovation-project__link" href="${escHtml(url)}" target="_blank" rel="noopener"><span lang="en">Project information</span><span lang="es">Información del proyecto</span><span aria-hidden="true">↗</span></a>` : ''}
        </aside>
      </article>`;
    }).join('');
  } catch (err) {
    console.error('Projects load failed:', err);
    host.innerHTML = `<p class="innovation-projects__empty innovation-projects__empty--error"><span lang="en">Current innovation work could not be loaded. Please try again later.</span><span lang="es">No se pudo cargar la innovación en curso. Inténtelo de nuevo más tarde.</span></p>`;
  }
}

// ─────────────────────────────────────────────
// 4. NEWS (news.html)
// ─────────────────────────────────────────────

async function loadNews(filters = {}) {
  // Support both old 'newsFeed' and new 'blogFeed' element ids
  const feed = document.getElementById('blogFeed') || document.getElementById('newsFeed');
  if (!feed) return;

  // New blog page has its own skeleton (#feedSkeleton) — only inject if old layout
  if (!document.getElementById('feedSkeleton')) {
    feed.innerHTML = Array(4).fill('').map((_, i) => `
      <div class="news-api-skeleton-row news-api-skeleton-row--${i}">
        <div class="api-skeleton api-skeleton--story-kicker"></div>
        <div class="api-skeleton api-skeleton--story-title api-skeleton--delay-${i}"></div>
        <div class="api-skeleton api-skeleton--story-copy api-skeleton--delay-${i}"></div>
      </div>`).join('');
  }

  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.set('type', filters.type);
  if (filters.line) params.set('line', filters.line);

  try {
    const { data } = await apiFetch(`/api/news/website?${params}`);
    window._newsAllPosts = data || [];
    if (typeof window.onNewsLoaded === 'function') window.onNewsLoaded();
  } catch (err) {
    console.error('News load failed:', err);
    setError(feed, 'Could not load posts. Please try again later.');
  }
}

// ─────────────────────────────────────────────
// 5. TEAM (team.html)
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// TEAM PAGE — two targeted functions
// ─────────────────────────────────────────────

const EXPERTISE_MAP = {
  '04c82d53': ['Lung Transplant','PAH','ILD / IPF','CLAD'],
  '09ed9240': ['Severe Asthma','COPD','Biologics','Bronchiectasis','CF'],
  '97c8ee3f': ['EBUS-TBNA','Lung Cancer','Cryobiopsy','Bronchoscopy'],
  'e1cbfedb': ['NIV','Critical Care','Sleep Medicine','Home O₂'],
  '5d329d71': ['VATS','RATS','Thoracic Oncology','ERATS'],
  'c290a7e5': ['Precision Medicine','AI / Digital Health','Rare Diseases','AAT'],
};
function _getExpertise(id) {
  const prefix = (id||'').replace(/-/g,'').slice(0,8);
  return EXPERTISE_MAP[prefix] || [];
}

async function loadTeamLeads() {
  const grid = document.getElementById('leadsGrid');
  if (!grid) return;
  try {
    const { data } = await apiFetch('/api/team/website');
    const leads = (data||[]).filter(m => m.coordinates_line)
      .sort((a,b) => {
        if (a.is_chief_of_department && !b.is_chief_of_department) return -1;
        if (!a.is_chief_of_department && b.is_chief_of_department) return 1;
        return (a.coordinates_line?.line_number||99) - (b.coordinates_line?.line_number||99);
      });
    if (!leads.length) { grid.innerHTML = '<p class="state-empty">Research lead profiles coming soon.</p>'; return; }
    grid.style.transition = 'none';
    grid.style.opacity = '0';
    grid.innerHTML = leads.map((m,i) => {
      const initials = (m.full_name||'').split(' ').filter(w=>w&&!['Dr.','Dra.','Prof.'].includes(w)).slice(0,2).map(n=>n[0]).join('').toUpperCase();
      const lineNum = m.coordinates_line?.line_number ? String(m.coordinates_line.line_number).padStart(2,'0') : '';
      const lineName = m.coordinates_line?.name || '';
      const expertise = _getExpertise(m.id);
      const isAffiliated = m.is_external;
      const leadInitialsId = 'lav' + Math.random().toString(36).slice(2, 9);
      const avatarArea = m.public_photo_url
        ? `<img class="media-cover" src="${escHtml(m.public_photo_url)}" alt="${escHtml(m.full_name)}" loading="lazy" onerror="this.style.display='none';document.getElementById('${leadInitialsId}').style.display='inline';"/><span id="${leadInitialsId}" class="lead-initials is-hidden">${initials}</span>`
        : `<span class="lead-initials">${initials}</span>`;

      // Research-focus tags only — role/seniority (Chief, PI) moved to the
      // name area as plain text, since "JEFE DE SERVICIO" is a title, not
      // a topic, and competing for attention with real expertise tags
      // diluted both.
      const tags = expertise.map(t=>`<span class="lead-tag">${escHtml(t)}</span>`).join('');

      const roleLine = [
        m.is_chief_of_department ? `<span lang="en">Department Chief</span><span lang="es">Jefe de Servicio</span>` : '',
        m.id === 'c290a7e5-7bea-4652-a0ef-251fbc73184d'
          ? `<span lang="en">Principal Investigator, neumACt</span><span lang="es">Investigador Principal, neumACt</span>`
          : (m.can_be_pi ? `<span lang="en">Principal Investigator</span><span lang="es">Investigador Principal</span>` : ''),
      ].filter(Boolean).join(' · ');

      // The department chief is also the PI of the platform's own
      // flagship line — that's the single most important institutional
      // fact on this page, and it deserves to be read before anything
      // else, not buried in the small muted spec line alongside their
      // medical specialization. A dedicated banner replaces roleLine
      // for this one card; everyone else keeps the existing inline
      // treatment, which is the right amount of weight for their role.
      const isChiefCard = !!m.is_chief_of_department;
      const roleBanner = isChiefCard
        ? `<div class="lead-role-banner">${roleLine.replace(' · ', ' <span class="rb-sep">|</span> ')}</div>`
        : '';

      // Publication list — the genuine variable-depth element. Someone
      // with 6 papers gets a real list with overflow; someone with 1
      // gets exactly that, no padding, no invented stat tiles.
      // Note: deliberately NOT showing a trial/study count here — that
      // figure was derived from the coordinator's *line*, not personal
      // PI/co-investigator involvement (which isn't recorded in the
      // database yet), so it would overstate what's actually verified.
      const pubs = m.recent_pubs || [];
      const pubCount = m.publication_count || pubs.length;
      const pubList = pubs.length
        ? `<div class="lead-pubs">
             <p class="lead-pubs-label"><span lang="en">${pubCount} ${pubCount === 1 ? 'publication' : 'publications'}</span><span lang="es">${pubCount} ${pubCount === 1 ? 'publicación' : 'publicaciones'}</span></p>
             ${pubs.map(p => `
               <div class="lead-pub-row">
                 <span class="lp-year">${p.year || ''}</span>
                 <span class="lp-title-inline">${escHtml(p.title)}</span>
                 ${p.doi ? `<a href="https://doi.org/${escHtml(p.doi)}" target="_blank" rel="noopener" class="lp-doi-inline">DOI →</a>` : ''}
               </div>`).join('')}
             ${pubCount > pubs.length ? `<a href="/news" class="ls-link ls-link--more"><span lang="en">+${pubCount - pubs.length} more →</span><span lang="es">+${pubCount - pubs.length} más →</span></a>` : ''}
           </div>`
        : '';

      const partnerNote = m.seeking_partner
        ? `<a href="/innovation" class="ls-link ls-link--project">
             <span class="ls-dot ls-dot--amber"></span>
             <span lang="en">Seeking innovation partner</span><span lang="es">Buscando socio innovador</span> →
           </a>`
        : '';

      // Build the spec line as distinct, non-overlapping facts joined by
      // vertical bars -- not string concatenation that assumed
      // specialization and department affiliation would never say the
      // same thing. When someone's specialization literally is
      // "Neumología" at the Servicio de Neumología, the old fallback
      // text produced "Neumología · Neumología, Área Sanitaria da Coruña e Cee".
      const specParts = [];
      if (!isChiefCard && roleLine) specParts.push(roleLine);
      if (m.specialization) specParts.push(escHtml(m.specialization));
      if (isAffiliated) {
        specParts.push(escHtml(m.primary_dept_name || 'External'));
      } else if (!(m.specialization && /neumolog/i.test(m.specialization))) {
        specParts.push('Neumología, Área Sanitaria da Coruña e Cee');
      }
      const specLine = specParts.join(' <span class="lead-spec-sep">|</span> ');

      const delayClass = i > 0 ? ` reveal-d${Math.min(i,3)}` : '';
      const chiefClass = isChiefCard ? ' lead-chief' : '';
      return `<div class="lead-row${chiefClass} reveal${delayClass}">
        <div class="lead-visual">
          <div class="lead-avatar" data-line="L${lineNum}" aria-hidden="true">${avatarArea}</div>
          ${lineNum ? `<span class="lead-line-num">L${lineNum}</span>` : ''}
        </div>
        <div class="lead-copy">
          ${roleBanner}
          <div class="lead-name">${escHtml(m.display_name || m.full_name)}</div>
          <div class="lead-spec">${specLine}</div>
          ${lineName ? `<div class="lead-line-name">${escHtml(lineName)}</div>` : ''}
          ${m.public_bio ? `<p class="lead-bio">${escHtml(trimBioRolePrefix(m.public_bio))}</p>` : ''}
          ${tags ? `<div class="lead-tags">${tags}</div>` : ''}
          ${pubList}
          ${partnerNote}
        </div>
      </div>`;
    }).join('');
    requestAnimationFrame(() => { grid.style.transition = 'opacity .22s var(--ease-clinical)'; grid.style.opacity = '1'; });
    if (window._revealObserver) grid.querySelectorAll('.reveal').forEach(el=>window._revealObserver.observe(el));
  } catch(err) { console.error('Leads load failed:',err); grid.innerHTML='<p class="state-empty">Unable to load team profiles.</p>'; }
}

/* Person structured data for the whole team, injected once members
   load (the roster is API-driven, so this can't live statically in
   the HTML head). Each member becomes a schema.org Person affiliated
   with the department; ORCID becomes sameAs where present — the
   standard way research-group members get machine-readably linked to
   their institution and identifier graph. */
function injectTeamSchema(members) {
  if (document.getElementById('teamPersonSchema') || !members.length) return;
  const persons = members.map(m => {
    const p = {
      '@type': 'Person',
      'name': m.full_name || m.display_name,
      'affiliation': { '@type': 'MedicalOrganization',
        'name': 'Servicio de Neumología — Hospital Universitario A Coruña' }
    };
    if (m.specialization) p.jobTitle = m.specialization;
    if (m.orcid_id) p.sameAs = 'https://orcid.org/' + String(m.orcid_id).trim();
    if (m.public_photo_url) p.image = m.public_photo_url;
    return p;
  });
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'teamPersonSchema';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': persons });
  document.head.appendChild(s);
}

/* PHASE 2 · 5 — The group as a constellation. Research groups ARE
   networks; this shows it. Deterministic radial layout (no physics,
   no jitter between visits): line hubs evenly spaced on an outer
   ring, each hub's coordinator placed just inside it, remaining
   members as a quiet inner orbit around the department core.
   Hovering a hub brightens its edge + lead. Pure SVG from the same
   two endpoints the page already calls. */
async function loadTeamConstellation() {
  const host = document.getElementById('teamConstellation');
  const wrap = document.getElementById('constellationWrap');
  if (!host || !wrap) return;
  try {
    const [linesRes, teamRes] = await Promise.all([
      apiFetch('/api/research-lines/website'),
      apiFetch('/api/team/website')
    ]);
    const lines = linesRes.data || [];
    const team = teamRes.data || [];
    if (lines.length < 2) return;

    const W = 900, H = 560, cx = W/2, cy = H/2;
    const Rhub = 215, Rcoord = 150, Rorbit = 78;
    const others = team.filter(m => !m.coordinates_line);
    let edges = '', hubs = '', coords = '', orbit = '';

    lines.forEach((l, i) => {
      const a = -Math.PI/2 + (i / lines.length) * Math.PI * 2;
      const hx = cx + Math.cos(a)*Rhub, hy = cy + Math.sin(a)*Rhub;
      const kx = cx + Math.cos(a)*Rcoord, ky = cy + Math.sin(a)*Rcoord;
      const num = 'L' + String(l.line_number).padStart(2,'0');
      const name = escHtml(l.short_name || l.name || '');
      const coordName = l.coordinator?.full_name ? escHtml(l.coordinator.full_name) : '';
      const g = 'cg' + i;
      edges += `<line class="const-edge" data-g="${g}" x1="${cx}" y1="${cy}" x2="${kx.toFixed(1)}" y2="${ky.toFixed(1)}"/>`;
      edges += `<line class="const-edge" data-g="${g}" x1="${kx.toFixed(1)}" y1="${ky.toFixed(1)}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}"/>`;
      if (coordName) coords += `
        <g class="const-coord" data-g="${g}">
          <circle cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="6"/>
          <text x="${kx.toFixed(1)}" y="${(ky + (hy>cy?18:-12)).toFixed(1)}">${coordName}</text>
        </g>`;
      hubs += `
        <a href="/line/?id=${l.id}" class="const-hub" data-g="${g}">
          <circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="17"/>
          <text class="const-hub-num" x="${hx.toFixed(1)}" y="${(hy+4).toFixed(1)}">${num}</text>
          <text class="const-hub-name" x="${hx.toFixed(1)}" y="${(hy + (hy>cy?36:-26)).toFixed(1)}">${name}</text>
        </a>`;
    });

    others.forEach((m, i) => {
      const a = (i / Math.max(others.length,1)) * Math.PI * 2 + 0.35;
      const ox = cx + Math.cos(a)*Rorbit, oy = cy + Math.sin(a)*Rorbit;
      orbit += `<circle class="const-member" cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="3.2"><title>${escHtml(m.full_name || '')}</title></circle>`;
    });

    host.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${W} ${H}">
      <style>
        .const-edge{stroke:rgba(255,255,255,.14);stroke-width:1;transition:stroke .25s;}
        .const-hub circle{fill:rgba(0,179,179,.14);stroke:#00B3B3;stroke-width:1.4;transition:fill .25s;}
        .const-hub:hover circle,.const-hub:focus circle{fill:rgba(0,179,179,.4);}
        .const-hub-num{fill:#fff;font:600 11px 'DM Mono',monospace;text-anchor:middle;}
        .const-hub-name{fill:rgba(255,255,255,.55);font:500 11px 'DM Sans',sans-serif;text-anchor:middle;}
        .const-coord circle{fill:#fff;opacity:.75;transition:opacity .25s;}
        .const-coord text{fill:rgba(255,255,255,.45);font:400 10px 'DM Sans',sans-serif;text-anchor:middle;transition:fill .25s;}
        .const-member{fill:rgba(255,255,255,.30);}
        circle.const-core{fill:rgba(0,179,179,.9);}
        text.const-core-t{fill:rgba(255,255,255,.7);font:600 10px 'DM Mono',monospace;text-anchor:middle;letter-spacing:.1em;}
        g[data-lit="1"] .const-edge, .const-edge[data-lit="1"]{stroke:rgba(0,179,179,.75);}
      </style>
      <g id="constEdges">${edges}</g>
      ${orbit}
      <circle class="const-core" cx="${cx}" cy="${cy}" r="8"/>
      <text class="const-core-t" x="${cx}" y="${cy-16}">NEUMOLOGÍA</text>
      ${coords}
      ${hubs}
    </svg>`;

    // Hover a hub -> light its two edges + coordinator
    host.querySelectorAll('.const-hub').forEach(hub => {
      const g = hub.dataset.g;
      const lit = host.querySelectorAll(`[data-g="${g}"]`);
      hub.addEventListener('mouseenter', () => lit.forEach(el => {
        if (el.classList.contains('const-edge')) el.setAttribute('data-lit','1');
        if (el.classList.contains('const-coord')) el.querySelector('text').style.fill = '#00B3B3';
      }));
      hub.addEventListener('mouseleave', () => lit.forEach(el => {
        el.removeAttribute('data-lit');
        if (el.classList.contains('const-coord')) el.querySelector('text').style.fill = '';
      }));
    });
    wrap.style.display = '';
  } catch (err) {
    console.warn('Constellation unavailable:', err.message);
  }
}

async function loadTeamGroup() {
  const grid = document.getElementById('teamGroup');
  if (!grid) return;
  try {
    const { data } = await apiFetch('/api/team/website');
    const group = (data||[]).filter(m => !m.coordinates_line);
    if (!group.length) { grid.style.display='none'; return; }
    window._teamGroupData = group; // for the click-to-expand profile modal
    injectTeamSchema(data || []);
    const roleLabel = { attending_physician:'Attending Physician', medical_resident:'Resident', fellow:'Fellow', nurse_practitioner:'Nurse Practitioner', studies_coordinator:'Studies Coordinator', data_manager:'Data Manager', labtech:'Lab Technician', biomedical_engineer:'Biomedical Engineer', administrator:'Administrator' };
    grid.style.transition = 'none';
    grid.style.opacity = '0';
    grid.innerHTML = group.map(m => {
      const initials = (m.full_name||'').split(' ').filter(w=>w&&!['Dr.','Dra.','Prof.'].includes(w)).slice(0,2).map(n=>n[0]).join('').toUpperCase();
      const role = roleLabel[m.staff_type] || m.staff_type;
      return `<div class="team-member is-clickable" onclick="openProfileModal('${escHtml(m.id)}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openProfileModal('${escHtml(m.id)}');}" tabindex="0" role="button" aria-label="View profile for ${escHtml(m.full_name)}">
        <div class="tm-avatar">${m.public_photo_url ? `<img class="media-cover media-cover--circle" src="${escHtml(m.public_photo_url)}" alt="${escHtml(m.full_name)}" loading="lazy"/>` : initials}</div>
        <div class="min-w-0">
          <div class="tm-name">${escHtml(m.display_name || m.full_name)}</div>
          <div class="tm-role">${escHtml(role)}</div>
          ${m.specialization ? `<div class="tm-spec">${escHtml(m.specialization)}</div>` : ''}
        </div>
      </div>`;
    }).join('');
    requestAnimationFrame(() => { grid.style.transition = 'opacity .22s var(--ease-clinical)'; grid.style.opacity = '1'; });
  } catch(err) { console.error('Team group load failed:',err); if (grid) grid.innerHTML = '<p class="state-empty">Unable to load team list.</p>'; }
}

// Click-to-expand profile modal — shared by team.html's team-member cards.
// Looks up the already-fetched record by ID rather than a second request.
function openProfileModal(staffId) {
  const m = (window._teamGroupData || []).find(x => x.id === staffId);
  if (!m) return;
  const overlay = document.getElementById('profileModalOverlay');
  const content = document.getElementById('profileModalContent');
  if (!overlay || !content) return;
  const initials = (m.full_name||'').split(' ').filter(w=>w&&!['Dr.','Dra.','Prof.'].includes(w)).slice(0,2).map(n=>n[0]).join('').toUpperCase();
  const roleLabel = { attending_physician:'Attending Physician', medical_resident:'Resident', fellow:'Fellow', nurse_practitioner:'Nurse Practitioner', studies_coordinator:'Studies Coordinator', data_manager:'Data Manager', labtech:'Lab Technician', biomedical_engineer:'Biomedical Engineer', administrator:'Administrator' };
  const role = roleLabel[m.staff_type] || m.staff_type;
  const avatar = buildAvatar(m, 72);
  content.innerHTML = `
    <div class="profile-summary">
      ${avatar}
      <div>
        <p class="profile-summary__name">${escHtml(m.display_name || m.full_name)}</p>
        <p class="profile-summary__role">${escHtml(role)}</p>
        ${m.specialization ? `<p class="profile-summary__specialization">${escHtml(m.specialization)}</p>` : ''}
      </div>
    </div>
    ${m.public_bio
      ? `<p class="profile-summary__bio">${escHtml(m.public_bio)}</p>`
      : `<p class="profile-summary__bio profile-summary__bio--empty">Bio not yet added.</p>`}
    ${(m.orcid_id || m.scholar_url || m.researchgate_url) ? `
    <div class="scholar-links">
      ${m.orcid_id ? `<a href="https://orcid.org/${escHtml(String(m.orcid_id).trim())}" target="_blank" rel="noopener" class="scholar-link scholar-orcid"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zM7.4 18.4H5.5V7.6h1.9v10.8zM6.4 6.3a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2zm12.3 12.1h-1.9v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8v5.4H11V7.6h1.8v1.5h.03c.25-.48.87-1 1.8-1 1.9 0 2.3 1.27 2.3 2.9v5.4z"/></svg><span>ORCID <span class="scholar-id">${escHtml(String(m.orcid_id).trim())}</span></span></a>` : ''}
      ${m.scholar_url ? `<a href="${escHtml(m.scholar_url)}" target="_blank" rel="noopener" class="scholar-link">Google Scholar →</a>` : ''}
      ${m.researchgate_url ? `<a href="${escHtml(m.researchgate_url)}" target="_blank" rel="noopener" class="scholar-link">ResearchGate →</a>` : ''}
    </div>` : ''}
  `;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeProfileModal() {
  const overlay = document.getElementById('profileModalOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;

// Legacy loadTeam() — used by clinical.html #teamGrid.
// Excludes line coordinators — they already get a full profile card
// via loadTeamLeads() above this section; showing them again here in
// a flatter card was straight duplication, same person twice on one page.
async function loadTeam() {
  if (PAGE === 'team') return;
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  try {
    const { data } = await apiFetch('/api/team/website');
    const members = (data || []).filter(m => !m.coordinates_line);
    if (!members.length) { grid.innerHTML='<p class="team-empty-state">Team information coming soon.</p>'; return; }
    grid.style.transition = 'none';
    grid.style.opacity = '0';
    grid.innerHTML = members.map(m => {
      const initials = (m.full_name||'').split(' ').filter(w=>w&&!['Dr.','Dra.','Prof.'].includes(w)).slice(0,2).map(n=>n[0]).join('').toUpperCase();
      const lineTag = m.coordinates_line ? `<span class="tca-line">${escHtml(m.coordinates_line.name)}</span>` : '';
      const affiliTag = m.is_external ? `<span class="tca-affil">${escHtml(m.primary_dept_name||'Affiliated')}</span>` : '';
      return `<div class="team-card-api">
        <div class="tca-avatar">${m.public_photo_url ? `<img class="tca-avatar__image" src="${escHtml(m.public_photo_url)}" alt="${escHtml(m.full_name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><span class="tca-avatar__fallback">${escHtml(initials)}</span>` : initials}</div>
        <div class="flex-1 min-w-0">
          <div class="tca-name">${escHtml(m.display_name || m.full_name)}</div>
          ${m.specialization ? `<div class="tca-spec">${escHtml(m.specialization)}</div>` : ''}
          <div class="team-card__tags">${lineTag}${affiliTag}</div>
          ${m.public_bio ? `<p class="tca-bio">${escHtml(trimBioRolePrefix(m.public_bio))}</p>` : ''}
        </div>
      </div>`;
    }).join('');
    requestAnimationFrame(() => { grid.style.transition = 'opacity .22s var(--ease-clinical)'; grid.style.opacity = '1'; });
  } catch(err) { console.error('Team load failed:',err); grid.innerHTML='<p class="team-error-state">Unable to load team information.</p>'; }
}

// ─────────────────────────────────────────────
// 7. TEAM PAGE — PUBLICATION STRIP
// Horizontal scrolling journal index.
// NOT a duplicate of news.html — no body text.
// ─────────────────────────────────────────────

async function loadPublicationStrip() {
  const inner = document.getElementById('pubStripInner');
  const countEl = document.getElementById('pubCount');
  if (!inner) return;

  try {
    const { data } = await apiFetch('/api/news/website?type=publication&limit=30');
    const pubs = (data || []).filter(p => p.journal_name);

    if (!pubs.length) { inner.innerHTML = '<div class="pub-card pub-card--empty">No publications available.</div>'; return; }

    inner.style.transition = 'none';
    inner.style.opacity = '0';
    inner.innerHTML = pubs.map(p => {
      const year = p.published_at ? new Date(p.published_at).getFullYear() : '';
      const authorLine = p.authors_text ? p.authors_text.split(';')[0].trim() + (p.authors_text.includes(';') ? ' et al.' : '') : (p.author?.full_name || '');
      return `
        <div class="pub-card">
          <div class="pub-card-top">
            <span class="pub-journal" title="${escHtml(p.journal_name)}">${escHtml(p.journal_name)}</span>
            <span class="pub-year">${year}</span>
          </div>
          <div class="pub-title">${escHtml(p.title)}</div>
          ${authorLine ? `<div class="pub-authors">${escHtml(authorLine)}</div>` : ''}
          ${p.doi
            ? `<a href="https://doi.org/${escHtml(p.doi)}" target="_blank" rel="noopener" class="pub-doi-link">DOI →</a>`
            : `<a href="/news" class="pub-doi-link"><span lang="en">View</span><span lang="es">Ver</span> →</a>`}
        </div>`;
    }).join('');
    requestAnimationFrame(() => { inner.style.transition = 'opacity .22s var(--ease-clinical)'; inner.style.opacity = '1'; });

    if (countEl) countEl.textContent = `${pubs.length} publications`;

    // Scroll controls
    const scroll = document.getElementById('pubScroll');
    const prev = document.getElementById('pubPrev');
    const next = document.getElementById('pubNext');
    const STEP = 280;
    if (prev) prev.addEventListener('click', () => scroll.scrollBy({left:-STEP,behavior:'smooth'}));
    if (next) next.addEventListener('click', () => scroll.scrollBy({left: STEP,behavior:'smooth'}));

  } catch (err) {
    console.error('Publication strip failed:', err);
  }
}

// ─────────────────────────────────────────────
// 8. TEAM PAGE — OPEN OPPORTUNITIES
// Recruiting trials + innovation projects seeking partners.
// Unique content — not shown elsewhere.
// ─────────────────────────────────────────────

async function loadOpportunities() {
  const grid = document.getElementById('oppsGrid');
  const section = document.getElementById('opportunities');
  if (!grid) return;

  try {
    const [trialsRes, projectsRes] = await Promise.all([
      apiFetch('/api/clinical-trials/website'),
      apiFetch('/api/innovation-projects/website'),
    ]);

    const recruiting = (trialsRes.data || []).filter(t =>
      ['Reclutando','Recruiting'].includes(t.status)
    );
    const seekingProjects = (projectsRes.data || []).filter(p =>
      p.funding_status === 'seeking'
    );

    if (!recruiting.length && !seekingProjects.length) return; // keep section hidden

    if (section) section.style.display = '';

    const trialCards = recruiting.slice(0, 4).map(t => `
      <div class="opp-card">
        <span class="opp-type opp-type--trial">${escHtml(t.phase || 'Clinical Study')} · <span lang="en">Recruiting</span><span lang="es">Reclutando</span></span>
        <div class="opp-title">${escHtml(t.title || t.study_id || '—')}</div>
        <div class="opp-meta">${t.sponsor ? escHtml(t.sponsor) : ''}</div>
        <a href="/clinical" class="opp-link">
          <span lang="en">View study</span><span lang="es">Ver estudio</span>
          <svg class="icon icon--micro" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>`).join('');

    const projCards = seekingProjects.slice(0, 2).map(p => `
      <div class="opp-card">
        <span class="opp-type opp-type--inno"><span lang="en">Innovation · Seeking partner</span><span lang="es">Innovación · Buscando socio</span></span>
        <div class="opp-title">${escHtml(p.title || '—')}</div>
        <div class="opp-meta">${p.current_stage ? escHtml(p.current_stage.charAt(0).toUpperCase() + p.current_stage.slice(1)) : ''}</div>
        <a href="/innovation" class="opp-link">
          <span lang="en">View project</span><span lang="es">Ver proyecto</span>
          <svg class="icon icon--micro" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>`).join('');

    grid.innerHTML = trialCards + projCards;

  } catch (err) {
    console.error('Opportunities load failed:', err);
  }
}

async function loadLiveStats() {
  if (PAGE !== 'index') return;
  const tickerFacts = [];   /* 9 ── "department at work" hero ticker */
  try {
    const linesRes = await apiFetch('/api/research-lines/website');
    const lineCount = linesRes.data?.length || 0;
    if (lineCount > 0) {
      _setStat('statLines', lineCount);
      tickerFacts.push({en:`${lineCount} active research lines`, es:`${lineCount} líneas de investigación activas`});
      // Sum active trials across all lines
      const totalActive = linesRes.data.reduce((sum, l) => sum + (l.active_trials || 0), 0);
      if (totalActive > 0) {
        _setStat('statTrials', totalActive + '+');
        _setStat('statTrials2', totalActive + '+');
        _setStat('statTrialsBig', totalActive + '+');
        tickerFacts.push({en:`${totalActive}+ clinical trials enrolling`, es:`${totalActive}+ ensayos clínicos reclutando`});
      }
    }

    // Team count from website endpoint
    try {
      const teamRes = await apiFetch('/api/team/website');
      const memberCount = teamRes.data?.length || 0;
      if (memberCount > 0) _setStat('statMembers', memberCount);
    } catch { /* keep static fallback */ }

    // Publication count — limit=30 caps what the API actually returns, so
    // a count >=30 means there are more we haven't fetched; show "30+"
    // rather than silently understating the real total.
    try {
      const pubsRes = await apiFetch('/api/news/website?type=publication&limit=30');
      const pubCount = pubsRes.data?.length || 0;
      if (pubCount > 0) _setStat('statPubs', pubCount >= 30 ? '30+' : pubCount);
      const newest = (pubsRes.data || [])[0];
      const when = newest && (newest.published_at || newest.created_at);
      if (when) {
        const days = Math.max(0, Math.round((Date.now() - new Date(when)) / 86400000));
        tickerFacts.push(
          days === 0 ? {en:'latest publication: today', es:'última publicación: hoy'} :
          {en:`latest publication ${days} day${days===1?'':'s'} ago`,
           es:`última publicación hace ${days} día${days===1?'':'s'}`});
      }
    } catch { /* keep static fallback */ }

    startHeroTicker(tickerFacts);
  } catch (err) {
    console.warn('Live stats not available:', err.message);
  }
}

/* 9 ── Quiet proof-of-life line in the hero, cycling real facts drawn
   from the data loadLiveStats already fetches. Crossfades every 4s;
   under reduced motion it just shows the first fact, static. */
function startHeroTicker(facts) {
  const el = document.getElementById('liveTicker');
  if (!el || !facts.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0;
  function render(f) {
    el.innerHTML = `<span lang="en">${f.en}</span><span lang="es">${f.es}</span>`;
  }
  render(facts[0]);
  el.style.opacity = '1';
  if (reduced || facts.length < 2) return;
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => { i = (i + 1) % facts.length; render(facts[i]); el.style.opacity = '1'; }, 350);
  }, 4000);
}

/** Update any element with id matching statId */
function _setStat(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.dataset.counter = value;
  // If the element is already on screen by the time live data arrives,
  // animate to the real number now rather than leaving it static —
  // the IntersectionObserver in animations.js only fires once on first
  // entry, which may have already happened with the static fallback value.
  if (window._animateCounter) {
    window._animateCounter(el, value);
  } else {
    el.textContent = value;
  }
}

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────

function publicText(str) {
  if (!str) return '';
  return String(str)
    // Public identity rule: use the broad institutional name rather than
    // the hospital acronym even when legacy backend copy still contains it.
    .replace(/\bCHUAC\b/gi, 'Área Sanitaria da Coruña e Cee');
}

function escHtml(str) {
  if (!str) return '';
  return publicText(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Builds a self-healing avatar: a real photo if one exists, with a true
// onerror fallback to initials if the image fails to load (stale URL,
// deleted storage file, etc.) — not just a check that the URL string
// is non-empty, which says nothing about whether the image actually
// loads. Centralized here so every avatar site shares one fallback
// behavior instead of each reimplementing it slightly differently.
function buildAvatar(person, sizePx, shape = 'circle') {
  const initials = (person.full_name || '').split(' ')
    .filter(w => w && !['Dr.', 'Dra.', 'Prof.'].includes(w))
    .slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const fallbackId = 'av' + Math.random().toString(36).slice(2, 9);
  const supportedSize = [20, 22, 72].includes(Number(sizePx)) ? Number(sizePx) : 72;
  const shapeClass = shape === 'circle' ? 'person-avatar--circle' : 'person-avatar--rounded';
  const avatarClass = `person-avatar person-avatar--${supportedSize} ${shapeClass}`;
  const fallbackSpan = `<span id="${fallbackId}" class="${avatarClass} person-avatar--monogram is-hidden">${escHtml(initials)}</span>`;

  if (!person.public_photo_url) {
    return `<div class="${avatarClass} person-avatar--monogram">${escHtml(initials)}</div>`;
  }
  return `<div class="${avatarClass} person-avatar--frame">
    <img class="media-cover media-cover--block" src="${escHtml(person.public_photo_url)}" alt="${escHtml(person.full_name)}" loading="lazy" onerror="this.style.display='none';document.getElementById('${fallbackId}').style.display='flex';">
    ${fallbackSpan}
  </div>`;
}

// Every bio in the database opens with a role/affiliation sentence
// ("Head of Research Line N (neumACt – INIBIC)...", "Head of the
// Pulmonology Department within the Área Sanitaria da Coruña e Cee and Principal Investigator of...")
// that's now redundant — role and line are shown as structured fields
// above the bio. Strips that one leading sentence if it matches the
// pattern; leaves the bio untouched otherwise, so this never mangles
// a bio that doesn't follow the convention.
function trimBioRolePrefix(bio) {
  if (!bio) return bio;
  const sentences = bio.split(/(?<=[.!?])\s+/);
  if (sentences.length < 2) return bio;
  const first = sentences[0];
  const rolePattern = /^(Head of|Jefe de|Principal Investigator|Coordinator of|Coordinador[a]? de)/i;
  if (rolePattern.test(first)) {
    return sentences.slice(1).join(' ');
  }
  return bio;
}

function _fadeInRows(selector) {
  requestAnimationFrame(() => {
    document.querySelectorAll(selector).forEach((row, i) => {
      row.style.opacity = '0';
      row.style.transition = `opacity .25s var(--ease-clinical) ${i * 25}ms`;
      requestAnimationFrame(() => { row.style.opacity = '1'; });
    });
  });
}

// ─────────────────────────────────────────────
// TRIAL DETAIL MODAL
// ─────────────────────────────────────────────

window._trialData = {};
let _trialModalOrigin = null;
let _trialModalCloseTimer = null;

window.openTrialModal = function(id, origin) {
  const t = window._trialData[id];
  if (!t) return;

  const modal = document.getElementById('trialModal');
  if (!modal) return;
  if (_trialModalCloseTimer) {
    clearTimeout(_trialModalCloseTimer);
    _trialModalCloseTimer = null;
  }
  if (_trialModalOrigin && _trialModalOrigin !== origin) {
    _trialModalOrigin.classList.remove('is-study-origin');
    _trialModalOrigin.removeAttribute('aria-current');
  }
  _trialModalOrigin = origin && origin.isConnected ? origin : null;
  if (_trialModalOrigin) {
    _trialModalOrigin.classList.add('is-study-origin');
    _trialModalOrigin.setAttribute('aria-current','true');
  }

  const tmProtocol = document.getElementById('tmProtocol');
  const tmTitle = document.getElementById('tmTitle');
  const tmMeta = document.getElementById('tmMeta');
  if (tmProtocol) tmProtocol.textContent = t.protocol_id;
  if (tmTitle) tmTitle.textContent = t.title;

  const statusClass = STATUS_CLASS[t.status] || 'active';
  const statusLabel = STATUS_LABEL_EN[t.status] || t.status;
  const lineName = t.research_line?.name || '—';
  const lineNum  = t.research_line?.line_number ? `0${t.research_line.line_number}`.slice(-2) : '—';

  if (tmMeta) tmMeta.innerHTML = `
    <div class="trial-meta-item">
      <div class="trial-meta-item__label">Status</div>
      <span class="status-badge ${statusClass} badge--fit">
        <span lang="en">${statusLabel}</span><span lang="es">${t.status}</span>
      </span>
    </div>
    <div class="trial-meta-item">
      <div class="trial-meta-item__label">Phase</div>
      <span class="phase-badge badge--fit">${escHtml(t.phase)}</span>
    </div>
    <div class="trial-meta-item">
      <div class="trial-meta-item__label">Research Line</div>
      <span class="trial-meta-item__value">${escHtml(lineNum)} — ${escHtml(lineName)}</span>
    </div>
    <div class="trial-meta-item">
      <div class="trial-meta-item__label">Sponsor</div>
      <span class="trial-meta-item__value">${t.sponsor_name ? escHtml(t.sponsor_name) : '—'}</span>
    </div>
    ${t.study_type ? `
    <div class="trial-meta-item">
      <div class="trial-meta-item__label">Study Type</div>
      <span class="trial-meta-item__value">${escHtml(t.study_type)}</span>
    </div>` : ''}
    ${t.sponsor_type ? `
    <div class="trial-meta-item">
      <div class="trial-meta-item__label">Sponsor Type</div>
      <span class="trial-meta-item__value">${escHtml(t.sponsor_type)}</span>
    </div>` : ''}
  `;

  // ── Registry verification: NCT / EudraCT links to official registries.
  // These are the identifiers a reviewer or pharma BD lead looks up to
  // confirm a trial is real and registered. Rendered only when present.
  const tmRegistry = document.getElementById('tmRegistry');
  if (tmRegistry) {
    const badges = [];
    if (t.nct_number) {
      const nct = String(t.nct_number).trim();
      badges.push(`<a href="https://clinicaltrials.gov/study/${encodeURIComponent(nct)}" target="_blank" rel="noopener" class="registry-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
        <span class="registry-badge-id">${escHtml(nct)}</span>
        <span class="registry-badge-src">ClinicalTrials.gov</span>
      </a>`);
    }
    if (t.eudract_number) {
      const eud = String(t.eudract_number).trim();
      const url = t.registry_url || `https://www.clinicaltrialsregister.eu/ctr-search/search?query=${encodeURIComponent(eud)}`;
      badges.push(`<a href="${escHtml(url)}" target="_blank" rel="noopener" class="registry-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
        <span class="registry-badge-id">${escHtml(eud)}</span>
        <span class="registry-badge-src">EU CTR · EudraCT</span>
      </a>`);
    }
    if (badges.length) {
      tmRegistry.innerHTML = `<div class="registry-label"><span lang="en">Registered &amp; verifiable</span><span lang="es">Registrado y verificable</span></div><div class="registry-badges">${badges.join('')}</div>`;
      tmRegistry.style.display = 'block';
    } else {
      tmRegistry.style.display = 'none';
    }
  }

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('trial-detail-open');
  requestAnimationFrame(() => {
    modal.classList.add('is-open');
    const dialog = modal.querySelector('.trial-modal__dialog');
    if (dialog) dialog.focus({preventScroll:true});
  });
};

window.closeTrialModal = function(restoreFocus = true) {
  const modal = document.getElementById('trialModal');
  const origin = _trialModalOrigin;
  _trialModalOrigin = null;
  if (origin) {
    origin.classList.remove('is-study-origin');
    origin.removeAttribute('aria-current');
  }
  document.body.classList.remove('trial-detail-open');
  document.body.style.overflow = '';
  if (!modal) {
    if (restoreFocus && origin && origin.isConnected) origin.focus({preventScroll:true});
    return;
  }
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  _trialModalCloseTimer = setTimeout(() => {
    modal.style.display = 'none';
    _trialModalCloseTimer = null;
    if (restoreFocus && origin && origin.isConnected) {
      try { origin.focus({preventScroll:true}); } catch (_e) { origin.focus(); }
    }
  }, 220);
};

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') window.closeTrialModal(true);
});
// ─────────────────────────────────────────────

// Shows a brief, visible validation message above the submit button —
// previously a missing name/email silently did nothing at all, since
// novalidate suppressed the browser's own warning and there was no
// fallback message of any kind.
function contactStateMarkup(en, es) {
  return '<span lang="en">'+en+'</span><span lang="es">'+es+'</span>';
}

function showFormError(form, en, es) {
  let el = form.querySelector('.form-error-msg');
  if (!el) {
    el = document.createElement('div');
    el.className = 'form-error-msg';
    el.setAttribute('role','status');
    el.setAttribute('aria-live','polite');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.insertAdjacentElement('beforebegin', el);
    else form.appendChild(el);
  }
  el.innerHTML = contactStateMarkup(en, es);
  el.hidden = false;
}

function clearFormError(form) {
  const el = form.querySelector('.form-error-msg');
  if (el) {
    el.hidden = true;
    el.innerHTML = '';
  }
}

function initContactForm() {
  // Different pages use different form ids (index uses 'contactForm',
  // clinical uses 'researchForm', innovation uses 'innovForm') — check all of them.
  const form = document.getElementById('contactForm')
            || document.getElementById('researchForm')
            || document.getElementById('innovForm');
  if (!form) return;

  const success = document.getElementById('formSuccess');
  const successOriginalHTML = success ? success.innerHTML : '';
  let stateTimer = null;

  if (success) {
    success.setAttribute('role','status');
    success.setAttribute('aria-live','polite');
    success.setAttribute('aria-atomic','true');
  }

  function clearStateTimer() {
    if (stateTimer) {
      clearTimeout(stateTimer);
      stateTimer = null;
    }
  }

  function resetStatus() {
    clearStateTimer();
    clearFormError(form);
    if (!success) return;
    success.classList.remove('show','is-error');
    success.innerHTML = successOriginalHTML;
  }

  function showStatus(kind, en, es, timeout) {
    if (!success) return;
    clearStateTimer();
    success.classList.toggle('is-error',kind === 'error');
    success.innerHTML = kind === 'success' ? successOriginalHTML : contactStateMarkup(en, es);
    success.classList.add('show');
    stateTimer = setTimeout(() => {
      success.classList.remove('show','is-error');
      success.innerHTML = successOriginalHTML;
      stateTimer = null;
    }, timeout);
  }

  // Pre-fill context when arriving from a specific line.html page's
  // "Get in touch" link, instead of every line funneling to the exact
  // same blank, generic form with no record of which line prompted it.
  const lineParam = new URLSearchParams(window.location.search).get('line');
  if (lineParam) {
    const msgField = form.querySelector('[name="message"]');
    if (msgField && !msgField.value) {
      msgField.value = `Regarding: ${lineParam}\n\n`;
    }
  }

  form.addEventListener('input',function(){
    const el=form.querySelector('.form-error-msg');
    if(el&&!el.hidden) clearFormError(form);
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';
    resetStatus();

    // Collect fields by their `name` attribute. This is robust to each page's
    // own field order/layout, unlike reading by position.
    const data = {};
    form.querySelectorAll('[name]').forEach(el => {
      data[el.name] = el.value;
    });

    // Some pages have an additional enquiry topic. Fold it into the free-text
    // message so no page-specific context is silently discarded.
    let message = data.message || '';
    if (data.secondary_topic) {
      message = `[${data.secondary_topic}]\n\n${message}`;
    }

    const payload = {
      name:             (data.contact_name || '').trim(),
      organisation:     (data.organisation || '').trim(),
      email:            (data.email || '').trim(),
      area_of_interest: data.area_of_interest || '',
      message:          message
    };

    if (!payload.name || !payload.email) {
      showFormError(
        form,
        'Please add your name and email before sending.',
        'Añada su nombre y correo electrónico antes de enviar.'
      );
      return;
    }

    // Loading state remains bilingual and restores each page's own button label.
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-busy','true');
      btn.innerHTML = `<svg class="icon icon--spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg><span lang="en">Sending…</span><span lang="es">Enviando…</span>`;
    }

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let json = {};
      try { json = await res.json(); } catch (_) {}
      if (!res.ok) throw new Error(json.error || 'Submission failed');

      form.reset();
      showStatus('success','','',7000);
    } catch (err) {
      console.error('Contact form error:', err);
      showStatus(
        'error',
        'The enquiry could not be sent. Please try again later.',
        'No se ha podido enviar la consulta. Inténtelo de nuevo más tarde.',
        6000
      );
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        btn.innerHTML = originalText;
      }
    }
  });
}

// Add spin keyframe for loading button
if (!document.getElementById('api-spin-style')) {
  const s = document.createElement('style');
  s.id = 'api-spin-style';
  s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

// 5b. CONTACT FORM TRIGGER TOGGLE
// Used by the form-trigger card on clinical.html and innovation.html —
// expands/collapses the form body and flips aria-expanded. Called via
// inline onclick="openContactForm('id','id')" in the HTML, so it must be
// global. Was referenced but never defined — this was throwing
// "openContactForm is not defined" on every click.
// ─────────────────────────────────────────────

window.openContactForm = function(triggerId, bodyId) {
  const trigger = document.getElementById(triggerId);
  const body = document.getElementById(bodyId);
  if (!trigger || !body) return;

  const isOpen = body.classList.contains('open');
  if (isOpen) {
    body.classList.remove('open');
    body.style.maxHeight = '0';
    trigger.setAttribute('aria-expanded', 'false');
  } else {
    body.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
    trigger.setAttribute('aria-expanded', 'true');
    setTimeout(() => { body.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 150);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  switch (PAGE) {
    case 'index':
      loadResearchLines();
      loadHomepageCurrentWork();
      initContactForm();
      break;
    case 'clinical':
      loadResearchLines();
      initTrialFilters();
      initContactForm();
      break;
    case 'innovation':
      loadProjects();
      initContactForm();
      break;
    case 'news':
      loadNews();
      break;
    case 'team':
      loadTeamLeads();
      loadTeamGroup();
      loadTeamConstellation();
      loadPublicationStrip();
      loadOpportunities();
      break;
    case 'line':
      loadLineDetail();
      break;
  }
});

function initTrialFilters() {
  const listEl = document.getElementById('studiesBody');
  if (!listEl) return;
  const line = document.getElementById('filterLine');
  const phase = document.getElementById('filterPhase');
  const status = document.getElementById('filterStatus');
  const search = document.getElementById('filterSearch');
  let timer = null;
  const run = () => loadTrials({
    line: line?.value || 'all',
    phase: phase?.value || 'all',
    status: status?.value || 'all',
    search: (search?.value || '').trim()
  });
  [line, phase, status].forEach(el => el?.addEventListener('change', run));
  search?.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, 220);
  });
  run();
}

// ─────────────────────────────────────────────
// 6. HOMEPAGE CURRENT WORK
// One governed public research output + one governed innovation project.
// No fabricated media or placeholder records.
// ─────────────────────────────────────────────

async function loadHomepageCurrentWork() {
  const section = document.getElementById('storySection');
  const stageLabels = {
    'Idea':'Concept','Prototipo':'Prototype','Piloto':'Pilot','Validación':'Validation','Escalamiento':'Scaling','Comercialización':'Commercialisation'
  };
  if (!section) return;

  try {
    const [newsRes, innovationRes] = await Promise.all([
      apiFetch('/api/news/website?limit=8'),
      apiFetch('/api/innovation-projects/website')
    ]);

    const posts = (newsRes?.data || []).slice().sort((a,b) => new Date(b.published_at || b.created_at || 0) - new Date(a.published_at || a.created_at || 0));
    const projects = innovationRes?.data || [];
    const publication = posts.find(p => p.is_featured && p.post_type === 'publication') || posts.find(p => p.post_type === 'publication') || posts.find(p => p.is_featured) || posts[0] || null;
    const project = projects.find(p => p.is_featured) || projects[0] || null;

    if (!publication && !project) {
      section.innerHTML = '<p class="content-empty-state"><span lang="en">No current public research or innovation records are available right now.</span><span lang="es">No hay registros públicos actuales de investigación o innovación disponibles en este momento.</span></p>';
      return;
    }

    const dateMarkup = d => {
      if (!d) return '';
      const dt = new Date(d); if (Number.isNaN(dt.getTime())) return '';
      const en = dt.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
      const es = dt.toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'});
      return `<span lang="en">${escHtml(en)}</span><span lang="es">${escHtml(es)}</span>`;
    };
    const lineName = record => record?.research_line?.short_name || record?.research_line?.name || '';

    const publicationHtml = publication ? (() => {
      const image = publication.featured_image_url || (Array.isArray(publication.image_urls) ? publication.image_urls[0] : '') || '';
      const authors = publication.authors_text || publication.author?.full_name || '';
      const meta = [publication.journal_name || '', dateMarkup(publication.published_at), lineName(publication)].filter(Boolean);
      return `<a class="home-current-record home-current-record--publication${image ? '' : ' home-current-record--text-only'}" href="/news/?post=${encodeURIComponent(publication.id)}">
        ${image ? `<div class="home-current-record__media"><img src="${escHtml(image)}" alt="" loading="lazy" decoding="async"></div>` : ''}
        <div class="home-current-record__body">
          <span class="home-current-kind"><span lang="en">Scientific publication</span><span lang="es">Publicación científica</span></span>
          <h3>${escHtml(publication.title || '—')}</h3>
          ${authors ? `<p class="home-current-authors">${escHtml(authors)}</p>` : ''}
          <div class="home-current-meta">${meta.map(x=>`<span>${x}</span>`).join('')}</div>
          <span class="home-current-action"><span lang="en">Open record</span><span lang="es">Abrir registro</span></span>
        </div>
      </a>`;
    })() : '';

    const projectHtml = project ? (() => {
      const stageRaw = project.current_stage || project.development_stage || '';
      const stageLabel = stageLabels[stageRaw] || stageRaw;
      const category = project.category || '';
      const meta = [category, stageLabel, lineName(project)].filter(Boolean);
      return `<a class="home-current-record home-current-record--innovation" href="/innovation/">
        <span class="home-current-kind"><span lang="en">Clinical innovation</span><span lang="es">Innovación clínica</span></span>
        <h3>${escHtml(project.title || '—')}</h3>
        ${project.description ? `<p class="home-current-description">${escHtml(project.description)}</p>` : ''}
        <div class="home-current-meta">${meta.map(x=>`<span>${escHtml(String(x))}</span>`).join('')}</div>
        <span class="home-current-action"><span lang="en">View project</span><span lang="es">Ver proyecto</span></span>
      </a>`;
    })() : '';

    section.innerHTML = `<div class="home-current-grid">${publicationHtml}${projectHtml}</div>`;
  } catch (err) {
    console.error('Homepage current-work load failed:', err);
    section.innerHTML = '<p class="content-empty-state"><span lang="en">Current public work is temporarily unavailable.</span><span lang="es">El trabajo público actual no está disponible temporalmente.</span></p>';
  }
}

// ─────────────────────────────────────────────
// 8. RESEARCH LINE DETAIL PAGE (line.html?id=<uuid>)
// One template, data-driven — see /api/research-lines/:id/website.
// Trials and publications are NOT fetched from that endpoint; they reuse
// the existing /api/clinical-trials/website?line=:id and
// /api/news/website?line=:id calls, same data source as clinical.html
// and news.html, so there's one source of truth.
// "About this line" only renders if a coordinator has actually written
// deep_content — an empty section is worse than no section.
// ─────────────────────────────────────────────


async function loadLineDetail() {
  const params = new URLSearchParams(location.search);
  const lineId = params.get('id');
  const loadingEl   = document.getElementById('lineLoadingState');
  const notFoundEl  = document.getElementById('lineNotFound');
  const loadErrorEl = document.getElementById('lineLoadError');
  const heroEl      = document.getElementById('lineHero');

  const showLineEl = (el) => {
    if (!el) return;
    el.classList.remove('is-hidden');
    el.classList.add('is-visible');
  };
  const hideLineEl = (el) => {
    if (!el) return;
    el.classList.remove('is-visible');
    el.classList.add('is-hidden');
  };
  const statusLabel = (status) => {
    const key = String(status || '').toLowerCase();
    if (['reclutando','recruiting'].includes(key)) return ['Recruiting','Reclutando'];
    if (['activo','active'].includes(key)) return ['Active','Activo'];
    if (['completado','completed'].includes(key)) return ['Completed','Completado'];
    if (['en preparación','preparing'].includes(key)) return ['In preparation','En preparación'];
    return [status || '', status || ''];
  };
  const stageLabel = (stage) => ({
    concept: ['Concept', 'Concepto'], development: ['Development', 'Desarrollo'],
    pilot: ['Pilot', 'Piloto'], validation: ['Validation', 'Validación'],
    scaling: ['Scaling', 'Escalado'], completed: ['Completed', 'Completado']
  }[String(stage || '').toLowerCase()] || [stage || '', stage || '']);
  const studyTypeLabel = (type) => {
    const key = String(type || '').toLowerCase();
    if (key === 'interventional') return ['Clinical trial','Ensayo clínico'];
    if (key === 'observational') return ['Observational study','Estudio observacional'];
    if (key === 'expanded access') return ['Expanded access','Acceso expandido'];
    return ['Clinical study','Estudio clínico'];
  };
  const bilingual = (en, es) => `<span lang="en">${escHtml(en)}</span><span lang="es">${escHtml(es)}</span>`;
  let trajectoryTrigger = null;
  let trajectoryCloseTimer = null;

  const evidenceText = value => {
    if (!value) return ['', ''];
    if (typeof value === 'object') return [String(value.en || value.es || ''), String(value.es || value.en || '')];
    const raw = String(value);
    return [raw, raw];
  };

  const renderTrajectorySection = (labelEn, labelEs, items) => {
    const list = (items || []).filter(Boolean);
    if (!list.length) return '';
    return `<section class="line-trajectory__section">
      <h3 class="line-trajectory__section-label">${bilingual(labelEn,labelEs)}</h3>
      <ul class="line-trajectory__list">${list.map(item => {
        const raw = item.description || item.title || item;
        const [en,es] = evidenceText(raw);
        return `<li>${bilingual(en || es,es || en)}</li>`;
      }).join('')}</ul>
    </section>`;
  };

  const closeTrajectory = () => {
    const overlay = document.getElementById('lineTrajectoryOverlay');
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('line-trajectory-open');
    const restore = trajectoryTrigger;
    if (trajectoryCloseTimer) window.clearTimeout(trajectoryCloseTimer);
    trajectoryCloseTimer = window.setTimeout(() => {
      overlay.hidden = true;
      trajectoryCloseTimer = null;
      if (restore && document.contains(restore)) restore.focus({preventScroll:true});
    }, 240);
  };

  const openTrajectory = (trigger) => {
    const overlay = document.getElementById('lineTrajectoryOverlay');
    const sheet = document.getElementById('lineTrajectorySheet');
    if (!overlay || !sheet) return;
    trajectoryTrigger = trigger || document.activeElement;
    if (trajectoryCloseTimer) { window.clearTimeout(trajectoryCloseTimer); trajectoryCloseTimer = null; }
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('line-trajectory-open');
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      sheet.focus({preventScroll:true});
    });
  };

  const initTrajectorySheet = () => {
    document.getElementById('lineTrajectoryButton')?.addEventListener('click',event => openTrajectory(event.currentTarget));
    document.getElementById('lineTrajectoryClose')?.addEventListener('click',closeTrajectory);
    document.getElementById('lineTrajectoryBackdrop')?.addEventListener('click',closeTrajectory);
    document.addEventListener('keydown',event => {
      const overlay = document.getElementById('lineTrajectoryOverlay');
      if (!overlay || overlay.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); closeTrajectory(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...overlay.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.hidden && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      const sheet = document.getElementById('lineTrajectorySheet');
      if (document.activeElement === sheet) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  };
  initTrajectorySheet();

  if (!lineId) {
    hideLineEl(loadingEl);
    showLineEl(notFoundEl);
    return;
  }

  let line;
  try {
    ({ data: line } = await apiFetch(`/api/research-lines/${lineId}/website`));
    if (!line) {
      await new Promise(r => setTimeout(r, 500));
      ({ data: line } = await apiFetch(`/api/research-lines/${lineId}/website`));
    }
    if (!line) throw new Error('not found');
  } catch (err) {
    console.error('Research line load failed:', err.message);
    hideLineEl(loadingEl);
    showLineEl(loadErrorEl);
    return;
  }

  try {
    // Fetch every public evidence stream before revealing the page. The loader
    // therefore represents real work rather than disappearing while evidence
    // lists continue to jump into place underneath the user.
    const [studiesResult, projectsResult, pubsResult] = await Promise.allSettled([
      apiFetch(`/api/clinical-trials/website?line=${encodeURIComponent(lineId)}`),
      apiFetch(`/api/innovation-projects/website?line=${encodeURIComponent(lineId)}`),
      apiFetch(`/api/news/website?type=publication&line=${encodeURIComponent(lineId)}&limit=100`)
    ]);
    const allStudies = studiesResult.status === 'fulfilled' ? (studiesResult.value?.data || []) : [];
    const allProjects = projectsResult.status === 'fulfilled' ? (projectsResult.value?.data || []) : [];
    const allPublications = pubsResult.status === 'fulfilled' ? (pubsResult.value?.data || []) : [];

    const activeStatuses = new Set(['reclutando','activo','active','recruiting','en preparación','preparing']);
    const activeStudies = allStudies.filter(t => activeStatuses.has(String(t.status || '').toLowerCase()));
    const activeProjects = allProjects.filter(p => String(p.current_stage || '').toLowerCase() !== 'completed');
    const clinicalTrials = activeStudies.filter(t => String(t.study_type || '').toLowerCase() === 'interventional');
    const clinicalStudies = activeStudies.filter(t => String(t.study_type || '').toLowerCase() !== 'interventional');


    // SEO identity for the shared line template.
    const lineTitlePair = institutionalResearchLinePair(line);
    const titleText = `${institutionalResearchLineLabel(line)} | neumACt R&I`;
    document.title = titleText;
    const summary = lineCleanSummary(line.description || '');
    const descTag = document.getElementById('pageDescription');
    if (descTag && summary) descTag.setAttribute('content', summary);
    const canonicalUrl = `${window.NEUMAC_CONFIG.siteBase}/line/?id=${lineId}`;
    const canonicalTag = document.getElementById('canonicalLink');
    if (canonicalTag) canonicalTag.setAttribute('href', canonicalUrl);
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) ogTitleTag.setAttribute('content', titleText);
    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag && summary) ogDescTag.setAttribute('content', summary);
    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) ogUrlTag.setAttribute('content', canonicalUrl);
    const jsonLdTag = document.getElementById('lineJsonLd');
    if (jsonLdTag) {
      jsonLdTag.textContent = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebPage', name: titleText,
        description: summary || `Research area within the neumACt R&I programme.`,
        isPartOf: { '@type': 'WebSite', url: window.NEUMAC_CONFIG.siteBase, name: 'neumACt R&I' }
      });
    }

    // Hero owns the scientific identity. The content below no longer repeats a
    // second "about this line" essay.
    const eyebrowEl = document.getElementById('lineEyebrow');
    if (eyebrowEl) {
      eyebrowEl.innerHTML = `<a href="/clinical/"><span lang="en">Research</span><span lang="es">Investigación</span></a>`;
    }
    const titleEl = document.getElementById('lineTitle');
    if (titleEl) titleEl.innerHTML = `<span lang="en">${escHtml(lineTitlePair[0])}</span><span lang="es">${escHtml(lineTitlePair[1])}</span>`;
    const summaryEl = document.getElementById('lineHeroSummary');
    if (summaryEl) summaryEl.textContent = summary;
    const heroImg = document.getElementById('lineHeroImage');
    if (heroImg) {
      heroImg.src = lineDetailHeroMedia(line);
      heroImg.alt = `${institutionalResearchLineLabel(line)} — neumACt`;
    }
    const keywordsEl = document.getElementById('lineKeywords');
    if (keywordsEl && Array.isArray(line.keywords)) {
      keywordsEl.innerHTML = line.keywords.slice(0, 6).map(k => `<span class="line-topic">${escHtml(k)}</span>`).join('');
    }
    showLineEl(heroEl);

    // Coordinator is evidence of the line's scientific leadership, not the
    // destination. The preview renders only approved/available evidence and
    // remains independent from the live activity metrics below.
    const leadershipSection = document.getElementById('lineLeadershipSection');
    const introSection = document.getElementById('lineIntroSection');
    const coordCard = document.getElementById('lineCoordinatorCard');
    const signalsHost = document.getElementById('lineLeadershipSignals');
    const trajectoryButton = document.getElementById('lineTrajectoryButton');
    if (coordCard && line.coordinator) {
      const c = line.coordinator;
      const displayName = String(c.full_name || '').replace(/^(?:Prof\.?\s*)?(?:Dr\.?|Dra\.?)\s+/i, '').trim();
      const initials = displayName.split(' ').filter(Boolean).slice(0,2).map(n => n[0]).join('').toUpperCase();
      const photo = coordinatorEditorialPhoto(c);
      const portrait = photo
        ? `<div class="line-lead__portrait"><img src="${escHtml(photo)}" alt="${escHtml(c.full_name)}" loading="eager" onerror="this.parentElement.innerHTML='<div class=&quot;line-lead__portrait-fallback&quot;>${escHtml(initials)}</div>'"></div>`
        : `<div class="line-lead__portrait"><div class="line-lead__portrait-fallback">${escHtml(initials)}</div></div>`;
      coordCard.innerHTML = `${portrait}<div class="line-lead__copy">
        <p class="line-lead__kicker"><span lang="en">Line coordination</span><span lang="es">Coordinación de la línea</span></p>
        <h2 class="line-lead__name">${escHtml(displayName)}</h2>
        ${c.specialization ? `<p class="line-lead__specialty">${escHtml(c.specialization)}</p>` : ''}
        <p class="line-lead__affiliation">Servicio de Neumología · Área Sanitaria da Coruña e Cee</p>
        <div class="line-lead__bio">${coordinatorEditorialBio(c, line)}</div>
      </div>`;

      const leadershipData = line.scientific_leadership || c.scientific_leadership || c.public_profile?.scientific_leadership || {};
      const evidence = Array.isArray(leadershipData.evidence) ? leadershipData.evidence
        : (Array.isArray(c.public_evidence) ? c.public_evidence : []);
      const approved = evidence.filter(item => !item?.visibility || item.visibility === 'approved_public');
      const groups = [
        {
          key:'leadership',
          title:['Scientific leadership & contribution','Liderazgo y contribución científica'],
          mark:'01',
          types:new Set(['scientific_leadership','clinical_leadership','guideline','consensus','programme_milestone'])
        },
        {
          key:'recognition',
          title:['Recognition','Reconocimiento'],
          mark:'02',
          types:new Set(['recognition','award'])
        },
        {
          key:'networks',
          title:['Networks & societies','Redes y sociedades'],
          mark:'03',
          types:new Set(['society_role','network_role','registry_role'])
        }
      ];
      const signalItems = groups.map(group => {
        const item = approved
          .filter(entry => group.types.has(String(entry?.type || '').toLowerCase()))
          .sort((a,b) => Number(a?.display_priority ?? 50) - Number(b?.display_priority ?? 50))[0];
        if (!item) return null;
        const raw = item.description || item.title || '';
        const en = typeof raw === 'object' ? (raw.en || raw.es || '') : String(raw);
        const es = typeof raw === 'object' ? (raw.es || raw.en || '') : String(raw);
        if (!en && !es) return null;
        return `<article class="line-leadership__signal">
          <span class="line-leadership__signal-mark" aria-hidden="true">${group.mark}</span>
          <h3>${bilingual(group.title[0],group.title[1])}</h3>
          <p>${bilingual(en || es,es || en)}</p>
        </article>`;
      }).filter(Boolean);

      // A coordinator role is always factual line-level evidence, so sparse
      // profiles receive one concise signal rather than an empty evidence rail.
      if (!signalItems.length) {
        signalItems.push(`<article class="line-leadership__signal">
          <span class="line-leadership__signal-mark" aria-hidden="true">01</span>
          <h3>${bilingual('Scientific leadership & contribution','Liderazgo y contribución científica')}</h3>
          <p>${bilingual('Coordinates this research line within the neumACt programme.','Coordina esta línea de investigación dentro del programa neumACt.')}</p>
        </article>`);
      }

      if (signalsHost) {
        signalsHost.innerHTML = signalItems.slice(0,3).join('');
        signalsHost.classList.toggle('is-single',signalItems.length === 1);
      }

      const scholarlyIdentity = Array.isArray(leadershipData.scholarly_identity) ? leadershipData.scholarly_identity
        : (Array.isArray(c.scholarly_identity) ? c.scholarly_identity : []);
      const footprint = leadershipData.research_footprint || c.research_footprint || null;
      const hasTrajectory = Boolean(approved.length || scholarlyIdentity.length || footprint);

      if (hasTrajectory) {
        const content = document.getElementById('lineTrajectoryContent');
        const leadershipItems = approved.filter(item => ['scientific_leadership','clinical_leadership','guideline','consensus','programme_milestone'].includes(String(item?.type || '').toLowerCase()));
        const recognitionItems = approved.filter(item => ['recognition','award'].includes(String(item?.type || '').toLowerCase()));
        const networkItems = approved.filter(item => ['society_role','network_role','registry_role'].includes(String(item?.type || '').toLowerCase()));
        const linkItems = scholarlyIdentity.filter(item => item && item.url && (!item.visibility || item.visibility === 'approved_public'));
        const footprintMetrics = footprint ? [
          footprint.publications != null ? ['publications','publicaciones',footprint.publications] : null,
          footprint.citations != null ? ['citations','citas',footprint.citations] : null,
          footprint.h_index != null ? ['h-index','índice h',footprint.h_index] : null
        ].filter(Boolean) : [];

        if (content) {
          content.innerHTML = `<div class="line-trajectory__identity">
            <div class="line-trajectory__portrait">${photo
              ? `<img src="${escHtml(photo)}" alt="${escHtml(c.full_name)}">`
              : `<div class="line-trajectory__portrait-fallback">${escHtml(initials)}</div>`}</div>
            <div>
              <p class="line-trajectory__kicker">${bilingual('Line coordination','Coordinación de la línea')}</p>
              <h2 class="line-trajectory__name" id="lineTrajectoryName">${escHtml(displayName)}</h2>
              <p class="line-trajectory__subtitle">${bilingual('Scientific trajectory','Trayectoria científica')}${c.specialization ? ` · ${escHtml(c.specialization)}` : ''}</p>
            </div>
          </div>
          ${renderTrajectorySection('Scientific leadership & contribution','Liderazgo y contribución científica',leadershipItems)}
          ${renderTrajectorySection('Recognition','Reconocimiento',recognitionItems)}
          ${renderTrajectorySection('Networks & societies','Redes y sociedades',networkItems)}
          ${linkItems.length ? `<section class="line-trajectory__section">
            <h3 class="line-trajectory__section-label">${bilingual('Scientific identity','Identidad científica')}</h3>
            <div class="line-trajectory__links">${linkItems.map(link => `<a href="${escHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escHtml(link.label || link.type || 'Profile')} <span aria-hidden="true">↗</span></a>`).join('')}</div>
          </section>` : ''}
          ${footprintMetrics.length ? `<section class="line-trajectory__section">
            <h3 class="line-trajectory__section-label">${bilingual('Research footprint','Huella investigadora')}</h3>
            <div class="line-trajectory__footprint">${footprintMetrics.map(metric => `<div class="line-trajectory__metric"><strong>${escHtml(metric[2])}</strong><span>${bilingual(metric[0],metric[1])}</span></div>`).join('')}</div>
            ${footprint.source || footprint.verified_at ? `<p class="line-trajectory__source">${escHtml([footprint.source, footprint.verified_at].filter(Boolean).join(' · '))}</p>` : ''}
          </section>` : ''}`;
        }
      }
      if (trajectoryButton) trajectoryButton.hidden = !hasTrajectory;
      showLineEl(leadershipSection);
    }

    // Live activity metrics. Every number shown is derived from a public record
    // fetched for this line on this page load — no decorative placeholder KPIs.
    const metrics = {
      trials: clinicalTrials.length,
      studies: clinicalStudies.length,
      innovation: activeProjects.length,
      publications: allPublications.length
    };
    const metricMap = [
      ['lineMetricTrials','lineMetricTrialsLink',metrics.trials,'#lineTrialsSection'],
      ['lineMetricStudies','lineMetricStudiesLink',metrics.studies,'#lineTrialsSection'],
      ['lineMetricInnovation','lineMetricInnovationLink',metrics.innovation,'#lineProjectsSection'],
      ['lineMetricPublications','lineMetricPublicationsLink',metrics.publications,'#linePubsSection']
    ];
    metricMap.forEach(([valueId,linkId,val,target]) => {
      const valueEl = document.getElementById(valueId);
      const linkEl = document.getElementById(linkId);
      if (valueEl) valueEl.textContent = String(val);
      if (!linkEl) return;
      if (Number(val) > 0) {
        linkEl.setAttribute('href',target);
        linkEl.removeAttribute('aria-disabled');
        linkEl.classList.remove('is-empty');
      } else {
        linkEl.removeAttribute('href');
        linkEl.setAttribute('aria-disabled','true');
        linkEl.classList.add('is-empty');
      }
    });
    showLineEl(introSection);

    // Current clinical work remains evidence, not a dashboard dump. Clinical
    // studies/trials and clinical innovation are intentionally kept distinct.
    const workSection = document.getElementById('lineWorkSection');
    const trialsSection = document.getElementById('lineTrialsSection');
    const trialsList = document.getElementById('lineTrialsList');
    const projectsSection = document.getElementById('lineProjectsSection');
    const projectsList = document.getElementById('lineProjectsList');

    if (trialsList && activeStudies.length) {
      trialsList.innerHTML = activeStudies.slice(0, 4).map(t => {
        const type = studyTypeLabel(t.study_type);
        const status = statusLabel(t.status);
        const phaseEn = t.phase || '';
        const phaseEs = t.phase ? String(t.phase).replace(/^Phase\s*/i, 'Fase ') : '';
        const metaBits = [bilingual(type[0],type[1])];
        if (phaseEn) metaBits.push(bilingual(phaseEn,phaseEs));
        if (status[0]) metaBits.push(bilingual(status[0],status[1]));
        return `<a class="line-work-item" href="/clinical/"><div>
          <p class="line-work-item__meta">${metaBits.join(' · ')}</p>
          <p class="line-work-item__title">${escHtml(t.title || t.protocol_id || 'Clinical study')}</p>
          ${t.description ? `<p class="line-work-item__summary">${escHtml(publicText(t.description))}</p>` : ''}
        </div></a>`;
      }).join('');
    } else if (trialsSection) trialsSection.hidden = true;

    if (projectsList && activeProjects.length) {
      projectsList.innerHTML = activeProjects.slice(0, 4).map(p => {
        const stage = stageLabel(p.current_stage);
        const category = p.category || 'Clinical innovation';
        return `<a class="line-work-item" href="/innovation/"><div>
          <p class="line-work-item__meta"><span lang="en">Clinical innovation</span><span lang="es">Innovación clínica</span> · ${escHtml(category)}${stage[0] ? ` · ${bilingual(stage[0],stage[1])}` : ''}</p>
          <p class="line-work-item__title">${escHtml(p.title || 'Innovation project')}</p>
          ${p.description ? `<p class="line-work-item__summary">${escHtml(publicText(p.description))}</p>` : ''}
        </div></a>`;
      }).join('');
    } else if (projectsSection) projectsSection.hidden = true;

    if (activeStudies.length || activeProjects.length) showLineEl(workSection);

    // Publication evidence: fetch the complete public line set, then show a compact
    // editorial selection in the page body.
    const pubsSection = document.getElementById('linePubsSection');
    const pubsList = document.getElementById('linePubsList');
    if (pubsList && allPublications.length) {
      pubsList.innerHTML = allPublications.slice(0, 5).map(p => {
        const year = p.published_at ? new Date(p.published_at).getFullYear() : '';
        return `<a class="line-pub" href="/news/?post=${encodeURIComponent(p.id || '')}"><div class="line-pub__meta">
          ${p.journal_name ? `<span class="line-pub__journal">${escHtml(p.journal_name)}</span>` : '<span></span>'}
          <span class="line-pub__year">${year}</span></div>
          <p class="line-pub__title">${escHtml(p.title || '')}</p>
          ${p.authors_text ? `<p class="line-pub__authors">${escHtml(p.authors_text)}</p>` : ''}</a>`;
      }).join('');
      showLineEl(pubsSection);
    }

    // Team: coordinator already owns the main human feature. The programme PI is
    // not repeated on every line unless he is himself the coordinator (e.g. L06).
    const peopleSection = document.getElementById('linePeopleSection');
    const teamChips = document.getElementById('lineTeamChips');
    if (teamChips && Array.isArray(line.team)) {
      const team = line.team.filter(m => m && m.id !== line.coordinator?.id && !(m.id === NEUMACT_PI_STAFF_ID && line.coordinator?.id !== NEUMACT_PI_STAFF_ID));
      if (team.length) {
        teamChips.innerHTML = team.slice(0, 8).map(m => {
          const initials = (m.full_name || '').split(' ').filter(Boolean).slice(0,2).map(x => x[0]).join('').toUpperCase();
          const photo = m.public_photo_url || '';
          const avatar = photo
            ? `<div class="line-team-avatar"><img src="${escHtml(photo)}" alt="${escHtml(m.full_name)}" loading="lazy" onerror="this.parentElement.textContent='${escHtml(initials)}'"></div>`
            : `<div class="line-team-avatar">${escHtml(initials)}</div>`;
          const role = m.role_on_line || m.specialization || '';
          return `<article class="line-team-card">${avatar}<div><p class="line-team-name">${escHtml(m.title ? m.title + ' ' + m.full_name : m.full_name)}</p>${role ? `<p class="line-team-role">${escHtml(role)}</p>` : ''}</div></article>`;
        }).join('');
        showLineEl(peopleSection);
      }
    }

    const collabEl = document.getElementById('lineCollabSection');
    const collabLink = document.getElementById('lineCollabLink');
    if (collabLink) collabLink.setAttribute('href', `/?line=${encodeURIComponent(line.short_name || line.name || '')}#contact`);
    showLineEl(collabEl);

    // The complete page is now stable: reveal it and retire the skeleton.
    hideLineEl(loadingEl);
  } catch (err) {
    console.error('Research line render failed:', err.message);
    hideLineEl(heroEl);
    hideLineEl(loadingEl);
    showLineEl(loadErrorEl);
  }
}

