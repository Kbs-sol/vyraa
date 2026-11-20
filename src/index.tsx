import { Hono } from 'hono'
import { Home } from './pages/home'
import { ProductPage, NotFound } from './pages/product'
import { Shop, CategoryPage, CategoriesPage, ConcernsPage, ConcernPage, Search, BestSellers, ReviewsPage, TrackOrder } from './pages/lists'
import { familyOfSlug, productBySlug, categoryBySlug, concernBySlug, site, type SortKey } from './lib/catalog'

const app = new Hono()

const sortOf = (v?: string): SortKey => (['best', 'price-asc', 'price-desc', 'rating'].includes(v || '') ? (v as SortKey) : 'featured')

app.get('/', (c) => c.html(<Home />))
app.get('/shop', (c) => c.html(<Shop sort={sortOf(c.req.query('sort'))} />))
app.get('/categories', (c) => c.html(<CategoriesPage />))
app.get('/concerns', (c) => c.html(<ConcernsPage />))
app.get('/category/:slug', (c) => {
  const cat = categoryBySlug(c.req.param('slug'))
  if (!cat) return c.html(<NotFound />, 404)
  return c.html(<CategoryPage c={cat} sort={sortOf(c.req.query('sort'))} />)
})
app.get('/concern/:slug', (c) => {
  const k = concernBySlug(c.req.param('slug'))
  if (!k) return c.html(<NotFound />, 404)
  return c.html(<ConcernPage c={k} sort={sortOf(c.req.query('sort'))} />)
})
app.get('/product/:slug', (c) => {
  const slug = c.req.param('slug')
  const prod = productBySlug(slug)
  const f = prod && familyOfSlug(prod.slug)
  if (!prod || !f) return c.html(<NotFound />, 404)
  const v = f.variants.find((x) => x.slug.toLowerCase() === prod.slug.toLowerCase())!
  return c.html(<ProductPage f={f} v={v} />)
})
app.get('/search', (c) => c.html(<Search q={(c.req.query('q') || c.req.query('searchtext') || '').trim().slice(0, 80)} />))
app.get('/best-sellers', (c) => c.html(<BestSellers tab={c.req.query('tab') === 'new' ? 'new' : 'best'} />))
app.get('/new-launches', (c) => c.redirect('/best-sellers?tab=new'))
app.get('/reviews', (c) => c.html(<ReviewsPage tab={c.req.query('tab') === 'ba' ? 'ba' : 'stories'} />))
app.get('/testimonials', (c) => c.redirect('/reviews'))
app.get('/track-order', (c) => c.html(<TrackOrder />))

/* Content pages that stay on the live site until integration */
for (const path of ['/about', '/blogs', '/blogs/:slug', '/faqs', '/contact', '/privacy-policy', '/terms-conditions']) {
  app.get(path, (c) => c.redirect(site.legacyBase + c.req.path, 302))
}

app.notFound((c) => c.html(<NotFound />, 404))
export default app
