"""
One-off asset + data preparation for the Vyra Herbals redesign prototype.
Pulls the live catalog (already scraped to /tmp), downloads images, resizes them to WebP
and writes src/data/*.json.  Re-run only if the live catalog changes.
"""
import json, os, re, subprocess, hashlib
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = '/home/user/webapp'
IMG = f'{ROOT}/public/static/img'
for d in ['p', 'ba', 'stories', 'certs', 'brand', 'market']:
    os.makedirs(f'{IMG}/{d}', exist_ok=True)
os.makedirs(f'{ROOT}/src/data', exist_ok=True)

def save_webp(src, dst, maxw, q=80):
    im = Image.open(src)
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGBA' if 'A' in im.mode or im.mode == 'P' else 'RGB')
    im.thumbnail((maxw, maxw * 3))
    im.save(dst, 'WEBP', quality=q, method=6)
    return os.path.getsize(dst)

def fetch(url, dst):
    if not os.path.exists(dst):
        subprocess.run(['curl', '-s', '-L', '-o', dst, url], check=True)

# ---------- products ----------
raw = json.load(open('/tmp/products_raw.json'))
table = {r['handle']: r for r in json.load(open('/tmp/prodtable.json'))}
jobs = []
out = []
for p in raw:
    t = table.get(p['slug'], {})
    imgs = []
    for i, u in enumerate(p['images']):
        key = re.sub(r'[^a-z0-9]+', '-', p['slug'].lower()).strip('-')
        dst = f'{IMG}/p/{key}-{i+1}.webp'
        jobs.append((u, dst))
        imgs.append(f'/static/img/p/{key}-{i+1}.webp')
    dedup = lambda xs: list(dict.fromkeys(x for x in xs if x))
    out.append(dict(
        id=t.get('id'), slug=p['slug'], name=p['name'], sku=p['sku'], category=p['category'],
        price=p['price'], mrp=p['mrp'], desc=p['desc'], images=imgs,
        benefits=dedup(p['benefits']), ingredients=dedup(p['ingredients']),
        directions=dedup(p['directions']), note=p['note'],
        orders30=t.get('ordered_count_30_days') or 0, featuredOrder=t.get('featured_order') or 999,
    ))

def do(job):
    u, dst = job
    tmp = dst + '.src'
    try:
        fetch(u, tmp)
        save_webp(tmp, dst, 900, 78)
        return True
    except Exception as e:
        print('skip bad image', u, e)
        return False
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)
with ThreadPoolExecutor(8) as ex:
    ok = dict(zip([d for _, d in jobs], ex.map(do, jobs)))
for o in out:
    o['images'] = [i for i in o['images'] if ok.get(f'{ROOT}/public' + i)]
json.dump(out, open(f'{ROOT}/src/data/products.json', 'w'), indent=1, ensure_ascii=False)
print('products', len(out), 'images', len(jobs))

# ---------- before / after ----------
ba = json.load(open('/tmp/ba.json'))
ba_out = []
for r in ba:
    dst = f"{IMG}/ba/ba-{r['id']}.webp"
    save_webp(f"/tmp/ba/ba-{r['id']}.webp", dst, 720, 76)
    ba_out.append(f"/static/img/ba/ba-{r['id']}.webp")
json.dump(ba_out, open(f'{ROOT}/src/data/before_after.json', 'w'), indent=1)
print('before/after', len(ba_out))

# ---------- stories / certs / brand ----------
A = '/tmp/assets'
drive = re.findall(r'story-0(\d)\.webp",video:"https://drive.google.com/file/d/([^/]+)/', open('/tmp/page.js').read())
stories = []
for n, vid in drive:
    save_webp(f'{A}/thumbnails/story-0{n}.webp', f'{IMG}/stories/story-0{n}.webp', 420, 78)
    stories.append(dict(img=f'/static/img/stories/story-0{n}.webp', drive=vid))
json.dump(stories, open(f'{ROOT}/src/data/stories.json', 'w'), indent=1)
for i, name in enumerate(['gmp', 'iso', 'msme', 'sulphate-free'], 1):
    save_webp(f'{A}/certificates/certificate-0{i}.webp', f'{IMG}/certs/{name}.webp', 320, 85)
save_webp(f'{A}/vyra-founder.webp', f'{IMG}/brand/founder.webp', 720, 80)
save_webp(f'{A}/banner/og-image.jpg', f'{IMG}/brand/og.webp', 1200, 80)
# logos: dark (original) + light (for dark backgrounds)
logo = Image.open(f'{A}/logo-final.png').convert('RGBA')
logo.thumbnail((420, 420)); logo.save(f'{IMG}/brand/logo.webp', 'WEBP', quality=90)
r, g, b, a = logo.split()
light = Image.merge('RGBA', (Image.new('L', logo.size, 248), Image.new('L', logo.size, 244), Image.new('L', logo.size, 236), a))
light.save(f'{IMG}/brand/logo-light.webp', 'WEBP', quality=90)
Image.open(f'{A}/logo-final.png').convert('RGBA').resize((512, 249)).save(f'{IMG}/brand/logo.png')
# marketplace logos
for src, name in [('amazon.png', 'amazon'), ('flipkart.png', 'flipkart'), ('meesho.avif', 'meesho')]:
    try:
        save_webp(f'{A}/{src}', f'{IMG}/market/{name}.webp', 240, 88)
    except Exception as e:
        print('market skip', name, e)

# ---------- testimonials + product reviews ----------
ts = json.load(open('/tmp/testi.json'))
ts_out = [dict(name=(t['name'] or '').strip(), rating=t['rating'], text=(t['content'] or '').strip()) for t in ts if t.get('status', 1)]
json.dump(ts_out, open(f'{ROOT}/src/data/testimonials.json', 'w'), indent=1, ensure_ascii=False)
rv = json.load(open('/tmp/reviews.json'))
id2slug = {v['id']: k for k, v in table.items()}
rv_out = [dict(slug=id2slug.get(r['product_id']), name=(r['reviewer_name'] or '').strip(), rating=r['rating'], text=(r['review_text'] or '').strip(), date=(r['date'] or '')[:10]) for r in rv if r.get('status') == 1 and id2slug.get(r['product_id'])]
json.dump(rv_out, open(f'{ROOT}/src/data/reviews.json', 'w'), indent=1, ensure_ascii=False)
print('testimonials', len(ts_out), 'reviews', len(rv_out))
