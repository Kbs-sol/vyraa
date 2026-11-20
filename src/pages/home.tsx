import {
  Layout, Icon, Marquee, ProductCard, SectionHead, countIn,
} from '../components'
import {
  categories, concerns, bestSellers, families, beforeAfter, stories, testimonials, site, productBySlug, inr, off,
} from '../lib/catalog'

const EMOJI: Record<string, string> = { 'hair-fall': '\u{1F33F}', 'hair-growth': '\u2728', dandruff: '\u2744\uFE0F', 'dry-damage': '\u{1F4A7}' }

const JOURNAL = [
  { img: '/static/img/blog/hair-oiling.webp', tag: 'Ritual', t: 'Hair oiling: how, when and how often', u: '/blogs/hair-oiling-how-when-how-often' },
  { img: '/static/img/blog/rosemary.webp', tag: 'Herbs', t: 'Rosemary leaves for hair growth: a powerful herb for scalp and hair health', u: '/blogs/rosemary-leaves-for-hair-growth-a-powerful-herb-for-scalp-hair-health' },
  { img: '/static/img/blog/scalp-massager.webp', tag: 'Tools', t: 'Scalp massager with silicone bristles: gentle care for a healthier scalp', u: '/blogs/scalp-massager-with-silicone-bristles-gentle-care-for-a-healthier-scalp' },
]

export const Home = () => {
  const kit = productBySlug('vyra-all-in-one-hair-growth-kit')!
  const best = bestSellers().slice(0, 8)
  const explore = families.slice(0, 8)
  return (
    <Layout title="Vyra Herbals | Truth in Every Drop" active="home">
      {/* 1. Category circular rail (compact with images like Avimee reference) */}
      <section class="cats-mini wrap" aria-label="Shop by category">
        <div class="cats-mini__rail">
          {categories.map((c) => (
            <a class="cat-item" href={`/category/${c.slug}`}>
              <div class="cat-item__avatar">
                <img src={c.image} alt={c.name} width="52" height="52" loading="eager" />
              </div>
              <span class="cat-item__title">{c.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 2. Hero Section: Unified Interactive Before/After Proof & Combo Routine Console */}
      <section class="hero-unified wrap" aria-labelledby="hero-title">
        <div class="hero-unified__head">
          <h1 class="hero-unified__title" id="hero-title">
            Truth in <em>every drop.</em>
          </h1>
          <p class="hero-unified__sub">
            Real customer transformations powered by our 3-step traditional botanical hair routine.
          </p>
        </div>

        {/* The Unified Interactive Console */}
        <div class="proof-combo-unit" id="proof-combo-unit">
          {/* Top Banner inside Unit */}
          <div class="unit-header">
            <div class="unit-header__badge">
              <span class="pulse-dot"></span>
              <b>PROVEN RESULTS ROUTINE</b>
            </div>
            <div class="unit-header__savings">
              Save <b>{off(kit)}%</b> on the Complete Kit
            </div>
          </div>

          <div class="unit-body">
            {/* Visual Half: Interactive Before/After Viewer */}
            <div class="unit-proof" data-zoom="/static/img/ba/hero-ba-2.jpeg">
              <div class="unit-proof__images">
                <div class="proof-panel proof-panel--before">
                  <img src="/static/img/ba/hero-ba-1.jpeg" alt="Customer hair fall & thinning before using Vyra" width="460" height="460" loading="eager" />
                  <span class="proof-pill proof-pill--before">BEFORE</span>
                </div>
                <div class="proof-panel proof-panel--after">
                  <img src="/static/img/ba/hero-ba-2.jpeg" alt="Visible new hair growth & density after using Vyra" width="460" height="460" loading="eager" />
                  <span class="proof-pill proof-pill--after">AFTER (8 WEEKS)</span>
                </div>
              </div>
              <div class="unit-proof__caption">
                <span class="unit-proof__quote">★★★★★ "Visible hair regrowth & fall control in 60 days"</span>
                <span class="unit-proof__hint">Tap to zoom results <Icon n="arrow" /></span>
              </div>
            </div>

            {/* Product & Action Half: Clean Product Buy Card */}
            <div class="unit-combo">
              <div class="unit-combo__meta">
                <span class="chip-sm">ALL-IN-ONE COMBO</span>
                <h2 class="unit-combo__name">{kit.name}</h2>
                <div class="price-row" style="margin-top: 4px;">
                  <b class="price-now">{inr(kit.price)}</b>
                  {kit.mrp && <s class="price-was">{inr(kit.mrp)}</s>}
                  <span class="discount-badge">{off(kit)}% OFF</span>
                </div>
                <p class="unit-combo__tax">Inclusive of all taxes. Free shipping across India.</p>
              </div>

              {/* Product Card Actions */}
              <div class="unit-combo__checkout">
                <div class="unit-combo__actions">
                  <button type="button" class="btn btn--block btn--combo-primary" data-add={kit.slug}>
                    <Icon n="bag" /> Add to bag
                  </button>
                  <a class="btn btn--block btn--combo-buy" href={`/product/${kit.slug}`}>
                    Buy now
                  </a>
                </div>
                <div class="unit-combo__trust-badges">
                  <span><Icon n="truck" /> Free India Delivery</span>
                  <span><Icon n="leaf" /> 100% Herbal</span>
                  <span><Icon n="shield" /> ISO & GMP Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. flowing keyword marquee */}
      <Marquee />

      {/* 4. shop by concern 2x2 without emojis */}
      <section class="section concerns" aria-labelledby="concern-title">
        <div class="wrap">
          <SectionHead eyebrow="Targeted care" title="Shop by Concern" more={{ href: '/concerns', label: 'View all Concerns' }} />
          <div class="concerns__grid reveal">
            {concerns.map((c) => (
              <a class="concern" href={`/concern/${c.slug}`}>
                <img src={c.image} alt={c.name} width="360" height="400" loading="lazy" />
                <span class="concern__foot">
                  <span class="concern__name-box">
                    <span class="concern__name">{c.name}</span>
                    <span class="concern__desc">{c.slug === 'hair-fall' ? 'Root strengthening' : c.slug === 'hair-growth' ? 'Follicle activation' : c.slug === 'dandruff' ? 'Scalp balance' : 'Deep nourishment'}</span>
                  </span>
                  <span class="concern__go"><Icon n="arrow" /></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. best sellers */}
      <section class="section" aria-labelledby="best-title">
        <div class="wrap">
          <SectionHead eyebrow="Most loved" title="Best Sellers" more={{ href: '/best-sellers', label: 'View all' }} />
          <div class="rail">{best.map((f, i) => (<ProductCard f={f} eager={i < 2} />))}</div>
        </div>
      </section>

      {/* 6. customer transformation gallery (community proof) */}
      <section class="section ba" aria-labelledby="ba-title">
        <div class="wrap">
          <SectionHead eyebrow="Real transformations" title="Customer Growth Gallery" sub="Photos shared by our community after 60 to 90 days of consistent herbal ritual." more={{ href: '/reviews', label: 'See more stories' }} />
          <div class="ba__rail" id="ba-rail">
            {beforeAfter.map((src, i) => (
              <figure class="ba__item" data-zoom={src}>
                <img src={src} alt={`Customer before and after ${i + 1}`} width="340" height="340" loading="lazy" />
              </figure>
            ))}
          </div>
          <div class="dots" data-dots="ba-rail" aria-hidden="true" />
          <p class="ba__note">Swipe to see more. Tap a photo to enlarge.</p>
        </div>
      </section>

      {/* 7. explore all products */}
      <section class="section" aria-labelledby="explore-title">
        <div class="wrap">
          <SectionHead eyebrow="The full range" title="Explore all products" />
          <div class="chips">
            <a class="chip-btn is-on" href="/shop">All</a>
            {categories.map((c) => (<a class="chip-btn" href={`/category/${c.slug}`}>{c.name}</a>))}
          </div>
          <div class="grid-products">{explore.map((f) => (<ProductCard f={f} />))}</div>
          <div class="center-cta"><a class="btn btn--outline" href="/shop">View all {families.length} products</a></div>
        </div>
      </section>

      {/* 8. customer stories */}
      <section class="section stories" aria-labelledby="stories-title">
        <div class="wrap">
          <SectionHead eyebrow="In their words" title="Customer stories" sub="Short video stories from people who use Vyra every week." />
          <div class="story-rail">
            {stories.map((s, i) => (
              <button type="button" class="story" data-video={s.drive} data-youtube={(s as any).youtube || ''} aria-label={`Play customer story ${i + 1}`}>
                <img src={s.img} alt="" width="190" height="338" loading="lazy" />
                <span class="story__play"><Icon n="play" fill /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 9. making video — hidden when makingVideo is empty */}
      {site.makingVideo && (
        <section class="section making" aria-labelledby="making-title">
          <div class="wrap making__grid">
            <div class="making__frame" id="making-frame">
              <img src={site.makingVideoPoster || '/static/img/p/mask-powder-2.webp'} alt="Hand-blending herbs in Mandamarri" width="640" height="400" loading="lazy" />
              <button type="button" class="making__play" data-play-making={site.makingVideo} aria-label="Play the making video"><Icon n="play" fill /></button>
            </div>
            <div>
              <div class="eyebrow">Behind the scenes</div>
              <h2 class="h2" style="margin:6px 0 18px">How Vyra is made</h2>
              <ol class="making__steps">
                <li><div><b>Sourcing herbs</b><span>Amla, bhringraj, rosemary, hibiscus and curry leaves, selected and dried.</span></div></li>
                <li><div><b>Slow infusion</b><span>Herbs are steeped into pure coconut oil, not rushed.</span></div></li>
                <li><div><b>Hand-blended batches</b><span>Small batches, mixed by hand in Mandamarri.</span></div></li>
                <li><div><b>Checked and packed</b><span>Quality-checked under ISO 9001:2015 and GMP, then shipped free.</span></div></li>
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* 10. certifications, promises, founder, journey */}
      <section class="section" aria-labelledby="certs-title">
        <div class="wrap">
          <SectionHead eyebrow="Trust" title="Certified and made with care" />
          <div class="certs__grid">
            {['iso', 'gmp', 'msme', 'sulphate-free'].map((c) => (<div class="cert"><img src={`/static/img/certs/${c}.webp`} alt={`${c.toUpperCase()} certification`} width="120" height="120" loading="lazy" /></div>))}
          </div>
          <ol class="promises">
            <li class="promise"><span class="promise__n">01</span><h3>100% natural</h3><p>Traditional herbs and pure coconut oil. No sulphates, parabens or harsh chemicals.</p></li>
            <li class="promise"><span class="promise__n">02</span><h3>Handmade in small batches</h3><p>Every bottle is blended by hand in Mandamarri, Telangana.</p></li>
            <li class="promise"><span class="promise__n">03</span><h3>Honest results</h3><p>Visible change takes steady use, around 8 weeks. We say so up front.</p></li>
            <li class="promise"><span class="promise__n">04</span><h3>Free shipping</h3><p>Delivered across India with trusted partners at no extra cost.</p></li>
          </ol>
        </div>
      </section>

      <section class="section founder" aria-labelledby="founder-title">
        <div class="wrap founder__grid">
          <div class="founder__photo"><img src="/static/img/brand/founder.webp" alt="Sahera Banu, founder of Vyra Herbals" width="420" height="460" loading="lazy" /></div>
          <div style="display:grid;gap:16px">
            <div class="eyebrow">Meet our founder</div>
            <blockquote class="founder__quote" style="margin:0">{'\u201C'}I decided to take matters into my own hands and started <em>experimenting with natural ingredients</em> at home.{'\u201D'}</blockquote>
            <p>Sahera Banu began by blending hair care in her own kitchen in Mandamarri and sharing it with friends. Those early bottles grew into Vyra Herbals, now trusted by more than 3000 happy customers.</p>
            <div class="founder__sig"><b>Sahera Banu</b><span>Founder, Vyra Herbals</span></div>
            <div class="eyebrow" style="margin-top:6px">Our journey</div>
            <ul class="journey">
              <li><b>The kitchen</b><span>First herbal blends made at home.</span></li>
              <li><b>Shared with friends</b><span>Word of mouth turns into repeat orders.</span></li>
              <li><b>Vyra Herbals</b><span>A small workshop in Mandamarri, Telangana.</span></li>
              <li><b>Certified</b><span>ISO 9001:2015 and GMP certification.</span></li>
              <li><b>Across India</b><span>Free shipping, plus Amazon, Flipkart and Meesho.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 11. customer testimonials */}
      <section class="section" aria-labelledby="testi-title">
        <div class="wrap">
          <SectionHead eyebrow="Kind words" title="Customer testimonials" more={{ href: '/reviews', label: 'Read all' }} />
          {site.testimonialShots.length > 0 && (
            <div class="tstack">
              {site.testimonialShots.map((s: string) => (<figure class="shot" data-zoom={s}><img src={s} alt="Customer testimonial screenshot" loading="lazy" /></figure>))}
            </div>
          )}
          <div class="tstack">
            {testimonials.slice(0, 10).map((t) => (
              <article class="tcard">
                <span class="rating"><Icon n="star" />{t.rating.toFixed(1)}</span>
                <p>{t.text}</p>
                <footer><span class="tcard__av">{t.name.charAt(0)}</span><span>{t.name}<small>Verified customer</small></span></footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 12. connect / marketplaces / journal / services */}
      <section class="section section--tight" aria-labelledby="connect-title">
        <div class="wrap">
          <SectionHead eyebrow="Stay in touch" title="Connect with Vyra" />
          <div class="connect">
            <a class="connect__card connect__card--ig" href={site.instagram} target="_blank" rel="noopener">
              <span class="connect__ico"><Icon n="insta" /></span>
              <span><b>Follow @vyraherbals</b><small>Join 3000+ happy souls on Instagram</small></span>
            </a>
            <a class="connect__card connect__card--wa" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">
              <span class="connect__ico"><Icon n="chat" /></span>
              <span><b>Chat on WhatsApp</b><small>Questions about hair care? Ask us.</small></span>
            </a>
          </div>
          <div class="eyebrow" style="margin-top:26px">Also available on</div>
          <div class="market">
            <a href="https://www.amazon.in/stores/VyraHerbals/page/C2261B34-C6F6-4EF1-ABD0-8686E06686E8?lp_asin=B0DLPCD26N" target="_blank" rel="noopener"><img src="/static/img/market/amazon.webp" alt="Amazon" loading="lazy" /></a>
            <a href="https://dl.flipkart.com/s/2nTQvdNNNN" target="_blank" rel="noopener"><img src="/static/img/market/flipkart.webp" alt="Flipkart" loading="lazy" /></a>
            <a href="https://www.meesho.com/VyraHerbals?_ms=3.0.1" target="_blank" rel="noopener"><img src="/static/img/market/meesho.webp" alt="Meesho" loading="lazy" /></a>
          </div>
        </div>
      </section>

      <section class="section section--tight" aria-labelledby="journal-title">
        <div class="wrap">
          <SectionHead eyebrow="Journal" title="Hair care, explained" more={{ href: '/blogs', label: 'All articles' }} />
          <div class="posts">
            {JOURNAL.map((p) => (
              <a class="post" href={p.u}><img src={p.img} alt="" width="320" height="240" loading="lazy" /><span><small>{p.tag}</small><b>{p.t}</b></span></a>
            ))}
          </div>
        </div>
      </section>

      <section class="section section--tight" aria-label="Our services">
        <div class="wrap services">
          <div class="service"><Icon n="truck" /><b>Door delivery</b><p>Free shipping across India.</p></div>
          <div class="service"><Icon n="tag" /><b>Affordable pricing</b><p>Directly from the maker.</p></div>
          <div class="service"><Icon n="headset" /><b>Quick support</b><p>Reach us on WhatsApp.</p></div>
          <div class="service"><Icon n="lock" /><b>Secure payments</b><p>100% secure via EaseBuzz.</p></div>
        </div>
      </section>
    </Layout>
  )
}
