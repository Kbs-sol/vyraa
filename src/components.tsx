import { raw } from 'hono/html'
import type { Child } from 'hono/jsx'
import {
  categories, concerns, clientCatalog, site, families, inr, off, cardVariants, pillText, rankBadge, productsIn,
  cardMode, eyebrowOf, sizeLine, optionText, selectLabel,
  type Family,
} from './lib/catalog'

/* ---------------------------------------------------------------- icons */
const P: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bag: '<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  shop: '<path d="M4 9h16l-1.2 10.2a1 1 0 0 1-1 .8H6.2a1 1 0 0 1-1-.8L4 9Z"/><path d="M4 9l1.6-4.2A1 1 0 0 1 6.5 4h11a1 1 0 0 1 .9.8L20 9"/><path d="M9.5 13a2.5 2.5 0 0 0 5 0"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  star: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.5Z"/>',
  flame: '<path d="M12 3c.5 3-1.5 4.4-3 6.2C7.6 10.9 7 12.4 7 14a5 5 0 0 0 10 0c0-1.7-.7-3-1.7-4.2-.4 1-1 1.7-1.8 2C14 9.5 13.4 5.6 12 3Z"/>',
  truck: '<path d="M3 6.5h11v9H3z"/><path d="M14 9.5h4l3 3v3h-7z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  play: '<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.5-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c3-4 6-7 10-9"/>',
  shield: '<path d="M12 3 5 6v5.5c0 4.3 2.9 7.4 7 9.5 4.1-2.1 7-5.2 7-9.5V6l-7-3Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  drop: '<path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.700 12 3.500 12 3.500Z"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.600-7 10-7 10Z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z"/>',
  insta: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.500 3.500 0 0 1 7 0v2.500"/>',
  headset: '<path d="M4.500 13v-1a7.500 7.500 0 0 1 15 0v1"/><rect x="3.500" y="13" width="4" height="6" rx="1.500"/><rect x="16.500" y="13" width="4" height="6" rx="1.500"/>',
  tag: '<path d="M3.500 12.500V4.500h8l9 9-8 8-9-9Z"/><circle cx="8" cy="9" r="1.200"/>',
  pin: '<path d="M12 21s-6.500-5.600-6.500-11a6.500 6.500 0 0 1 13 0c0 5.400-6.500 11-6.500 11Z"/><circle cx="12" cy="10" r="2.400"/>',
  box: '<path d="m3.500 7.500 8.500-4 8.500 4v9l-8.500 4-8.500-4v-9Z"/><path d="m3.500 7.500 8.500 4 8.500-4M12 11.500v9"/>',
}
export const Icon = ({ n, fill, cls }: { n: string; fill?: boolean; cls?: string }) =>
  raw(`<svg class="icon${fill ? ' icon--fill' : ''}${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`)

const json = (o: unknown) => raw(JSON.stringify(o).replace(/</g, '\\u003c'))

/* ---------------------------------------------------------------- marquee */
export const KEYWORDS = [
  '100% Natural', 'Herbal', 'Sulphate Free', 'Paraben Free', 'Chemical Free',
  'Handmade in India', 'Free Shipping', 'Suitable for All Hair Types', '9 Traditional Herbs', 'Rosemary', 'Bhringraj', 'Amla', 'Neem', 'Truth in Every Drop',
]
export const Marquee = () => {
  const copies = 4
  const group = (
    <span class="marquee__group">
      {KEYWORDS.map((k) => (
        <>
          <span>{k}</span>
          <span class="marquee__sep" aria-hidden="true">{'\u2726'}</span>
        </>
      ))}
    </span>
  )
  return (
    <div class="marquee" role="region" aria-label="Why Vyra">
      <a href="/shop" class="marquee__viewport" aria-label={KEYWORDS.slice(0, 8).join(', ')}>
        <span class="marquee__track" aria-hidden="true" style={`--copies:${copies}`}>
          {Array.from({ length: copies }).map(() => group)}
        </span>
      </a>
    </div>
  )
}

/* ---------------------------------------------------------------- product card */
export const Stars = ({ rating, count }: { rating: number; count: number }) =>
  count ? (
    <span class="rating">
      <Icon n="star" />
      {rating.toFixed(1)} <small>({count})</small>
    </span>
  ) : null

export const ProductCard = ({ f, eager }: { f: Family; eager?: boolean }) => {
  const cur = f.def
  const sp = cur.product
  const badge = rankBadge(f)
  const href = `/product/${cur.slug}`
  const eyebrow = eyebrowOf(f)
  const isDiscounted = sp.mrp && sp.mrp > sp.price
  const discountPercent = isDiscounted ? Math.round(((sp.mrp! - sp.price) / sp.mrp!) * 100) : 0

  return (
    <article class="pcard" data-fid={f.id} data-cat={f.category}>
      <a class="pcard__media" href={href} data-role="link" aria-label={f.title}>
        <img src={sp.images[0]} alt={`${f.title} - ${sp.name}`} width="480" height="480" loading={eager ? 'eager' : 'lazy'} decoding="async" data-role="img" />
        {badge && <span class={`pcard__badge${badge === 'New' ? ' pcard__badge--new' : ''}`}>{badge}</span>}
        {isDiscounted && <span class="pcard__discount-tag">{discountPercent}% OFF</span>}
      </a>
      <div class="pcard__body">
        {eyebrow && <p class="pcard__eyebrow">{eyebrow}</p>}
        <h3 class="pcard__title"><a href={href} data-role="link">{f.title}</a></h3>
        <p class="pcard__sub">{f.tagline}</p>
        <div class="pcard__price">
          <span class="price" data-role="price">{inr(sp.price)}</span>
          {isDiscounted && <span class="mrp" data-role="mrp">{inr(sp.mrp!)}</span>}
        </div>
        <button type="button" class="btn btn--block btn--sm btn--bag" data-add={cur.slug} data-role="add">
          <Icon n="bag" /> Add to cart
        </button>
      </div>
    </article>
  )
}

/* ---------------------------------------------------------------- layout */
export type LayoutProps = {
  title: string
  desc?: string
  active?: 'home' | 'shop' | 'categories' | 'reviews' | 'best' | 'track' | ''
  hideNav?: boolean
  buybar?: boolean
  image?: string
  ld?: unknown
  children?: Child
  q?: string
}

const NAV: { id: string; label: string; href?: string; icon: string }[] = [
  { id: 'shop', label: 'Shop', href: '/shop', icon: 'shop' },
  { id: 'categories', label: 'Categories', icon: 'grid' },
  { id: 'reviews', label: 'Reviews', href: '/reviews', icon: 'star' },
  { id: 'best', label: 'Best Sellers', href: '/best-sellers', icon: 'flame' },
  { id: 'track', label: 'Track Order', href: '/track-order', icon: 'truck' },
]

export const BottomNav = ({ active }: { active?: string }) => (
  <nav class="bottomnav" aria-label="Primary">
    <ul>
      {NAV.map((n) => (
        <li>
          {n.href ? (
            <a href={n.href} aria-current={active === n.id ? 'page' : undefined}>
              <Icon n={n.icon} />
              <span>{n.label}</span>
            </a>
          ) : (
            <button type="button" data-open="cat-sheet" aria-haspopup="dialog" class={active === n.id ? 'is-on' : ''}>
              <Icon n={n.icon} />
              <span>{n.label}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  </nav>
)

export const SearchBar = ({ q }: { q?: string }) => (
  <div class="searchbar wrap">
    <form class="search" action="/search" method="get" role="search" autocomplete="off">
      <Icon n="search" />
      <label class="sr-only" for="q">Search products</label>
      <input id="q" name="q" type="search" placeholder="Search hair oil, shampoo, kits..." value={q || ''} enterkeyhint="search" autocomplete="off" />
      <button type="submit">Search</button>
    </form>
    <div class="suggest" id="suggest" role="listbox" aria-label="Suggestions"></div>
  </div>
)

export const Layout = (p: LayoutProps) => {
  const desc = p.desc || '100% natural, handmade herbal hair care from Vyra Herbals. Chemical-free, sulphate-free, paraben-free. ISO 9001:2015 and GMP certified. Free shipping across India.'
  const image = p.image || '/static/img/brand/og.webp'
  return (
    <>
      {raw('<!DOCTYPE html>')}
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <title>{p.title}</title>
          <meta name="description" content={desc} />
          <meta name="theme-color" content="#f8f4ec" />
          {/* Prototype build: keep out of search engines until it replaces the live site */}
          <meta name="robots" content="noindex, nofollow" />
          <meta property="og:title" content={p.title} />
          <meta property="og:description" content={desc} />
          <meta property="og:image" content={image} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Vyra Herbals" />
          <link rel="icon" href="/static/img/brand/logo.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600&display=swap" />
          <link rel="stylesheet" href="/static/style.css?v=3" />
          {p.ld ? <script type="application/ld+json">{json(p.ld)}</script> : null}
        </head>
        <body class={`${p.hideNav ? '' : 'has-bottom-nav'}${p.buybar ? ' has-buybar' : ''}`}>
          <a class="sr-only" href="#main">Skip to content</a>
          <div class="announce" role="status">
            <div class="announce__msg is-static"><span>Free shipping available on all products</span></div>
          </div>
          <header class="site-header">
            <div class="wrap site-header__row">
              <a class="brand" href="/" aria-label="Vyra Herbals - home">
                <img src="/static/img/brand/logo.webp" alt="Vyra" width="70" height="34" />
              </a>
              <nav class="nav-desktop" aria-label="Main">
                <a href="/shop" aria-current={p.active === 'shop' ? 'page' : undefined}>Shop</a>
                <a href="/categories" aria-current={p.active === 'categories' ? 'page' : undefined}>Categories</a>
                <a href="/best-sellers" aria-current={p.active === 'best' ? 'page' : undefined}>Best Sellers</a>
                <a href="/reviews" aria-current={p.active === 'reviews' ? 'page' : undefined}>Reviews</a>
                <a href="/track-order" aria-current={p.active === 'track' ? 'page' : undefined}>Track Order</a>
              </nav>
              <button type="button" class="icon-btn" data-open="cart" aria-label="Open bag">
                <Icon n="bag" />
                <span class="badge" id="cart-count" aria-live="polite">0</span>
              </button>
            </div>
            <SearchBar q={p.q} />
          </header>

          <main id="main">{p.children}</main>

          <footer class="footer">
            <div class="wrap">
              <div class="footer__grid">
                <div>
                  <img class="footer__logo" src="/static/img/brand/logo-light.webp" alt="Vyra Herbals" width="90" height="44" loading="lazy" />
                  <p style="margin-top:14px">Experience the power of nature with our Vyra herbal hair care products, formulated to promote healthy, shiny and beautiful hair.</p>
                  <h4 style="margin-top:22px">Our delivery partners</h4>
                  <div class="partners">
                    {['delhivery', 'xpressbees', 'ecom', 'dtdc'].map((d) => (
                      <img src={`/static/img/ship/${d}.webp`} alt={d} loading="lazy" height="26" />
                    ))}
                  </div>
                  <p style="margin-top:12px;font-size:12.5px">100% secure payments by EaseBuzz</p>
                </div>
                <div class="footer__cols">
                  <div>
                    <h4>Shop</h4>
                    <ul>
                      <li><a href="/shop">All products</a></li>
                      {categories.map((c) => (<li><a href={`/category/${c.slug}`}>{c.name}</a></li>))}
                    </ul>
                  </div>
                  <div>
                    <h4>Explore</h4>
                    <ul>
                      <li><a href="/best-sellers">Best sellers</a></li>
                      <li><a href="/reviews">Reviews</a></li>
                      <li><a href="/track-order">Track order</a></li>
                      <li><a href="/blogs">Journal</a></li>
                      <li><a href="/about">About us</a></li>
                      <li><a href="/faqs">FAQs</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4>Contact</h4>
                    <ul>
                      <li><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></li>
                      <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
                      <li>{site.address[0]}<br />{site.address[1]}</li>
                      <li><a href="/contact">Contact us</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="footer__legal">
                <span>{'\u00A9'} 2026 VyraHerbals. All rights reserved.</span>
                <span><a href="/privacy-policy">Privacy Policy</a> {'\u00B7'} <a href="/terms-conditions">Terms and Conditions</a></span>
              </div>
            </div>
          </footer>

          {!p.hideNav && <BottomNav active={p.active} />}

          {/* category sheet (opened from bottom nav) */}
          <div class="overlay" id="overlay" data-close></div>
          <div class="sheet" id="cat-sheet" role="dialog" aria-modal="true" aria-label="Categories">
            <div class="sheet__grab" />
            <h3>Shop by category</h3>
            <div class="sheet__grid">
              {categories.map((c) => (
                <a href={`/category/${c.slug}`}>
                  <img src={c.image} alt="" loading="lazy" width="120" height="120" />
                  {c.name}
                </a>
              ))}
            </div>
            <div class="sheet__sub">Or by concern</div>
            <div class="chips" style="margin-bottom:0;flex-wrap:wrap;overflow:visible">
              {concerns.map((c) => (<a class="chip-btn" href={`/concern/${c.slug}`}>{c.name}</a>))}
            </div>
          </div>

          {/* bag drawer */}
          <aside class="drawer" id="cart" role="dialog" aria-modal="true" aria-label="Your bag">
            <div class="drawer__head">
              <h3>Your bag</h3>
              <button type="button" class="icon-btn" data-close aria-label="Close bag"><Icon n="x" /></button>
            </div>
            <div class="drawer__body" id="cart-body" />
            <div class="drawer__foot" id="cart-foot" />
          </aside>

          {/* lightbox / video modal */}
          <div class="modal" id="modal" role="dialog" aria-modal="true" aria-label="Preview">
            <div class="modal__box">
              <button type="button" class="modal__x" data-close-modal aria-label="Close"><Icon n="x" /></button>
              <div id="modal-body" />
            </div>
          </div>
          <div class="toast" id="toast" role="status" aria-live="polite" />

          <script id="vyra-data" type="application/json">{json({ ...clientCatalog(), whatsapp: site.whatsapp, checkoutUrl: '' })}</script>
          <script src="/static/app.js?v=3" defer />
        </body>
      </html>
    </>
  )
}

/* ---------------------------------------------------------------- shared bits */
export const SectionHead = ({ eyebrow, title, sub, center, more }: { eyebrow?: string; title: string; sub?: string; center?: boolean; more?: { href: string; label: string } }) => (
  <div class={`section__head${center ? ' section__head--center' : ''}${more ? ' section__head--row' : ''}`}>
    <div>
      {eyebrow && <div class="eyebrow">{eyebrow}</div>}
      <h2 class="h2" style={eyebrow ? 'margin-top:6px' : ''}>{title}</h2>
      {sub && <p class="section__sub" style="margin-top:6px">{sub}</p>}
    </div>
    {more && (
      <a class="link-more" href={more.href}>{more.label} <Icon n="arrow" /></a>
    )}
  </div>
)

export const Crumbs = ({ items }: { items: { href?: string; label: string }[] }) => (
  <nav class="crumbs" aria-label="Breadcrumb">
    {items.map((i, idx) => (
      <>
        {i.href ? <a href={i.href}>{i.label}</a> : <span aria-current="page">{i.label}</span>}
        {idx < items.length - 1 && <span aria-hidden="true">/</span>}
      </>
    ))}
  </nav>
)

export const RitualBanner = () => (
  <section class="ritual" aria-label="Find your ritual">
    <h3>Find your ritual.</h3>
    <p>Not sure where to begin? Pick a concern and we will show the products that fit it, or start with a complete kit.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <a class="btn btn--light" href="/category/kits">Shop complete kits</a>
      <a class="btn btn--outline" style="color:var(--cream);border-color:#516253" href="/concern/hair-fall">Shop by concern</a>
    </div>
  </section>
)

export const countIn = (slug: string) => productsIn(slug).length
export const allCount = families.length

/* ------------------------------------------------------------------ */
/* Customer video stories (YouTube Shorts with Drive fallback)          */
/* ------------------------------------------------------------------ */
import type { Story } from './lib/catalog'
export const StoryCard = ({ s, i }: { s: Story; i: number }) => (
  <figure class="story-card">
    <button type="button" class="story" data-video={s.drive} data-youtube={s.youtube || ''} aria-label={`Play: ${s.title}`}>
      <img src={s.img} alt={`${s.title} - customer video thumbnail`} width="190" height="338" loading="lazy" />
      <span class="story__play"><Icon n="play" fill /></span>
    </button>
    <figcaption class="story-card__cap"><small>{s.kind}</small><b>{s.title}</b></figcaption>
  </figure>
)
export const videoLd = (list: Story[]) => ({
  '@context': 'https://schema.org',
  '@graph': list.filter((s) => s.youtube).map((s) => ({
    '@type': 'VideoObject', name: `${s.title} | Vyra Herbals customer review`, description: s.desc,
    thumbnailUrl: [`https://img.youtube.com/vi/${s.youtube}/hqdefault.jpg`],
    embedUrl: `https://www.youtube.com/embed/${s.youtube}`, contentUrl: `https://www.youtube.com/shorts/${s.youtube}`,
    uploadDate: '2025-01-01',
  })),
})
