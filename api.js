/**
 * neumAC R&I — Website Data Layer
 * api.js — shared script loaded by index.html, clinical.html, innovation.html
 *
 * Architecture:
 *   Website → Railway backend (public endpoints, no auth)
 *   App     → Railway backend (authenticated endpoints)
 *   Both    → same Supabase DB (one source of truth)
 *
 * Public endpoints used:
 *   GET /api/research-lines/website
 *   GET /api/clinical-trials/website?line=&phase=&status=&search=
 *   GET /api/innovation-projects/website
 */

const API_BASE = 'https://neumac-manage-back-end-production.up.railway.app';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

/** Replace a container's content, handling loading/error states */
function setLoading(el, rows = 3) {
  el.innerHTML = Array(rows).fill(
    `<div class="skeleton-row" style="height:52px;background:var(--ink-3);border-radius:var(--r-md);margin-bottom:1px;animation:skeleton-pulse 1.4s ease-in-out infinite;"></div>`
  ).join('');
}

function setError(el, msg = 'Could not load data. Please try again later.') {
  el.innerHTML = `
    <div style="padding:2rem;text-align:center;color:var(--text-muted);font-size:.875rem;font-family:var(--ff-mono);">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20" style="margin:0 auto .75rem;display:block;color:var(--coral,#E05C4B)"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
      ${msg}
    </div>`;
}

// Inject skeleton keyframe once
if (!document.getElementById('api-js-styles')) {
  const s = document.createElement('style');
  s.id = 'api-js-styles';
  s.textContent = `
    @keyframes skeleton-pulse {
      0%,100%{opacity:.45} 50%{opacity:.9}
    }
    .skeleton-row { pointer-events:none; }
  `;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────
// STATUS → CSS CLASS MAP
// ─────────────────────────────────────────────

const STATUS_CLASS = {
  'Reclutando':    'recruiting',
  'Activo':        'active',
  'Completado':    'completed',
  'En preparación':'prep'
};

const STATUS_LABEL_EN = {
  'Reclutando':    'Recruiting',
  'Activo':        'Active',
  'Completado':    'Completed',
  'En preparación':'In Preparation'
};

const CATEGORY_CLASS = {
  'Dispositivo':             'cat-device',
  'Salud Digital':           'cat-digital',
  'IA / ML':                 'cat-ai',
  'Tecnología Quirúrgica':   'cat-surgical'
};

const CATEGORY_ICON = {
  'Dispositivo': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="9" height="9"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M7 7h2l1 3 2-6 1 3h3"/></svg>`,
  'Salud Digital': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="9" height="9"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
  'IA / ML': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="9" height="9"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6" y2="6"/><line x1="6" y1="18" x2="6" y2="18"/></svg>`,
  'Tecnología Quirúrgica': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="9" height="9"><path d="M20 7l-9 9-4-4 9-9 4 4z"/><path d="M4 20l1-4"/></svg>`
};

// ─────────────────────────────────────────────
// PAGE DETECTION
// ─────────────────────────────────────────────

const PAGE = (() => {
  const p = location.pathname.split('/').pop() || 'index.html';
  if (p.startsWith('clinical'))   return 'clinical';
  if (p.startsWith('innovation')) return 'innovation';
  return 'index';
})();

// ─────────────────────────────────────────────
// 1. RESEARCH LINES  (index.html + clinical.html)
// ─────────────────────────────────────────────

async function loadResearchLines() {
  // Index page: small grid cards
  const indexGrid = document.getElementById('researchLinesGrid');
  // Clinical page: expandable accordion cards
  const clinicalList = document.getElementById('researchLinesList');

  if (!indexGrid && !clinicalList) return;

  try {
    const { data } = await apiFetch('/api/research-lines/website');
    if (!data?.length) return;

    // ── INDEX grid ──
    if (indexGrid) {
      indexGrid.innerHTML = data.map(line => `
        <a href="clinical.html#research-lines" class="line-item">
          <div class="line-top">
            <div class="line-num-badge">${String(line.line_number).padStart(2, '0')}</div>
            ${line.is_new ? `<span class="line-new"><span lang="en">New</span><span lang="es">Nueva</span></span>` : ''}
          </div>
          <div class="line-name">${escHtml(line.name)}</div>
          ${line.coordinator?.full_name
            ? `<div class="line-coord"><span lang="en">Coord.</span><span lang="es">Coord.</span> <strong>${escHtml(line.coordinator.full_name)}</strong></div>`
            : ''}
          <div class="line-tags">
            ${(line.keywords || []).slice(0, 3).map(k => `<span class="ltag">${escHtml(k)}</span>`).join('')}
          </div>
        </a>
      `).join('');

      // Update stat numbers
      updateStat('statResearchLines', data.length);
    }

    // ── CLINICAL expandable list ──
    if (clinicalList) {
      clinicalList.innerHTML = data.map((line, i) => `
        <div class="line-card" id="line-${line.id}">
          <div class="line-head" onclick="toggleLine('line-${line.id}')">
            <div class="line-num">${String(line.line_number).padStart(2, '0')}</div>
            <div class="line-meta">
              ${line.coordinator?.full_name
                ? `<div class="line-coordinator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="11" height="11"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <strong>${escHtml(line.coordinator.full_name)}</strong>
                   </div>`
                : ''}
              <div class="line-title">${escHtml(line.name)}</div>
            </div>
          </div>
          <div class="line-tags-preview">
            ${(line.keywords || []).map(k => `<span class="ltag">${escHtml(k)}</span>`).join('')}
          </div>
          <div class="line-expand-toggle" onclick="toggleLine('line-${line.id}')">
            <span class="toggle-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <span lang="en">Research scope &amp; capabilities</span>
              <span lang="es">Alcance y capacidades</span>
            </span>
            <div class="toggle-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
          <div class="line-body">
            <div class="line-body-inner">
              ${line.description
                ? `<p class="line-desc">${escHtml(line.description)}</p>`
                : ''}
              ${line.capabilities
                ? `<p class="line-desc" style="margin-top:.5rem;">${escHtml(line.capabilities)}</p>`
                : ''}
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Research lines load failed:', err);
    if (indexGrid) setError(indexGrid);
    if (clinicalList) setError(clinicalList);
  }
}

/** Accordion toggle — used by clinical.html */
window.toggleLine = function(id) {
  const card = document.getElementById(id);
  if (card) card.classList.toggle('open');
};

// ─────────────────────────────────────────────
// 2. CLINICAL TRIALS  (clinical.html)
// ─────────────────────────────────────────────

async function loadTrials(filters = {}) {
  const tbody = document.getElementById('trialsBody');
  const countEl = document.getElementById('trialsCount');
  if (!tbody) return;

  setLoading(tbody, 6);

  const params = new URLSearchParams();
  if (filters.line   && filters.line   !== 'all') params.set('line',   filters.line);
  if (filters.phase  && filters.phase  !== 'all') params.set('phase',  filters.phase);
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);

  try {
    const { data } = await apiFetch(`/api/clinical-trials/website?${params}`);
    const trials = data || [];

    if (countEl) {
      countEl.textContent = `${trials.length} trial${trials.length !== 1 ? 's' : ''}`;
    }

    if (!trials.length) {
      tbody.innerHTML = `
        <tr><td colspan="6" style="text-align:center;padding:2.5rem;color:var(--text-muted);font-size:.875rem;font-family:var(--ff-mono);">
          No trials match the current filters.
        </td></tr>`;
      return;
    }

    const lang = document.body.dataset.lang || 'en';

    tbody.innerHTML = trials.map(t => {
      const statusClass = STATUS_CLASS[t.status] || 'active';
      const statusLabel = lang === 'es' ? t.status : (STATUS_LABEL_EN[t.status] || t.status);
      const lineName = t.research_line?.name || '—';

      return `
        <tr data-line="${t.research_line_id || ''}" data-phase="${t.phase?.toLowerCase().replace(' ','') || ''}" data-status="${statusClass}">
          <td><span class="trial-protocol">${escHtml(t.protocol_id)}</span></td>
          <td><span class="trial-title">${escHtml(t.title)}</span></td>
          <td><span class="trial-line-tag">${escHtml(lineName)}</span></td>
          <td><span class="phase-badge">${escHtml(t.phase)}</span></td>
          <td>
            <span class="status-badge ${statusClass}">
              <span lang="en">${STATUS_LABEL_EN[t.status] || t.status}</span>
              <span lang="es">${t.status}</span>
            </span>
          </td>
          <td>${t.sponsor_name ? `<span style="font-size:.75rem;color:var(--text-muted);font-family:var(--ff-mono);">${escHtml(t.sponsor_name)}</span>` : '<span style="color:var(--text-muted)">—</span>'}</td>
        </tr>`;
    }).join('');

    // Re-run reveal animations on new rows
    animateNewRows();

  } catch (err) {
    console.error('Trials load failed:', err);
    setError(tbody);
    if (countEl) countEl.textContent = '';
  }
}

/** Wire filter dropdowns on clinical.html */
function initTrialFilters() {
  const filterLine   = document.getElementById('filterLine');
  const filterPhase  = document.getElementById('filterPhase');
  const filterStatus = document.getElementById('filterStatus');
  const filterSearch = document.getElementById('filterSearch');

  if (!filterLine && !filterPhase && !filterStatus) return;

  const getFilters = () => ({
    line:   filterLine?.value   || 'all',
    phase:  filterPhase?.value  || 'all',
    status: filterStatus?.value || 'all',
    search: filterSearch?.value || ''
  });

  const refresh = () => loadTrials(getFilters());

  filterLine?.addEventListener('change', refresh);
  filterPhase?.addEventListener('change', refresh);
  filterStatus?.addEventListener('change', refresh);

  // Debounced search
  let searchTimer;
  filterSearch?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(refresh, 380);
  });

  // Initial load
  loadTrials(getFilters());
}

// ─────────────────────────────────────────────
// 3. INNOVATION PROJECTS  (innovation.html)
// ─────────────────────────────────────────────

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  setLoading(grid, 4);

  try {
    const { data } = await apiFetch('/api/innovation-projects/website');
    const projects = data || [];

    if (!projects.length) {
      setError(grid, 'No active projects at this time.');
      return;
    }

    grid.innerHTML = projects.map((p, i) => {
      const catClass = CATEGORY_CLASS[p.category] || 'cat-device';
      const catIcon  = CATEGORY_ICON[p.category]  || CATEGORY_ICON['Dispositivo'];
      const delay    = i % 2 === 0 ? '' : ' reveal-d1';

      return `
        <div class="project-card reveal${delay}">
          <div class="project-top">
            <span class="project-cat-badge ${catClass}">
              ${catIcon}
              <span lang="en">${escHtml(p.category)}</span>
              <span lang="es">${escHtml(p.category)}</span>
            </span>
            ${p.development_stage
              ? `<span class="stage-badge">${escHtml(p.development_stage)}</span>`
              : ''}
          </div>
          <h3 class="project-title">${escHtml(p.title)}</h3>
          <p class="project-desc">${escHtml(p.description)}</p>
          ${(p.partner_needs?.length)
            ? `<p class="project-needs-label">
                <span lang="en">Partner Needs</span>
                <span lang="es">Necesidades del Socio</span>
               </p>
               <div class="project-needs">
                 ${p.partner_needs.map(n => `<span class="pneed">${escHtml(n)}</span>`).join('')}
               </div>`
            : ''}
        </div>`;
    }).join('');

    // Trigger reveal animations
    requestAnimationFrame(() => {
      grid.querySelectorAll('.reveal').forEach(el => {
        setTimeout(() => el.classList.add('in'), 50);
      });
    });

  } catch (err) {
    console.error('Projects load failed:', err);
    setError(grid);
  }
}

// ─────────────────────────────────────────────
// STAT COUNTER UPDATER
// Updates hero/numbers section stat values from live data
// ─────────────────────────────────────────────

function updateStat(id, value) {
  document.querySelectorAll(`[data-stat="${id}"]`).forEach(el => {
    el.textContent = value;
  });
}

async function loadLiveStats() {
  // Only runs on index page to update the hero stat grid
  if (PAGE !== 'index') return;
  try {
    // Use research-lines count for the "6 Research Lines" stat
    // Trial count pulled from clinical-trials/website
    const [linesRes, trialsRes] = await Promise.all([
      apiFetch('/api/research-lines/website'),
      apiFetch('/api/clinical-trials/website')
    ]);
    const lineCount  = linesRes.data?.length || 0;
    const trialCount = trialsRes.data?.length || 0;

    // Update hero stat grid — target elements by data-stat attribute
    // Add data-stat="statResearchLines" etc. to your HTML stat elements, OR
    // we patch the known hstat-num elements by index:
    const hstats = document.querySelectorAll('.hstat-num');
    if (hstats[0]) hstats[0].textContent = lineCount || '6';
    if (hstats[1]) hstats[1].textContent = trialCount > 0 ? trialCount + '+' : '30+';
  } catch (err) {
    // Non-fatal — static fallback values remain
    console.warn('Live stats not available:', err.message);
  }
}

// ─────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function animateNewRows() {
  requestAnimationFrame(() => {
    document.querySelectorAll('#trialsBody tr').forEach((row, i) => {
      row.style.opacity = '0';
      row.style.transition = `opacity .3s ease ${i * 30}ms`;
      requestAnimationFrame(() => { row.style.opacity = '1'; });
    });
  });
}

// ─────────────────────────────────────────────
// INIT — runs on DOMContentLoaded
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  switch (PAGE) {
    case 'index':
      loadResearchLines();
      loadLiveStats();
      break;

    case 'clinical':
      loadResearchLines();   // accordion on clinical.html
      initTrialFilters();    // also calls loadTrials() internally
      break;

    case 'innovation':
      loadProjects();
      break;
  }
});
