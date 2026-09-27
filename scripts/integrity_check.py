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

css_files=sorted(Path('styles').rglob('*.css'))
for f in css_files:
    c=f.read_text(encoding='utf-8')
    check(f'{f} braces',c.count('{')==c.count('}'))
    check(f'{f} no style-attribute selectors', not re.search(r'\[style(?:[*^$|~]?=|\])', c, re.I))


# Phase 3: shared runtime must own common chrome behaviour.
chrome_pages=[]
for f in PAGES:
    c=Path(f).read_text(encoding='utf-8')
    if 'header-enhance.js' not in c:
        continue
    chrome_pages.append(f)
    site_pos=c.find('site.js')
    hdr_pos=c.find('header-enhance.js')
    check(f'{f} includes site.js',site_pos!=-1)
    check(f'{f} loads site.js before header-enhance',site_pos!=-1 and hdr_pos!=-1 and site_pos<hdr_pos)
    shared_defs=re.findall(r'function\s+(openD|closeD|openMob|closeMob|openDrawer|closeDrawer|setLang|selectLang|sweep)\b',c)
    check(f'{f} no duplicated shared runtime functions',not shared_defs,', '.join(shared_defs))
    check(f'{f} no inline language handlers','onclick="selectLang(' not in c)
    check(f'{f} no inline cookie handlers',not re.search(r'onclick="[^"]*cookieOk',c))
    check(f'{f} no inline header image presentation handlers','onerror="this.style' not in c)

# Phase 3 CSS architecture guard. The checker intentionally uses only the
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
js_files=sorted(Path('.').glob('*.js'))
for f in js_files:
    c=f.read_text(encoding='utf-8')
    check(f'{f} no generated inline style attributes', not re.search(r'\bstyle\s*=', c, re.I))

# Tokens are the only normal source of global custom properties.
tokens=Path('styles/tokens.css').read_text(encoding='utf-8')
check('tokens.css has one :root',len(re.findall(r':root\s*\{',tokens))==1)
other_roots=[]
for f in css_files:
    if f.name=='tokens.css': continue
    if re.search(r':root\s*\{',f.read_text(encoding='utf-8')): other_roots.append(str(f))
check('no page/component token redefinitions',not other_roots,', '.join(other_roots))

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
