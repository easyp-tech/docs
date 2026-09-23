# Автор: GPT-6 Astra Pro, 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.
"""Read-only checks: python3 verify-docs.py DOCS_REPO SERVICE_REPO BASE_URL."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import Request,urlopen
from urllib.parse import urlsplit,unquote
import sys,re,json,posixpath,html
D=Path(sys.argv[1]).resolve(); SERVICE=Path(sys.argv[2]).resolve(); BASE=sys.argv[3].rstrip('/')
C=D/'content/docs'; E=Path(__file__).parent; R=E.parent
slugs=json.loads((C/'api-service/meta.json').read_text())['pages']
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=set();self.links=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if tag=='a' and 'href' in a:self.links.append(a['href'])
def fetch(path):
 with urlopen(Request(BASE+path,headers={'Accept':'text/html'}),timeout=30) as r:
  assert r.status==200,(path,r.status);return Page(r.read().decode())
anchors=set()
for root in ['deploy/charts','deploy/observability']:
 for p in (SERVICE/root).rglob('*'):
  if p.is_file():anchors.update(re.findall(r'#(easyp[a-z]+)',p.read_text(errors='replace')))
pages={}
for locale in ['en','ru']:
 for slug in slugs:
  path=('/docs/' if locale=='en' else '/ru/docs/')+'api-service/'+slug
  pages[(locale,slug)]=fetch(path);print('HTTP 200 '+path)
 missing=anchors-pages[(locale,'runbooks')].ids
 assert not missing,(locale,missing);print('RUNBOOK_ANCHORS '+locale+' '+str(len(anchors))+' PASS')
leaves=json.loads((E/'configuration-leaves.json').read_text())
for locale,suffix in [('en','.mdx'),('ru','.ru.mdx')]:
 text=html.unescape((C/'api-service'/('configuration'+suffix)).read_text())
 missing=[x for x in leaves if x['yaml'] not in text or x['env'] not in text]
 assert not missing,missing;print('CONFIG_COVERAGE '+locale+' '+str(len(leaves))+' PASS')
 for slug in slugs:
  text=(C/'api-service'/(slug+suffix)).read_text()
  assert '`' not in text,(locale,slug,'backtick')
  assert '[код:' not in text and 'Написано агентом' not in text
for slug in slugs:
 en=(C/'api-service'/(slug+'.mdx')).read_text();ru=(C/'api-service'/(slug+'.ru.mdx')).read_text()
 assert len(re.findall(r'^#{2,6} ',en,re.M))==len(re.findall(r'^#{2,6} ',ru,re.M)),slug
print('EN_RU_STRUCTURE '+str(len(slugs))+' PASS')
raw_env=[]
for p in (SERVICE/'internal').rglob('*.go'):
 if p.name.endswith('_test.go'):continue
 for n,line in enumerate(p.read_text().splitlines(),1):
  if 'env:"' in line:raw_env.append((str(p.relative_to(SERVICE)),n))
facts=(R/'service-facts.md').read_text()
assert all(('service/'+path+':'+str(n)) in facts for path,n in raw_env)
print('RAW_ENV_TAG_DECLARATIONS '+str(len(raw_env))+' PASS')
import yaml
values=yaml.safe_load((SERVICE/'deploy/charts/easyp-service/values.yaml').read_text())
def flatten(obj,prefix=''):
 for key,value in obj.items():
  path=(prefix+'.'+str(key)).lstrip('.')
  if isinstance(value,dict) and value:yield from flatten(value,path)
  else:yield path
for suffix in ['.mdx','.ru.mdx']:
 text=html.unescape((C/'api-service'/('installation'+suffix)).read_text())
 missing=[k for k in flatten(values) if k not in text];assert not missing,missing
print('HELM_VALUES '+str(len(list(flatten(values))))+' PASS')
bad=[];checked=0
for p in C.rglob('*.mdx'):
 text=p.read_text();text=re.sub(r'^(`{3,}|~{3,})[^\n]*\n.*?^\1\s*$', '',text,flags=re.M|re.S)
 text=re.sub(r'<pre>.*?</pre>','',text,flags=re.S)
 for match in re.finditer(r'(?<!!)\[[^\]\n]+\]\(([^\s)]+)(?:\s+[^)]*)?\)',text):
  link=html.unescape(match.group(1));parts=urlsplit(link)
  if parts.scheme or parts.netloc or not parts.path:continue
  target=unquote(parts.path)
  if target.startswith(('/docs/','/en/docs/','/ru/docs/')):target=target.split('/docs/',1)[1]
  elif target.startswith('/'):continue
  else:target=posixpath.normpath((p.relative_to(C).parent/target).as_posix())
  target=re.sub(r'\.(mdx|md)$','',target)
  choices=[C/(target+'.mdx'),C/(target+'.ru.mdx'),C/target/'index.mdx',C/target/'index.ru.mdx']
  checked+=1
  if not any(c.is_file() for c in choices):bad.append({'file':str(p.relative_to(D)),'link':link,'target':target})
  if p.parent==C/'api-service' and target.startswith('api-service/') and parts.fragment:
   locale='ru' if '.ru.' in p.name else 'en';slug=target.split('/')[-1]
   assert unquote(parts.fragment) in pages[(locale,slug)].ids,(p.name,link)
api_bad=[x for x in bad if x['file'].startswith('content/docs/api-service/')];assert not api_bad,api_bad
(E/'file-link-issues.json').write_text(json.dumps(bad,ensure_ascii=False,indent=2))
print('INTERNAL_LINK_TARGETS checked='+str(checked)+' api_errors=0 existing_elsewhere='+str(len(bad)))
expected=['inventory.md','service-facts.md','bsr-facts.md','comparison-matrix.md','code-vs-docs-discrepancies.md','for-next-prompt-cli.md','REPORT.md']
for name in expected:
 text=(R/name).read_text();assert text.startswith('Автор: '),name;assert '`' not in text,name
print('REPORTS 7 AUTHORSHIP PASS')
print('VALIDATION=PASS; navigation must also be checked after browser hydration')
