import { Layout, Icon, ProductCard, Crumbs, SectionHead, Marquee, RitualBanner, countIn } from '../components'
import {
  categories, concerns, families, bestSellers, newLaunches, sortFamilies, searchFamilies, beforeAfter, testimonials, reviews, site,
  type Family, type SortKey, type Category, type Concern, inr,
} from '../lib/catalog'

const SORTS: [SortKey, string][] = [['featured', 'Featured'], ['best', 'Best selling'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['rating', 'Top rated']]
const Sort = ({ cur }: { cur: SortKey }) => (
  <select class="select" data-sort aria-label="Sort products">
    {SORTS.map(([k, l]) => (<option value={k} selected={k === cur}>{l}</option>))}
  </select>
)
const Chips = ({ cur }: { cur?: string }) => (
  <div class="chips">
    <a class={`chip-btn${!cur ? ' is-on' : ''}`} href="/shop">All</a>
    {categories.map((c) => (<a class={`chip-btn${cur === c.slug ? ' is-on' : ''}`} href={`/category/${c.slug}`}>{c.name}</a>))}
  </div>
)
const Grid = ({ list }: { list: Family[] }) =>
  list.length ? <div class="grid-products">{list.map((f, i) => (<ProductCard f={f} eager={i < 4} />))}</div> : (
    <div class="empty"><p>No products found.</p><a class="btn btn--sm" href="/shop">Browse everything</a></div>
  )

export const Shop = ({ sort }: { sort: SortKey }) => (
  <Layout title="Shop the collection | Vyra Herbals" active="shop">
    <div class="wrap">
      <header class="page-head">
        <Crumbs items={[{ href: '/', label: 'Home' }, { label: 'Shop' }]} />
        <h1 class="h2">Shop the collection</h1>
        <p class="section__sub">{families.length} herbal products, hand-blended in Mandamarri. Free shipping across India.</p>
      </header>
      <Chips />
      <div class="toolbar"><span>{families.length} products</span><Sort cur={sort} /></div>
      <Grid list={sortFamilies(families, sort)} />
      <RitualBanner />
    </div>
  </Layout>
)

export const CategoryPage = ({ c, sort }: { c: Category; sort: SortKey }) => {
  const list = families.filter((f) => f.category === c.slug)
  return (
    <Layout title={`${c.name} | Vyra Herbals`} desc={c.blurb} active="categories">
      <div class="wrap">
        <header class="page-head">
          <Crumbs items={[{ href: '/', label: 'Home' }, { href: '/categories', label: 'Categories' }, { label: c.name }]} />
          <h1 class="h2">{c.name}</h1>
          <p class="section__sub">{c.blurb}</p>
        </header>
        <Chips cur={c.slug} />
        <div class="toolbar"><span>{list.length} {list.length === 1 ? 'product' : 'products'}</span><Sort cur={sort} /></div>
        <Grid list={sortFamilies(list, sort)} />
        <RitualBanner />
      </div>
    </Layout>
  )
}

export const CategoriesPage = () => (
  <Layout title="Categories | Vyra Herbals" active="categories">
    <div class="wrap">
      <header class="page-head"><Crumbs items={[{ href: '/', label: 'Home' }, { label: 'Categories' }]} /><h1 class="h2">Shop by category</h1></header>
      <div class="cat-tiles">
        {categories.map((c) => (
          <a class="cat-tile" href={`/category/${c.slug}`}><img src={c.image} alt="" loading="lazy" width="400" height="400" /><span>{c.name}<small>{countIn(c.slug)} {countIn(c.slug) === 1 ? 'product' : 'products'}</small></span></a>
        ))}
      </div>
      <h2 class="h2" style="margin:36px 0 14px">Or shop by concern</h2>
      <div class="concerns__grid">{concerns.map((c) => <ConcernTile c={c} />)}</div>
    </div>
  </Layout>
)

const EMOJI: Record<string, string> = { 'hair-fall': '\u{1F33F}', 'hair-growth': '\u2728', dandruff: '\u2744\uFE0F', 'dry-damage': '\u{1F4A7}' }
const ConcernTile = ({ c }: { c: Concern }) => (
  <a class="concern" href={`/concern/${c.slug}`}>
    <img src={c.image} alt="" width="360" height="400" loading="lazy" />
    <span class="concern__emoji" aria-hidden="true">{EMOJI[c.slug]}</span>
    <span class="concern__foot"><span class="concern__name">{c.lines[0]}{c.lines[1] ? <><br />{c.lines[1]}</> : null}</span><span class="concern__go"><Icon n="arrow" /></span></span>
  </a>
)

export const ConcernsPage = () => (
  <Layout title="Shop by concern | Vyra Herbals" active="categories">
    <div class="wrap">
      <header class="page-head"><Crumbs items={[{ href: '/', label: 'Home' }, { label: 'Concerns' }]} /><h1 class="h2">Shop by concern</h1></header>
      <div class="concerns__grid">{concerns.map((c) => <ConcernTile c={c} />)}</div>
    </div>
  </Layout>
)

export const ConcernPage = ({ c, sort }: { c: Concern; sort: SortKey }) => {
  const list = c.families.map((id) => families.find((f) => f.id === id)!).filter(Boolean)
  return (
    <Layout title={`${c.name} care | Vyra Herbals`} desc={c.intro} active="categories">
      <div class="wrap">
        <header class="page-head">
          <Crumbs items={[{ href: '/', label: 'Home' }, { href: '/concerns', label: 'Concerns' }, { label: c.name }]} />
          <h1 class="h2">{c.name}</h1>
          <p class="section__sub">{c.intro}</p>
        </header>
        <div class="tip"><b>How to use</b><span>{c.tip}</span></div>
        <div class="chips">
          {concerns.map((x) => (<a class={`chip-btn${x.slug === c.slug ? ' is-on' : ''}`} href={`/concern/${x.slug}`}>{x.name}</a>))}
        </div>
        <div class="toolbar"><span>{list.length} products</span><Sort cur={sort} /></div>
        <Grid list={sortFamilies(list, sort)} />
      </div>
    </Layout>
  )
}

export const Search = ({ q }: { q: string }) => {
  const list = q ? searchFamilies(q) : []
  return (
    <Layout title={`Search${q ? `: ${q}` : ''} | Vyra Herbals`} active="shop" q={q}>
      <div class="wrap">
        <header class="page-head"><h1 class="h2">{q ? `Results for \u201C${q}\u201D` : 'Search'}</h1><p class="section__sub">{q ? `${list.length} ${list.length === 1 ? 'product' : 'products'} found` : 'Type a product, ingredient or concern above.'}</p></header>
        {q && <Grid list={list} />}
        {(!q || !list.length) && (
          <>
            <h2 class="h2" style="margin:24px 0 14px">Popular right now</h2>
            <Grid list={bestSellers().slice(0, 4)} />
          </>
        )}
      </div>
    </Layout>
  )
}

export const BestSellers = ({ tab }: { tab: 'best' | 'new' }) => (
  <Layout title="Best sellers and new launches | Vyra Herbals" active="best">
    <div class="wrap">
      <header class="page-head"><Crumbs items={[{ href: '/', label: 'Home' }, { label: 'Best sellers' }]} /><h1 class="h2">Best sellers and new launches</h1></header>
      <div class="tabs" data-tabs style="margin:10px 0 18px">
        <button type="button" class={tab === 'best' ? 'is-on' : ''} data-tab="best">Best sellers</button>
        <button type="button" class={tab === 'new' ? 'is-on' : ''} data-tab="new">New launches</button>
      </div>
      <div data-panel="best" hidden={tab !== 'best'}><Grid list={bestSellers().slice(0, 8)} /></div>
      <div data-panel="new" hidden={tab !== 'new'}><Grid list={newLaunches()} /></div>
    </div>
  </Layout>
)

export const ReviewsPage = ({ tab }: { tab: 'stories' | 'ba' }) => (
  <Layout title="Customer reviews | Vyra Herbals" active="reviews">
    <div class="wrap">
      <header class="page-head"><Crumbs items={[{ href: '/', label: 'Home' }, { label: 'Reviews' }]} /><h1 class="h2">What customers say</h1><p class="section__sub">{reviews.length} product reviews and {testimonials.length} testimonials from customers across India.</p></header>
      <div class="tabs" data-tabs style="margin:10px 0 18px">
        <button type="button" class={tab === 'stories' ? 'is-on' : ''} data-tab="stories">Testimonials</button>
        <button type="button" class={tab === 'ba' ? 'is-on' : ''} data-tab="ba">Before &amp; after</button>
      </div>
      <div data-panel="stories" hidden={tab !== 'stories'}>
        {site.testimonialShots.length > 0 && (<div class="tstack">{site.testimonialShots.map((s: string) => (<figure class="shot" data-zoom={s}><img src={s} alt="Customer testimonial" loading="lazy" /></figure>))}</div>)}
        <div class="reviews-page-grid">
          {testimonials.map((t) => (
            <article class="tcard"><span class="rating"><Icon n="star" />{t.rating.toFixed(1)}</span><p style="-webkit-line-clamp:unset">{t.text}</p><footer><span class="tcard__av">{t.name.charAt(0)}</span><span>{t.name}<small>Verified customer</small></span></footer></article>
          ))}
        </div>
      </div>
      <div data-panel="ba" hidden={tab !== 'ba'}>
        <div class="grid-products">
          {beforeAfter.map((s, i) => (<figure class="ba__item" style="width:auto" data-zoom={s}><img src={s} alt={`Before and after ${i + 1}`} loading="lazy" width="400" height="400" /></figure>))}
        </div>
      </div>
    </div>
  </Layout>
)

export const TrackOrder = () => (
  <Layout title="Track your order | Vyra Herbals" active="track">
    <div class="wrap" style="max-width:640px">
      <header class="page-head"><Crumbs items={[{ href: '/', label: 'Home' }, { label: 'Track order' }]} /><h1 class="h2">Track your order</h1><p class="section__sub">Enter the order ID from your confirmation (it looks like ORD-...) or your courier AWB number.</p></header>
      <form class="card-panel" id="track-form" data-live={`${site.legacyBase}/track-order`}>
        <div class="field"><label for="track-id">Order ID or AWB</label><input id="track-id" name="id" required placeholder="ORD-123456" autocomplete="off" /></div>
        <button class="btn btn--block" type="submit">Track order</button>
      </form>
      <div class="card-panel" id="track-out" hidden style="margin-top:14px" />
      <p class="section__sub" style="margin-top:18px">Need help? Call <a href={`tel:${site.phone.replace(/\s/g, '')}`} style="text-decoration:underline">{site.phone}</a> or write to {site.email}.</p>
    </div>
  </Layout>
)

export const Simple = ({ title, body }: { title: string; body: string }) => (
  <Layout title={`${title} | Vyra Herbals`} active="">
    <div class="wrap" style="max-width:720px"><header class="page-head"><h1 class="h2">{title}</h1></header><div class="card-panel"><p>{body}</p><a class="btn btn--sm" href={`${site.legacyBase}`}>Open on vyraherbals.com</a></div></div>
  </Layout>
)
export { Marquee, SectionHead, inr }
