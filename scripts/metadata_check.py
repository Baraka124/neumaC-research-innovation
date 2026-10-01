#!/usr/bin/env python3
"""Static metadata checks for neumACt principal public pages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import sys

FAILED=[]

def check(name, ok, detail=''):
    print(f'{"PASS" if ok else "FAIL"}  {name}  {detail}')
    if not ok:
        FAILED.append(name)

PRINCIPAL_PAGES=[
    Path('index.html'),
    Path('clinical/index.html'),
    Path('innovation/index.html'),
    Path('line/index.html'),
    Path('news/index.html'),
    Path('team/index.html'),
]

class MetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals=[]
        self.meta=[]

    def handle_starttag(self, tag, attrs):
        data=dict(attrs)
        if tag=='link' and (data.get('rel') or '').lower()=='canonical' and data.get('href'):
            self.canonicals.append(data['href'])
        elif tag=='meta':
            self.meta.append(data)


def meta_values(parser, key, value):
    return [m.get('content','') for m in parser.meta if m.get(key)==value]


def normalise_url(url):
    return url.rstrip('/')

for page in PRINCIPAL_PAGES:
    text=page.read_text(encoding='utf-8')
    parser=MetaParser(); parser.feed(text)

    check(f'{page} has one canonical URL', len(parser.canonicals)==1, ', '.join(parser.canonicals))
    canonical=parser.canonicals[0] if len(parser.canonicals)==1 else ''
    check(f'{page} canonical is neumact.org HTTPS', canonical.startswith('https://neumact.org/'), canonical)

    descriptions=meta_values(parser,'name','description')
    check(f'{page} has one meta description', len(descriptions)==1)

    og_images=meta_values(parser,'property','og:image')
    check(f'{page} has one og:image', len(og_images)==1, ', '.join(og_images))
    if len(og_images)==1:
        image=og_images[0]
        parsed=urlparse(image)
        if parsed.netloc=='neumact.org':
            local=Path(parsed.path.lstrip('/'))
            check(f'{page} og:image resolves in repository', local.is_file(), str(local))

    og_urls=meta_values(parser,'property','og:url')
    check(f'{page} has at most one og:url', len(og_urls)<=1, ', '.join(og_urls))
    if canonical and len(og_urls)==1:
        check(
            f'{page} canonical and og:url agree',
            normalise_url(canonical)==normalise_url(og_urls[0]),
            f'canonical={canonical} og:url={og_urls[0]}'
        )

    widths=meta_values(parser,'property','og:image:width')
    heights=meta_values(parser,'property','og:image:height')
    if og_images:
        check(f'{page} declares og:image dimensions', widths==['1200'] and heights==['630'])

sys.exit(1 if FAILED else 0)
