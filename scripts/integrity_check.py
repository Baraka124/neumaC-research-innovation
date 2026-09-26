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
    check(f'{f} no retired CSS refs', 'core.css' not in c and 'polish.css' not in c)
    check(f'{f} no embedded base64 images','data:image/png;base64,/9j' not in c)

css_files=sorted(Path('styles').rglob('*.css'))
for f in css_files:
    c=f.read_text(encoding='utf-8')
    check(f'{f} braces',c.count('{')==c.count('}'))

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
