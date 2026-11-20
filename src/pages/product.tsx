import { raw } from 'hono/html'
import { Layout, Icon, ProductCard, Crumbs, Stars } from '../components'
import {
  type Family, type Variant, categoryBySlug, inr, off, variantLabel, includesOf, noteLines, reviewsForFamily, families,
  isComboFamily, optionText, selectLabel, eyebrowOf, rankBadge, categories, concerns,
} from '../lib/catalog'

const jsonSafe = (o: unknown) => raw(JSON.stringify(o).replace(/</g, '\\u003c'))

/** Sections whose scraped text starts with a heading line like "HAIR OIL:". */
const grouped = (lines: string[]) => {
  const out: { h?: string; items: string[] }[] = []
  for (const l of lines) {
    if (/:\s*$/.test(l) && l.length < 40) out.push({ h: l.replace(/:\s*$/, ''), items: [] })
    else {
      if (!out.length) out.push({ items: [] })
      out[out.length - 1].items.push(l)
    }
  }
  return out.filter((g) => g.items.length)
}
const Block = ({ lines, ordered }: { lines: string[]; ordered?: boolean }) => (
  <>
    {grouped(lines).map((g) => (
      <>
        {g.h && <h5>{g.h[0] + g.h.slice(1).toLowerCase()}</h5>}
        {ordered ? <ol>{g.items.map((i) => <li>{i}</li>)}</ol> : <ul>{g.items.map((i) => <li>{i}</li>)}</ul>}
      </>
    ))}
  </>
)

export const ProductPage = ({ f, v }: { f: Family; v: Variant }) => {
  const p = v.product
  const cat = categoryBySlug(f.category)
  const combo = isComboFamily(f)
  const reviews = reviewsForFamily(f)
  const related = families.filter((x) => x.id !== f.id && (x.category === f.category || x.category === 'hair-oil' || x.category === 'shampoo')).slice(0, 4)
  const concernsFor = concerns.filter((c) => c.families.includes(f.id))
  const badge = rankBadge(f)
  const eyebrow = eyebrowOf(f)
  const data = {
    title: f.title,
    current: v.slug,
    axes: f.axes.map((a) => ({ key: a.key, label: a.label })),
    variants: f.variants.map((x) => ({
      slug: x.slug, attrs: x.attrs, label: variantLabel(f, x),
      p: { n: x.product.name, d: x.product.desc, p: x.product.price, m: x.product.mrp || x.product.price, i: x.product.images, inc: includesOf(x.product) },
    })),
  }
  const inc = includesOf(p)
  const hasDetail = p.benefits.length || p.ingredients.length || p.directions.length
  const notes = noteLines(p)
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, image: p.images, description: p.desc, sku: p.sku,
    brand: { '@type': 'Brand', name: 'Vyra Herbals' },
    offers: { '@type': 'Offer', priceCurrency: 'INR', price: p.price, availability: 'https://schema.org/InStock' },
    ...(reviews.length ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: f.rating, reviewCount: reviews.length } } : {}),
  }
  return (
    <Layout title={`${p.name} | Vyra Herbals`} desc={p.desc.slice(0, 160)} active="shop" buybar image={p.images[0]} ld={ld}>
      <div class="wrap">
        <Crumbs items={[{ href: '/', label: 'Home' }, { href: '/shop', label: 'Shop' }, ...(cat ? [{ href: `/category/${cat.slug}`, label: cat.name }] : []), { label: f.title }]} />
        <div class="pdp" id="pdp">
          <div class="gallery">
            <div class="gallery__track" id="gallery-track">
              {p.images.map((s, i) => (
                <div class="gallery__slide"><img src={s} alt={`${p.name} - image ${i + 1}`} width="800" height="800" loading={i ? 'lazy' : 'eager'} /></div>
              ))}
            </div>
            {badge && <span class={`pcard__badge gallery__badge${badge === 'New' ? ' pcard__badge--new' : ''}`}>{badge}</span>}
            <span class="gallery__count" id="gallery-count">1 / {p.images.length}</span>
            <div class="thumbs" id="thumbs">
              {p.images.map((s, i) => (
                <button type="button" data-th={i} class={i ? '' : 'is-on'} aria-label={`Image ${i + 1}`}><img src={s} alt="" width="68" height="68" /></button>
              ))}
            </div>
          </div>

          <div class="pdp__info">
            {eyebrow && <p class="pdp__eyebrow">{eyebrow}</p>}
            <h1 class="pdp__title" id="pdp-title">{f.title}</h1>
            <p class="pdp__desc" id="pdp-sub" style="font-size:13px;color:var(--muted)">{p.name}</p>
            {f.reviewCount > 0 && <Stars rating={f.rating} count={f.reviewCount} />}
            <div class="pdp__price">
              <span class="price" id="pdp-price">{inr(p.price)}</span>
              <span class="mrp" id="pdp-mrp" hidden={!(p.mrp && p.mrp > p.price)}>{p.mrp ? inr(p.mrp) : ''}</span>
              <span class="off" id="pdp-off" hidden={off(p) === 0}>{off(p)}% off</span>
            </div>
            <p class="pdp__tax">Inclusive of all taxes. Free shipping across India.</p>
            <p class="pdp__desc" id="pdp-desc">{p.desc}</p>

            {/* variation selectors */}
            {f.variants.length > 1 && combo && (
              <div class="opt vsel">
                <label class="vsel__label" for="pdp-select">{selectLabel(f)}</label>
                <select id="pdp-select" class="vsel__select" data-pdp-select>
                  {f.variants.map((x) => (<option value={x.slug} selected={x.slug === v.slug}>{optionText(f, x)}</option>))}
                </select>
              </div>
            )}
            {f.variants.length > 1 && !combo && f.axes.map((a) => (
              <div class="opt">
                <div class="opt__label">{a.label}: <b data-axis-value={a.key}>{v.attrs[a.key]}</b></div>
                <div class="pills" role="group" aria-label={a.label}>
                  {a.values.map((val) => (
                    <button type="button" class={`pill${v.attrs[a.key] === val ? ' is-on' : ''}`} aria-pressed={v.attrs[a.key] === val ? 'true' : 'false'} data-axis={a.key} data-val={val}>{val}</button>
                  ))}
                </div>
              </div>
            ))}

            <div class="pdp__buy" id="pdp-cta">
              <div class="qty" aria-label="Quantity">
                <button type="button" id="qty-minus" aria-label="Decrease quantity"><Icon n="minus" /></button>
                <output id="qty-val">1</output>
                <button type="button" id="qty-plus" aria-label="Increase quantity"><Icon n="plus" /></button>
              </div>
              <button type="button" class="btn btn--outline btn--bag" data-pdp-add style="margin:0"><Icon n="bag" />Add to cart</button>
              <button type="button" class="btn btn--block" data-pdp-buy>Buy now</button>
            </div>

            <div class="includes" id="pdp-includes" hidden={!inc.length}>
              <h4>What is in the box</h4>
              <ul>{inc.map((i) => (<li><Icon n="check" />{i}</li>))}</ul>
            </div>

            <div class="specs" aria-label="Product facts">
              <div><small>Made in</small><b>Mandamarri, Telangana</b></div>
              <div><small>Method</small><b>Hand-blended, small batch</b></div>
              <div><small>Free of</small><b>Sulphates and parabens</b></div>
            </div>

            <div class="acc">
              {p.ingredients.length > 0 && (
                <details open><summary>The formula<Icon n="chev" /></summary><div class="acc__body"><Block lines={p.ingredients} /></div></details>
              )}
              {p.directions.length > 0 && (
                <details><summary>How to use it<Icon n="chev" /></summary><div class="acc__body"><Block lines={p.directions} ordered /></div></details>
              )}
              {p.benefits.length > 0 && (
                <details><summary>What it does<Icon n="chev" /></summary><div class="acc__body"><Block lines={p.benefits} /></div></details>
              )}
              {(notes.length > 0 || !hasDetail) && (
                <details open={!hasDetail}>
                  <summary>Notes and advice<Icon n="chev" /></summary>
                  <div class="acc__body">
                    {notes.length > 0 ? <ul>{notes.map((n) => <li>{n}</li>)}</ul> : <p>Each product ships with its own ingredient declaration and directions. Results vary from person to person; consistent use over 3 to 4 months is recommended.</p>}
                  </div>
                </details>
              )}
              <details>
                <summary>Delivery and returns<Icon n="chev" /></summary>
                <div class="acc__body"><p>Free shipping on all orders across India with Delhivery, Xpressbees, Ecom Express and DTDC. Questions? WhatsApp us on {'+91 9866082590'}.</p></div>
              </details>
            </div>
            {concernsFor.length > 0 && (
              <div class="chips" style="flex-wrap:wrap;overflow:visible;margin:0;padding:0">
                {concernsFor.map((c) => (<a class="chip-btn" href={`/concern/${c.slug}`}>{c.name}</a>))}
              </div>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <section class="section section--tight" aria-label="Reviews">
            <h2 class="h2" style="margin-bottom:14px">Customer reviews <small style="font-size:15px;color:var(--muted);font-family:var(--sans)">({reviews.length})</small></h2>
            <div class="revlist reviews-page-grid">
              {reviews.slice(0, 6).map((r) => (
                <article class="rev"><span class="rating"><Icon n="star" />{r.rating.toFixed(1)}</span><p>{r.text}</p><b>{r.name}</b><small>{r.date}</small></article>
              ))}
            </div>
          </section>
        )}

        <section class="section section--tight" aria-label="Alongside it">
          <h2 class="h2" style="margin-bottom:16px">Alongside it</h2>
          <div class="grid-products">{related.map((x) => (<ProductCard f={x} />))}</div>
        </section>
      </div>

      {/* sticky buy bar: price + Add to cart + Buy now */}
      <div class="buybar" id="buybar" role="region" aria-label="Quick purchase">
        <div class="buybar__in">
          <div class="buybar__price">
            <b id="buybar-price">{inr(p.price)}</b>
            <s id="buybar-mrp">{p.mrp && p.mrp > p.price ? inr(p.mrp) : ''}</s>
            <small id="buybar-label">{variantLabel(f, v)}</small>
          </div>
          <button type="button" class="btn btn--outline btn--bag" data-pdp-add style="margin:0"><Icon n="bag" />Add to cart</button>
          <button type="button" class="btn" data-pdp-buy>Buy now</button>
        </div>
      </div>
      <script id="pdp-data" type="application/json">{jsonSafe(data)}</script>
    </Layout>
  )
}

export const NotFound = () => (
  <Layout title="Page not found | Vyra Herbals" active="">
    <div class="wrap"><div class="empty"><h1 class="h2">We could not find that page</h1><p>The product or page may have moved.</p><a class="btn" href="/shop">Back to the shop</a></div></div>
  </Layout>
)
export { categories }
