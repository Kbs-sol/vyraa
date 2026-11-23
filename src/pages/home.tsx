import {
  Layout, Icon, Marquee, ProductCard, SectionHead, StoryCard, countIn,
} from '../components'
import {
  categories, concerns, bestSellers, families, beforeAfter, stories, testimonials, site,
} from '../lib/catalog'

const EMOJI: Record<string, string> = { 'hair-fall': '\u{1F33F}', 'hair-growth': '\u2728', dandruff: '\u2744\uFE0F', 'dry-damage': '\u{1F4A7}' }

const JOURNAL = [
  { img: '/static/img/blog/hair-oiling.webp', tag: 'Ritual', t: 'Hair oiling: how, when and how often', u: '/blogs/hair-oiling-how-when-how-often' },
  { img: '/static/img/blog/rosemary.webp', tag: 'Herbs', t: 'Rosemary leaves for hair growth: a powerful herb for scalp and hair health', u: '/blogs/rosemary-leaves-for-hair-growth-a-powerful-herb-for-scalp-hair-health' },
  { img: '/static/img/blog/scalp-massager.webp', tag: 'Tools', t: 'Scalp massager with silicone bristles: gentle care for a healthier scalp', u: '/blogs/scalp-massager-with-silicone-bristles-gentle-care-for-a-healthier-scalp' },
]

export const Home = () => {
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

      {/* 2. Hero: only the two before / after images (no product mention) */}
      <section class="hero-ba wrap" aria-labelledby="hero-title">
        <div class="hero-ba__head">
          <h1 class="hero-ba__title" id="hero-title">Truth in <em>every drop.</em></h1>
          <p class="hero-ba__sub">Real results from real Vyra customers.</p>
        </div>
        <div class="hero-ba__pair">
          <figure class="hero-ba__panel" data-zoom="/static/img/ba/hero-ba-1.jpeg">
            <img src="/static/img/ba/hero-ba-1.jpeg" alt="Customer hair before using Vyra herbal hair care" width="460" height="460" loading="eager" fetchpriority="high" />
            <figcaption class="proof-pill proof-pill--before">BEFORE</figcaption>
          </figure>
          <figure class="hero-ba__panel" data-zoom="/static/img/ba/hero-ba-2.jpeg">
            <img src="/static/img/ba/hero-ba-2.jpeg" alt="Same customer's hair after consistent use of Vyra herbal hair care" width="460" height="460" loading="eager" />
            <figcaption class="proof-pill proof-pill--after">AFTER</figcaption>
          </figure>
        </div>
        <p class="hero-ba__note">Real customer photos. Results vary with hair type and consistent use over 8 weeks or more.</p>
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
            {stories.map((s, i) => <StoryCard s={s} i={i} />)}
          </div>
          <p class="stories__more"><a class="link-more" href="/reviews?tab=videos">Watch all customer videos <Icon n="arrow" /></a></p>
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
