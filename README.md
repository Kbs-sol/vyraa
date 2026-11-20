# Vyra Herbals – UI/UX redesign (prototype)

Mobile-first redesign of vyraherbals.com (herbal hair care, Mandamarri, Telangana). Built as a new, self-contained codebase so it can be integrated into the live system later.

- **Stack**: Hono (SSR JSX) on Cloudflare Pages, Vite, TypeScript, vanilla JS front-end, no runtime DB.
- **Status**: prototype, `noindex`. Checkout is a WhatsApp hand-off until wired to the live store.

## Homepage order
Announcement bar (free shipping) → Logo → Search → Categories rail → Hero (before/after ×2 + combo) → Marquee → Shop by Concern (2×2) → Best Sellers → Before & After → Explore all products → Customer stories → Making video → Certifications / promises / founder / journey → Testimonials → Connect, marketplaces, journal, services → Footer.

Bottom navigation (5): **Shop · Categories · Reviews · Best Sellers · Track Order**.

## Routes
| Path | Page |
|---|---|
| `/` | Home |
| `/shop` , `/categories`, `/category/:slug` | Listing pages |
| `/concerns`, `/concern/:slug` | Shop by concern |
| `/product/:sku` | Product page (same SKU slugs as the live site) |
| `/search?q=` | Search |
| `/best-sellers` (`/new-launches` redirects) | Best sellers / New launches tabs |
| `/reviews` (`/testimonials` redirects) | Testimonials + Before & After |
| `/track-order` | Order tracking hand-off |
| `/about /blogs /blogs/:slug /faqs /contact /privacy-policy /terms-conditions` | 302 → `https://www.vyraherbals.com<path>` |

## Variant / combo selectors
- Single axis (size): wrapping size pills above an outline **Add to bag** button, price line `₹249  100 ml`, category eyebrow.
- Combos: native `<select>` "Oil / Shampoo sizes" with options such as `100 / 200 ml` … `500 / 500 ml`.
- PDP: same selectors, qty, **Add to cart** + **Buy now**, and a sticky bottom bar (price + both buttons).

## Data
- `src/data/*.json` – products, categories, concerns, site content (generated from the live site).
- `src/lib/catalog.ts` – groups 29 SKUs into 13 families with axes; helpers for card modes (`pills | select | choose | single`).
- `public/static/img/**` – optimized WebP images; `scripts/prepare-assets.py` regenerates them.
- Cart: `localStorage` key `vyra_cart_v2`.

## Integration notes
- Product slugs equal live SKUs, so URLs map 1:1.
- Set `DATA.checkoutUrl` (Layout `#vyra-data` / `public/static/app.js`) to send checkout to the live store; otherwise WhatsApp (`wa.me/919866082590`).
- Placeholders awaiting assets (configure in `src/data/site.json`): `makingVideo`, `makingVideoPoster`, `testimonialShots`.
- No KV / cron triggers used (hosted-deploy compatible).

## Develop
```bash
npm install
npm run build
pm2 start ecosystem.config.cjs     # wrangler pages dev dist on :3000
```
