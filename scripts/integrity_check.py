#!/usr/bin/env python3
"""Static integrity checks for the consolidated neumAC public site."""
import re, sys, html.parser, glob
from pathlib import Path
from collections import Counter

FAILED=[]
def check(name, ok, detail=''):
    print(f'{"PASS" if ok else "FAIL"}  {name}  {detail}')
    if not ok: FAILED.append(name)

PAGES=sorted(glob.glob('*.html')+glob.glob('*/index.html'))
for f in PAGES:
    c=Path(f).read_text(encoding='utf-8')
    o=len(re.findall(r'<div[\s>]',c)); cl=c.count('</div>')
    check(f'{f} div balance',o==cl,f'{o}/{cl}')
    class P(html.parser.HTMLParser):
        def error(self,m): pass
    try: P().feed(c); check(f'{f} html parse',True)
    except Exception as ex: check(f'{f} html parse',False,str(ex))
    check(f'{f} no embedded <style>', '<style' not in c.lower())
    check(f'{f} no inline style attributes', not re.search(r'\bstyle\s*=', c, re.I))
    check(f'{f} no retired CSS refs', 'core.css' not in c and 'polish.css' not in c)
    check(f'{f} no embedded base64 images','data:image/png;base64,/9j' not in c)


# Phase 4: local resource references must resolve in the static tree.
class _ResourceParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(); self.refs=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ('script','img','source') and a.get('src'):
            self.refs.append((tag,a['src']))
        elif tag=='link' and a.get('href'):
            rel=(a.get('rel') or '').lower()
            if any(k in rel for k in ('stylesheet','icon','manifest','preload')):
                self.refs.append((tag,a['href']))
for f in PAGES:
    c=Path(f).read_text(encoding='utf-8'); rp=_ResourceParser(); rp.feed(c); missing=[]
    for tag,ref in rp.refs:
        if ref.startswith(('http:','https:','//','data:','#')): continue
        raw=ref.split('?',1)[0].split('#',1)[0]
        if not raw: continue
        target=Path(raw.lstrip('/')) if raw.startswith('/') else Path(f).parent/raw
        if not target.exists(): missing.append(f'{tag}:{ref}')
    check(f'{f} local resources resolve',not missing,', '.join(missing[:5]))

css_files=sorted(Path('styles').rglob('*.css'))
for f in css_files:
    c=f.read_text(encoding='utf-8')
    check(f'{f} braces',c.count('{')==c.count('}'))
    check(f'{f} no style-attribute selectors', not re.search(r'\[style(?:[*^$|~]?=|\])', c, re.I))


# Phase 4: one shared runtime file owns chrome/header behaviour.
check('retired header-enhance.js removed', not Path('header-enhance.js').exists())
chrome_pages=[]
for f in PAGES:
    c=Path(f).read_text(encoding='utf-8')
    if '/scripts/site.js' not in c:
        continue
    chrome_pages.append(f)
    site_pos=c.find('/scripts/site.js')
    boot_pos=c.find('/scripts/bootstrap.js')
    check(f'{f} includes bootstrap.js',boot_pos!=-1)
    check(f'{f} includes site.js',site_pos!=-1)
    check(f'{f} bootstrap precedes site runtime',boot_pos!=-1 and site_pos!=-1 and boot_pos<site_pos)
    check(f'{f} no retired header-enhance reference','header-enhance.js' not in c)
    shared_defs=re.findall(r'function\s+(openD|closeD|openMob|closeMob|openDrawer|closeDrawer|setLang|selectLang|sweep)\b',c)
    check(f'{f} no duplicated shared runtime functions',not shared_defs,', '.join(shared_defs))
    check(f'{f} no inline language handlers','onclick="selectLang(' not in c)
    check(f'{f} no inline cookie handlers',not re.search(r'onclick="[^"]*cookieOk',c))
    check(f'{f} no inline header image presentation handlers','onerror="this.style' not in c)

# Phase 5.1B: one restrained public header contract on every HTML page.
for f in PAGES:
    c=Path(f).read_text(encoding='utf-8')
    check(f'{f} has canonical public header', 'id="hdr"' in c and 'href="/clinical/"' in c)
    check(f'{f} uses real root logo', 'src="/logo.svg"' in c)
    check(f'{f} has compact utility cluster', 'id="hdrSearchBtn"' in c and 'class="lang-switch"' in c and 'class="hdr-contact-btn"' in c)
    check(f'{f} research nav is direct, not a competing dropdown', 'hdr-dd-chevron' not in c and 'researchMegaMenu' not in c)
    retired_header_bits=('hdr-mega-metrics','hdr-mega-head-note','hdr-dd-all','hdr-dd-thumb')
    present=[x for x in retired_header_bits if x in c]
    check(f'{f} no retired header ornaments', not present, ', '.join(present))

# Header visuals are shared; page styles must not fork the chrome again.
def _without_print_media(css):
    out=[]; i=0; n=len(css)
    pat=re.compile(r'@media\s+print\s*\{',re.I)
    while i<n:
        m=pat.search(css,i)
        if not m:
            out.append(css[i:]); break
        out.append(css[i:m.start()])
        j=m.end(); depth=1; quote=None; esc=False
        while j<n and depth:
            ch=css[j]
            if quote:
                if esc: esc=False
                elif ch=='\\': esc=True
                elif ch==quote: quote=None
            else:
                if ch in ('"',"'"): quote=ch
                elif ch=='{': depth+=1
                elif ch=='}': depth-=1
            j+=1
        i=j
    return ''.join(out)

header_forks=[]
for f in Path('styles/pages').glob('*.css'):
    c=_without_print_media(f.read_text(encoding='utf-8'))
    if re.search(r'(^|[,{\s])\.hdr(?:[-\w]|\b)|\.lang-switch\b|\.hdr-dd\b', c):
        header_forks.append(str(f))
check('no page stylesheet forks the canonical header', not header_forks, ', '.join(header_forks))

# Script-loading contract: bootstrap is synchronous; every other local runtime is deferred.
for f in PAGES:
    c=Path(f).read_text(encoding='utf-8')
    bad=[]
    for m in re.finditer(r'<script\b(?P<attrs>[^>]*)\bsrc=["\'](?P<src>/scripts/[^"\']+)["\'](?P<tail>[^>]*)>',c,re.I):
        attrs=(m.group('attrs') or '')+(m.group('tail') or '')
        src=m.group('src')
        has_defer=bool(re.search(r'\bdefer\b',attrs,re.I))
        if src=='/scripts/bootstrap.js':
            if has_defer: bad.append(src+' must be synchronous')
        elif not has_defer:
            bad.append(src+' missing defer')
    check(f'{f} script loading contract',not bad,', '.join(bad[:5]))

# Executable behaviour belongs in external JS. JSON-LD remains inline by design.
script_block=re.compile(r'<script(?P<attrs>[^>]*)>(?P<body>.*?)</script>',re.I|re.S)
for f in PAGES:
    c=Path(f).read_text(encoding='utf-8')
    inline=[]
    for m in script_block.finditer(c):
        attrs=m.group('attrs') or ''
        body=m.group('body').strip()
        if not body or re.search(r'\bsrc\s*=',attrs,re.I):
            continue
        if re.search(r'\btype\s*=\s*["\']application/(?:ld\+json|json)["\']',attrs,re.I):
            continue
        inline.append(body[:40].replace('\n',' '))
    check(f'{f} no executable inline scripts',not inline,' | '.join(inline[:3]))

# Phase 4 CSS architecture guard. The checker intentionally uses only the
# Python standard library so contributors do not need a parser dependency.
principal_pages={
    'home':'index.html',
    'clinical':'clinical/index.html',
    'innovation':'innovation/index.html',
    'line':'line/index.html',
    'news':'news/index.html',
    'team':'team/index.html',
}
for owner,f in principal_pages.items():
    c=Path(f).read_text(encoding='utf-8')
    check(f'{f} declares data-page={owner}',bool(re.search(r'<body[^>]*\bdata-page=["\']'+re.escape(owner)+r'["\']',c,re.I)))
    foundation_pos=c.find('styles/foundation.css')
    shared_pos=c.find('styles/shared.css')
    page_pos=c.find(f'styles/pages/{owner}.css')
    check(f'{f} includes shared.css',shared_pos!=-1)
    check(f'{f} stylesheet order foundation → shared → page',
          foundation_pos!=-1 and shared_pos!=-1 and page_pos!=-1 and foundation_pos<shared_pos<page_pos)

def _strip_css_comments(text):
    return re.sub(r'/\*.*?\*/','',text,flags=re.S)

def _norm_css(text):
    return re.sub(r'\s+',' ',_strip_css_comments(text).strip())

def _top_level_qualified_rules(text):
    """Yield (selector, body) for top-level qualified rules only.

    At-rules (including @media/@keyframes) are deliberately treated as one
    opaque block. That is enough for the regression guard: the Phase 3 debt
    being prevented is copied top-level component rules across page files.
    """
    n=len(text); i=0
    while i<n:
        while i<n:
            if text.startswith('/*',i):
                end=text.find('*/',i+2); i=n if end<0 else end+2; continue
            if text[i].isspace(): i+=1; continue
            break
        if i>=n: break
        start=i; quote=None; escaped=False; paren=0; bracket=0
        while i<n:
            if text.startswith('/*',i) and quote is None:
                end=text.find('*/',i+2); i=n if end<0 else end+2; continue
            ch=text[i]
            if quote:
                if escaped: escaped=False
                elif ch=='\\': escaped=True
                elif ch==quote: quote=None
                i+=1; continue
            if ch in ('"',"'"): quote=ch; i+=1; continue
            if ch=='(': paren+=1
            elif ch==')' and paren: paren-=1
            elif ch=='[': bracket+=1
            elif ch==']' and bracket: bracket-=1
            elif paren==0 and bracket==0 and ch==';':
                # A top-level statement-style at-rule (for example @import).
                i+=1; break
            elif paren==0 and bracket==0 and ch=='{':
                prelude=text[start:i].strip(); i+=1; body_start=i
                depth=1; q=None; esc=False
                while i<n and depth:
                    if text.startswith('/*',i) and q is None:
                        end=text.find('*/',i+2); i=n if end<0 else end+2; continue
                    c=text[i]
                    if q:
                        if esc: esc=False
                        elif c=='\\': esc=True
                        elif c==q: q=None
                    else:
                        if c in ('"',"'"): q=c
                        elif c=='{': depth+=1
                        elif c=='}': depth-=1
                    i+=1
                body=text[body_start:i-1] if depth==0 else text[body_start:i]
                if prelude and not prelude.lstrip().startswith('@'):
                    yield (_norm_css(prelude),_norm_css(body))
                break
            i+=1
        else:
            break

seen={}
for owner in principal_pages:
    f=Path('styles/pages')/(owner+'.css')
    for key in _top_level_qualified_rules(f.read_text(encoding='utf-8')):
        seen.setdefault(key,set()).add(owner)
regrown=[k[0] for k,v in seen.items() if len(v)>=4]
check('no shared top-level rule copied across 4+ page stylesheets',not regrown,', '.join(regrown[:5]))

# Runtime templates must use the same class-owned presentation model as HTML.
# Imperative element.style changes used for state/animation are allowed here;
# literal style= attributes embedded in JS-generated markup are not.
js_files=sorted(set(Path('.').glob('*.js')) | set(Path('scripts').rglob('*.js')))
for f in js_files:
    c=f.read_text(encoding='utf-8')
    check(f'{f} no generated inline style attributes', not re.search(r'\bstyle\s*=', c, re.I))

# Runtime endpoint configuration has one owner.
api_literal='https://api.neumact.org'
site_literal='https://neumact.org'
all_js=sorted(set(Path('.').glob('*.js')) | set(Path('scripts').rglob('*.js')))
api_owners=[f.as_posix() for f in all_js if api_literal in f.read_text(encoding='utf-8')]
site_owners=[f.as_posix() for f in all_js if site_literal in f.read_text(encoding='utf-8')]
check('API base URL has one owner',api_owners==['scripts/bootstrap.js'],', '.join(api_owners))
check('site base URL has one owner',site_owners==['scripts/bootstrap.js'],', '.join(site_owners))

# Tokens are the only normal source of global custom properties.
tokens=Path('styles/tokens.css').read_text(encoding='utf-8')
check('tokens.css has one :root',len(re.findall(r':root\s*\{',tokens))==1)
other_roots=[]
for f in css_files:
    if f.name=='tokens.css': continue
    if re.search(r':root\s*\{',f.read_text(encoding='utf-8')): other_roots.append(str(f))
check('no page/component token redefinitions',not other_roots,', '.join(other_roots))

# Public identity and design-governance guards.
principles=Path('DESIGN_PRINCIPLES.md')
check('DESIGN_PRINCIPLES.md exists', principles.exists())
public_text_files=[]
for pattern in ('*.html','*.md','*.json','*.txt','*.xml'):
    public_text_files.extend(Path('.').rglob(pattern))
masthead_identity_violations=[]
for f in sorted(Path('.').rglob('*.html')):
    text=f.read_text(encoding='utf-8',errors='ignore')
    if 'class="hdr-brand-org"' not in text:
        continue
    if 'class="hdr-brand-org">Área Sanitaria da Coruña e Cee</' not in text:
        masthead_identity_violations.append(f.as_posix())
check(
    'public masthead keeps Área Sanitaria da Coruña e Cee while clinical copy may name CHUAC',
    not masthead_identity_violations,
    ', '.join(masthead_identity_violations[:8])
)

internal_name=[]
for f in sorted(set(public_text_files)):
    text=f.read_text(encoding='utf-8',errors='ignore')
    internal_brand = 'neum' + 'Desk'
    if internal_brand in text or internal_brand.lower() in text.lower():
        internal_name.append(f.as_posix())
check('public files do not expose internal platform naming', not internal_name, ', '.join(internal_name[:8]))
home_html=Path('index.html').read_text(encoding='utf-8')
check('homepage exposes compact six-line research programme', 'researchLinesGrid' in home_html and all(label in home_html for label in ['Transplantation, Pulmonary Hypertension &amp; Diffuse Lung Disease','Airway Diseases','Interventional Pulmonology &amp; Lung Cancer','Respiratory Failure, Critical Care &amp; Sleep Medicine','Innovation in Thoracic Surgery','Personalised Respiratory Medicine, Management &amp; Clinical Innovation']))
check('homepage links official neumACt INIBIC institutional profile', 'https://www.inibic.es/portfolio-items/neumact-medicina-respiratoria-traslacional-y-de-precision/' in home_html)
check('obsolete scroll-to-top utility removed from public HTML', all('id="scrollTop"' not in Path(rel).read_text(encoding='utf-8') for rel in ['index.html','clinical/index.html','innovation/index.html','team/index.html']))
check('homepage uses progressive-disclosure contact', 'home-contact-disclosure' in home_html and '<details' in home_html)
clinical_html=Path('clinical/index.html').read_text(encoding='utf-8')
check('research page uses programme index + leadership sheet', 'research-line-list' in clinical_html and 'research-hero__sheet' in clinical_html and 'research-leadership' in clinical_html)
shared_css_text=Path('styles/shared.css').read_text(encoding='utf-8')
clinical_css_text=Path('styles/pages/clinical.css').read_text(encoding='utf-8')
check('shared CSS does not force research line container into a legacy grid', '#researchLinesList{display:grid' not in shared_css_text.replace(' ',''))
check('clinical research line container is explicitly sequential', '.research-line-list{display:block;' in clinical_css_text.replace(' ',''))
check('research page removed legacy study dashboard table', '<table class="trials"' not in clinical_html and 'study-summary' not in clinical_html)
check('research page removed affiliation placeholder wall', 'affil-card--placeholder' not in clinical_html and 'affil-section' not in clinical_html)
check('research page uses explicit button-driven contact disclosure', 'id="researchInquiryToggle"' in clinical_html and 'id="researchInquiryPanel"' in clinical_html and 'aria-expanded="false"' in clinical_html)
check('research page contains no decorative scientific motifs', 'research-chapter__motif' not in clinical_html)
check('research page contains no design-commentary pullquote', 'The description matters as much as the title' not in clinical_html and 'La descripción importa tanto como el título' not in clinical_html)
check('research page avoids repetitive programme eyebrow', 'Research programme' not in clinical_html and 'Programa de investigación' not in clinical_html)
check('research page features principal investigator leadership', 'id="researchPiName"' in clinical_html and 'Pedro Jorge Marcos Rodríguez' in clinical_html and 'Investigador principal' in clinical_html)
for media in [
    'assets/research/pi-pedro-marcos.jpg',
    'assets/research/research-hero-clinician-lungs.jpg',
    'assets/research/line-transplantation-pulmonary-hypertension.jpg',
    'assets/research/line-heroes/airway-diseases.jpg',
    'assets/research/line-interventional-lung-cancer.jpg',
    'assets/research/line-heroes/respiratory-failure-sleep.jpg',
    'assets/research/line-thoracic-surgery.jpg',
    'assets/research/line-precision-medicine.jpg',
]:
    check(f'research editorial media exists: {Path(media).name}', Path(media).is_file())
api_js_text=Path('scripts/api.js').read_text(encoding='utf-8')
check('research overview renders compact editorial media rows', 'research-line-row' in api_js_text and 'research-line__media' in api_js_text and 'research-line__side' in api_js_text)
check('research overview keeps depth on line pages, not inline accordions', 'research-line__more' not in api_js_text and 'researchOverviewSummary' in api_js_text)
check('research overview does not inject active-study metadata into line rows', 'research-chapter__fact-label' not in api_js_text and 'Current studies</span>' not in api_js_text)
check('backend-derived public copy normalises legacy hospital acronym', 'function publicText' in api_js_text and 'Área Sanitaria da Coruña e Cee' in api_js_text)

line_html=Path('line/index.html').read_text(encoding='utf-8')
line_css_text=Path('styles/pages/line.css').read_text(encoding='utf-8')
check('line detail uses inherited editorial architecture', all(x in line_html for x in ['id="lineCoordinatorCard"','id="lineTrialsSection"','id="lineProjectsSection"','id="linePubsSection"','id="linePeopleSection"']))
check('line detail has no hero KPI pill container', 'lineStatPills' not in line_html and 'hstat-label--pill' not in line_html)
check('line detail separates studies and clinical innovation', 'Ensayos y estudios clínicos' in line_html and 'Innovación clínica' in line_html)
check('line detail uses calm textual work metadata', 'line-work-item__meta' in api_js_text and 'lt-trial-phase' not in api_js_text)
check('line coordinator is a primary editorial feature', 'line-lead__portrait' in line_css_text and 'line-lead__name' in line_css_text)
check('Marina approved public portrait exists', Path('assets/research/coordinators/marina-blanco-aparicio.jpg').is_file())
check('Airway dedicated hero media exists', Path('assets/research/line-heroes/airway-diseases.jpg').is_file())
check('programme PI is not repeated across every line team', 'NEUMACT_PI_STAFF_ID' in api_js_text and 'line.coordinator?.id !== NEUMACT_PI_STAFF_ID' in api_js_text)
check('line lead uses authored coordinator editorial summary support', 'LINE_COORDINATOR_EDITORIAL' in api_js_text and 'coordinatorEditorialBio' in api_js_text)
check('line lead large name excludes honorific prefix', "c.title ? c.title + ' ' + c.full_name" not in api_js_text)
check('line lead does not use full-height coordinator/scope divider', 'border-left:1px solid rgba(12,56,104,.12)' not in line_css_text)
check('line lead protects readable name measure', 'text-wrap:balance' in line_css_text and '.line-lead__name' in line_css_text)
check('line hero owns the scientific narrative without duplicate about block', 'lineAboutContent' not in line_html and 'Scientific scope' not in line_html)
check('line page has live evidence count contract', all(x in line_html for x in ['id="lineMetricTrials"','id="lineMetricStudies"','id="lineMetricInnovation"','id="lineMetricPublications"']) and 'line-chart-card' not in line_html)
check('line live figures derive from fetched public records', all(x in api_js_text for x in ['clinicalTrials.length','clinicalStudies.length','activeProjects.length','allPublications.length']))
check('line evidence explicitly preserves clinical innovation', 'innovation projects' in line_html and 'proyectos de innovación' in line_html)
check('line page avoids dashboard chart chrome', 'line-chart-card' not in line_html and 'renderLineActivityChart' not in api_js_text and 'renderLineInnovationChart' not in api_js_text)
check('line page has geometry-matched loading skeleton', 'line-loader__hero' in line_html and 'line-loader__evidence' in line_html and 'Promise.allSettled' in api_js_text)
check('Angelica approved public portrait exists', Path('assets/research/coordinators/angelica-consuegra-vanegas.jpg').is_file())
check('Pedro approved coordinator portrait exists', Path('assets/research/coordinators/pedro-jorge-marcos-rodriguez.jpg').is_file())
check('Respiratory failure dedicated hero media exists', Path('assets/research/line-heroes/respiratory-failure-sleep.jpg').is_file())
check('approved coordinator media mappings include Marina Angelica and Pedro', all(name in api_js_text for name in ['marina blanco aparicio','angelica consuegra vanegas','pedro jorge marcos rodriguez']))

# Global H1 editorial masthead guards.
site_js_text=Path('scripts/site.js').read_text(encoding='utf-8')
components_css_text=Path('styles/components.css').read_text(encoding='utf-8')
check('global editorial Index runtime exists', 'GLOBAL H1 — EDITORIAL INDEX MASTHEAD' in site_js_text and 'initEditorialIndex' in site_js_text and 'openGlobalSearch' in site_js_text)
check('global editorial Index styles have one shared owner', 'GLOBAL H1 — EDITORIAL INDEX MASTHEAD' in components_css_text and '.global-index__surface' in components_css_text and '.hdr-index-btn' in components_css_text)
check('masthead search is integrated into Index', "searchBtn.addEventListener('click', openGlobalSearch)" in site_js_text and 'openPalette);' not in site_js_text.split("var searchBtn=document.getElementById('hdrSearchBtn');",1)[-1].split('}',1)[0])
check('mobile masthead uses editorial Index', 'window.innerWidth<=INDEX_BREAKPOINT' in site_js_text and "mob.setAttribute('aria-controls','globalIndex')" in site_js_text)
header_forks=[]
for f in Path('styles/pages').glob('*.css'):
    c=f.read_text(encoding='utf-8')
    if '.global-index' in c or '.hdr-index-btn' in c: header_forks.append(f.as_posix())
check('no page stylesheet forks the editorial Index', not header_forks, ', '.join(header_forks))

# Contrast regression guard on --ink-4.
def lum(r,g,b):
    def lin(x):
        x/=255; return x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4
    return .2126*lin(r)+.7152*lin(g)+.0722*lin(b)
def cr(a,b):
    l1,l2=lum(*a),lum(*b); hi,lo=max(l1,l2),min(l1,l2); return (hi+.05)/(lo+.05)
m=re.search(r'--ink-4:\s*#([0-9A-Fa-f]{6})',tokens)
check('--ink-4 token exists',bool(m))
if m:
    h=m.group(1); rgb=tuple(int(h[i:i+2],16) for i in (0,2,4))
    check('--ink-4 passes 4.5:1 on white',cr(rgb,(255,255,255))>=4.5,f'#{h} = {cr(rgb,(255,255,255)):.2f}:1')

sys.exit(1 if FAILED else 0)
