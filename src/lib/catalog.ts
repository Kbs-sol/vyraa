import productsJson from '../data/products.json'
import reviewsJson from '../data/reviews.json'
import testimonialsJson from '../data/testimonials.json'
import baJson from '../data/before_after.json'
import storiesJson from '../data/stories.json'
import siteJson from '../data/site.json'

export type Product = {
  id: number | null
  slug: string
  name: string
  sku: string
  category: string
  price: number
  mrp: number | null
  desc: string
  images: string[]
  benefits: string[]
  ingredients: string[]
  directions: string[]
  note: string
  orders30: number
  featuredOrder: number
}
export type Review = { slug: string; name: string; rating: number; text: string; date: string }
export type Testimonial = { name: string; rating: number; text: string }

export const site = siteJson
export const products = productsJson as unknown as Product[]
export const reviews = reviewsJson as unknown as Review[]
export const testimonials = testimonialsJson as unknown as Testimonial[]
export const beforeAfter = baJson as string[]
export const stories = storiesJson as { img: string; drive: string }[]

const bySlugMap = new Map(products.map((p) => [p.slug.toLowerCase(), p]))
export const productBySlug = (s: string) => bySlugMap.get(s.toLowerCase())

/* ------------------------------------------------------------------ */
/* Categories (derived from analysing all 29 live SKUs)                */
/* ------------------------------------------------------------------ */
export type Category = { slug: string; name: string; blurb: string; image: string; legacy?: string[] }
export const categories: Category[] = [
  { slug: 'hair-oil', name: 'Hair Oil', blurb: 'Slow-infused with nine botanicals, from 100 ml to 500 ml.', image: '/static/img/p/vyra-oil-100-1.webp', legacy: ['hair-oil'] },
  { slug: 'shampoo', name: 'Shampoo', blurb: 'Sulphate-free and paraben-free herbal cleansing.', image: '/static/img/p/vyra-shampoo-200-1.webp', legacy: ['shampoo'] },
  { slug: 'combos', name: 'Combos', blurb: 'Oil and shampoo, paired in the size you need.', image: '/static/img/p/vyra-200-oil-200-shampoo-combo-1.webp' },
  { slug: 'kits', name: 'Kits', blurb: 'Complete routines for growth, scalp care and everyday hair.', image: '/static/img/p/vyra-healthy-hair-kit-1.webp' },
  { slug: 'herbs-masks', name: 'Masks & Herbs', blurb: 'Hair mask powder and dried rosemary leaves.', image: '/static/img/p/mask-powder-1.webp', legacy: ['herbal-hair-mask-powder', 'rosemary-leaves'] },
  { slug: 'combs-tools', name: 'Combs & Tools', blurb: 'Neem wood combs and a silicone scalp massager.', image: '/static/img/p/neem-full-half-1.webp', legacy: ['neem-combs', 'scalp-massager'] },
]
export const categoryBySlug = (s: string) => {
  const l = s.toLowerCase()
  return categories.find((c) => c.slug === l) || categories.find((c) => c.legacy?.includes(l))
}

/* ------------------------------------------------------------------ */
/* Concerns                                                            */
/* ------------------------------------------------------------------ */
export type Concern = { slug: string; name: string; short: string; lines: [string, string]; image: string; intro: string; tip: string; families: string[] }
export const concerns: Concern[] = [
  {
    slug: 'hair-fall',
    name: 'Hair Loss',
    short: 'Hair Loss',
    lines: ['Hair', 'Loss'],
    image: '/static/img/concern/hair-loss.webp',
    intro: 'Strengthen weak roots with a herbal oil routine built around rosemary, bhringraj, amla and curry leaves.',
    tip: 'Warm the oil, massage into the scalp for 5 to 10 minutes, leave for 2 hours or overnight, then wash with a sulphate-free shampoo. Two to three times a week.',
    families: ['hair-oil', 'oil-shampoo-combo', 'healthy-hair-kit', 'hair-growth-kit', 'rosemary', 'all-in-one-kit', 'hair-care-kit'],
  },
  {
    slug: 'hair-growth',
    name: 'Hair Growth',
    short: 'Hair Growth',
    lines: ['Hair', 'Growth'],
    image: '/static/img/concern/hair-growth.webp',
    intro: 'Support visible thickness with scalp circulation, rosemary and gentle, consistent care.',
    tip: 'Hair grows about 1.25 cm a month. Oil massage improves scalp circulation. Expect visible thickness in 3 to 4 months of steady use.',
    families: ['hair-growth-kit', 'rosemary', 'hair-oil', 'scalp-massager', 'all-in-one-kit', 'oil-shampoo-combo', 'mask-powder'],
  },
  {
    slug: 'dandruff',
    name: 'Dandruff',
    short: 'Dandruff',
    lines: ['Dandruff', ''],
    image: '/static/img/concern/dandruff.webp',
    intro: 'Clean without stripping. A neem-based, sulphate-free shampoo with a scalp-balancing herbal oil.',
    tip: 'Twice a week: warm oil, massage for 5 minutes, leave 30 to 60 minutes, then wash with the herbal shampoo. Use a scalp massager to lift flakes.',
    families: ['shampoo', 'scalp-care-kit', 'shampoo-massager-combo', 'neem-combs', 'scalp-massager', 'hair-care-kit', 'oil-shampoo-combo'],
  },
  {
    slug: 'dry-damage',
    name: 'Dry & Damage',
    short: 'Dry & Damage',
    lines: ['Dry &', 'Damage'],
    image: '/static/img/concern/dry-damage.webp',
    intro: 'Moisture and slip for dry, frizzy or breakage-prone hair: herbal oil, a conditioning hair mask and a gentle wash.',
    tip: 'Oil the lengths before a wash, use the mask powder once a week mixed with water or curd, and detangle with a wide-tooth neem comb.',
    families: ['mask-powder', 'hair-oil', 'healthy-hair-kit', 'shampoo', 'hair-care-kit', 'all-in-one-kit', 'neem-combs'],
  },
]
export const concernBySlug = (s: string) => {
  const l = s.toLowerCase()
  const alias: Record<string, string> = { 'hair-loss': 'hair-fall', 'scalp-care': 'dandruff', 'dry-and-damage': 'dry-damage' }
  const k = alias[l] || l
  return concerns.find((c) => c.slug === k)
}

/* ------------------------------------------------------------------ */
/* Families: 29 SKUs grouped into 13 shoppable products with variants   */
/* ------------------------------------------------------------------ */
export type Axis = { key: string; label: string; values: string[] }
export type VariantDef = { slug: string; attrs: Record<string, string>; note?: string }
export type FamilyDef = {
  id: string
  title: string
  category: string
  tagline: string
  axes: Axis[]
  variants: VariantDef[]
  defaultSlug: string
  isNew?: boolean
  keywords?: string
}

const SIZE = (values: string[]): Axis => ({ key: 'size', label: 'Size', values })
const PACK = (values: string[]): Axis => ({ key: 'pack', label: 'Pack', values })

export const familyDefs: FamilyDef[] = [
  {
    id: 'hair-oil', title: 'Herbal Hair Oil', category: 'hair-oil', tagline: 'Slow-infused with nine botanicals', defaultSlug: 'VYRA-OIL-100',
    axes: [SIZE(['100 ml', '200 ml', '500 ml']), PACK(['Single', 'Value pack'])],
    variants: [
      { slug: 'VYRA-OIL-100', attrs: { size: '100 ml', pack: 'Single' } },
      { slug: 'VYRA-OIL-100-COMBO', attrs: { size: '100 ml', pack: 'Value pack' }, note: 'Pack of 3 bottles' },
      { slug: 'VYRA-OIL-200', attrs: { size: '200 ml', pack: 'Single' } },
      { slug: 'VYRA-OIL-200-COMBO', attrs: { size: '200 ml', pack: 'Value pack' }, note: 'Pack of 2 bottles' },
      { slug: 'hVYRA-OIL-500', attrs: { size: '500 ml', pack: 'Single' }, note: 'Family size' },
    ],
    keywords: 'oil hair oil rosemary bhringraj amla coconut',
  },
  {
    id: 'shampoo', title: 'Herbal Shampoo', category: 'shampoo', tagline: 'Sulphate and paraben free', defaultSlug: 'VYRA-SHAMPOO-200',
    axes: [SIZE(['200 ml', '500 ml']), PACK(['Single', 'Value pack'])],
    variants: [
      { slug: 'VYRA-SHAMPOO-200', attrs: { size: '200 ml', pack: 'Single' } },
      { slug: 'VYRA-SHAMPOO-200-COMBO', attrs: { size: '200 ml', pack: 'Value pack' }, note: 'Pack of 2 bottles' },
      { slug: 'VYRA-SHAMPOO-500', attrs: { size: '500 ml', pack: 'Single' }, note: 'Family size' },
    ],
    keywords: 'shampoo sulphate free paraben free dandruff',
  },
  {
    id: 'oil-shampoo-combo', title: 'Oil + Shampoo Combo', category: 'combos', tagline: 'Oil before the wash, shampoo after', defaultSlug: 'VYRA-100-OIL-200-SHAMPOO-COMBO',
    axes: [
      { key: 'oil', label: 'Hair oil', values: ['100 ml', '200 ml', '500 ml'] },
      { key: 'shampoo', label: 'Shampoo', values: ['200 ml', '500 ml'] },
    ],
    variants: [
      { slug: 'VYRA-100-OIL-200-SHAMPOO-COMBO', attrs: { oil: '100 ml', shampoo: '200 ml' } },
      { slug: 'VYRA-100-OIL-500-SHAMPOO-COMBO', attrs: { oil: '100 ml', shampoo: '500 ml' } },
      { slug: 'VYRA-200-OIL-200-SHAMPOO-COMBO', attrs: { oil: '200 ml', shampoo: '200 ml' } },
      { slug: 'VYRA-200-OIL-500-SHAMPOO-COMBO', attrs: { oil: '200 ml', shampoo: '500 ml' } },
      { slug: 'VYRA-500-OIL-200-SHAMPOO-COMBO', attrs: { oil: '500 ml', shampoo: '200 ml' } },
      { slug: 'VYRA-500-OIL-500-SHAMPOO-COMBO', attrs: { oil: '500 ml', shampoo: '500 ml' } },
    ],
    keywords: 'combo oil shampoo bundle',
  },
  {
    id: 'shampoo-massager-combo', title: 'Shampoo + Scalp Massager', category: 'combos', tagline: 'Deep-cleanse the scalp while you wash', defaultSlug: 'VYRA-200-SHAMPOO-MASSAGER-COMBO',
    axes: [], variants: [{ slug: 'VYRA-200-SHAMPOO-MASSAGER-COMBO', attrs: {} }],
    keywords: 'combo shampoo massager scalp',
  },
  {
    id: 'hair-care-kit', title: 'Hair Care Kit', category: 'kits', tagline: 'Oil, shampoo and two neem combs', defaultSlug: 'vyra-complete-hair-care-kit',
    axes: [SIZE(['Mini', 'Complete'])],
    variants: [
      { slug: 'vyra-mini-hair-care-kit', attrs: { size: 'Mini' }, note: '100 ml oil' },
      { slug: 'vyra-complete-hair-care-kit', attrs: { size: 'Complete' }, note: '200 ml oil' },
    ],
    keywords: 'kit hair care starter gift',
  },
  {
    id: 'scalp-care-kit', title: 'Scalp Care Kit', category: 'kits', tagline: 'Oil, shampoo, combs and massager', defaultSlug: 'vyra-complete-scalp-care-kit',
    axes: [SIZE(['Mini', 'Complete'])],
    variants: [
      { slug: 'vyra-mini-scalp-care-kit', attrs: { size: 'Mini' }, note: '100 ml oil' },
      { slug: 'vyra-complete-scalp-care-kit', attrs: { size: 'Complete' }, note: '200 ml oil' },
    ],
    keywords: 'kit scalp care massager dandruff',
  },
  {
    id: 'hair-growth-kit', title: 'Hair Growth Kit', category: 'kits', tagline: 'Oil, shampoo, mask powder and rosemary', defaultSlug: 'vyra-hair-growth-kit',
    axes: [SIZE(['Mini', 'Complete'])],
    variants: [
      { slug: 'vyra-hair-growth-kit', attrs: { size: 'Mini' }, note: '100 ml oil' },
      { slug: 'vyra-intensive-hair-growth-kit', attrs: { size: 'Complete' }, note: '200 ml oil' },
    ],
    keywords: 'kit hair growth rosemary mask',
  },
  {
    id: 'all-in-one-kit', title: 'All-in-One Hair Growth Kit', category: 'kits', tagline: 'Everything Vyra makes, in one box', defaultSlug: 'vyra-all-in-one-hair-growth-kit',
    axes: [], variants: [{ slug: 'vyra-all-in-one-hair-growth-kit', attrs: {} }],
    keywords: 'kit all in one complete hair growth',
  },
  {
    id: 'healthy-hair-kit', title: 'Healthy Hair Kit', category: 'kits', tagline: 'A complete three-step herbal routine', defaultSlug: 'vyra-healthy-hair-kit', isNew: true,
    axes: [], variants: [{ slug: 'vyra-healthy-hair-kit', attrs: {} }],
    keywords: 'kit healthy hair oil shampoo mask',
  },
  {
    id: 'mask-powder', title: 'Herbal Hair Mask Powder', category: 'herbs-masks', tagline: 'Nine herbs, ground fresh', defaultSlug: 'MASK-POWDER', isNew: true,
    axes: [], variants: [{ slug: 'MASK-POWDER', attrs: {} }],
    keywords: 'mask powder amla shikakai bhringraj hibiscus methi conditioning',
  },
  {
    id: 'rosemary', title: 'Dried Rosemary Leaves', category: 'herbs-masks', tagline: 'For rinses and oil infusions', defaultSlug: 'ROSEMARY-LEAVES', isNew: true,
    axes: [], variants: [{ slug: 'ROSEMARY-LEAVES', attrs: {} }],
    keywords: 'rosemary leaves herb growth rinse',
  },
  {
    id: 'neem-combs', title: 'Neem Wood Comb', category: 'combs-tools', tagline: 'Handcrafted, anti-static, scalp-friendly', defaultSlug: 'NEEM-FULL',
    axes: [{ key: 'type', label: 'Style', values: ['Half comb', 'Full comb', 'Pack of 2'] }],
    variants: [
      { slug: 'NEEM-HALF', attrs: { type: 'Half comb' }, note: 'Compact, wide-tooth' },
      { slug: 'NEEM-FULL', attrs: { type: 'Full comb' }, note: 'Wide and fine teeth' },
      { slug: 'NEEM-FULL-HALF', attrs: { type: 'Pack of 2' }, note: '1 half + 1 full comb' },
    ],
    keywords: 'neem comb wood wooden',
  },
  {
    id: 'scalp-massager', title: 'Silicone Scalp Massager', category: 'combs-tools', tagline: 'Circulation, exfoliation, calm', defaultSlug: 'MASSAGER', isNew: true,
    axes: [], variants: [{ slug: 'MASSAGER', attrs: {} }],
    keywords: 'scalp massager silicone brush',
  },
]

/* ------------------------------------------------------------------ */
/* Resolved families                                                   */
/* ------------------------------------------------------------------ */
export type Variant = VariantDef & { product: Product }
export type Family = Omit<FamilyDef, 'variants'> & {
  variants: Variant[]
  def: Variant
  minPrice: number
  orders30: number
  rating: number
  reviewCount: number
  cover: string
}

const reviewsBySlug = new Map<string, Review[]>()
for (const r of reviews) {
  const k = r.slug.toLowerCase()
  if (!reviewsBySlug.has(k)) reviewsBySlug.set(k, [])
  reviewsBySlug.get(k)!.push(r)
}

export const families: Family[] = familyDefs.map((d) => {
  const variants: Variant[] = d.variants.map((v) => {
    const product = productBySlug(v.slug)
    if (!product) throw new Error('Missing product for ' + v.slug)
    return { ...v, product }
  })
  const def = variants.find((v) => v.slug === d.defaultSlug) || variants[0]
  const rs = variants.flatMap((v) => reviewsBySlug.get(v.slug.toLowerCase()) || [])
  return {
    ...d,
    variants,
    def,
    minPrice: Math.min(...variants.map((v) => v.product.price)),
    orders30: variants.reduce((a, v) => a + (v.product.orders30 || 0), 0),
    rating: rs.length ? Math.round((rs.reduce((a, r) => a + r.rating, 0) / rs.length) * 10) / 10 : 0,
    reviewCount: rs.length,
    cover: def.product.images[0],
  }
})

export const familyById = (id: string) => families.find((f) => f.id === id)
const sku2fam = new Map<string, Family>()
for (const f of families) for (const v of f.variants) sku2fam.set(v.slug.toLowerCase(), f)
export const familyOfSlug = (slug: string) => sku2fam.get(slug.toLowerCase())
export const reviewsForFamily = (f: Family) => f.variants.flatMap((v) => reviewsBySlug.get(v.slug.toLowerCase()) || [])

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
export const inr = (n: number) => {
  const s = String(Math.round(n))
  if (s.length <= 3) return '\u20B9' + s
  return '\u20B9' + s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3)
}
export const off = (p: Product) => (p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0)

/** Short label for a variant, used on pills and in the cart. */
export const variantLabel = (f: Family, v: Variant) => {
  const parts = f.axes.map((a) => v.attrs[a.key]).filter(Boolean)
  return parts.join(' \u00B7 ')
}

/** "Includes: ..." list parsed from kit / combo descriptions. */
export const includesOf = (p: Product): string[] => {
  const m = p.desc.match(/Includes:\s*(.*?)\.(\s|$)/)
  if (!m) return []
  return m[1].split(/,\s*(?:and\s+)?|\s+and\s+/).map((s) => s.trim()).filter(Boolean)
}

export const bestSellers = () => [...families].sort((a, b) => b.orders30 - a.orders30)
export const newLaunches = () => families.filter((f) => f.isNew)

export type SortKey = 'featured' | 'best' | 'price-asc' | 'price-desc' | 'rating'
export const sortFamilies = (list: Family[], sort: SortKey) => {
  const l = [...list]
  if (sort === 'best') l.sort((a, b) => b.orders30 - a.orders30)
  else if (sort === 'price-asc') l.sort((a, b) => a.minPrice - b.minPrice)
  else if (sort === 'price-desc') l.sort((a, b) => b.minPrice - a.minPrice)
  else if (sort === 'rating') l.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
  return l
}

export const searchFamilies = (q: string) => {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return families
  return families.filter((f) => {
    const hay = (f.title + ' ' + f.tagline + ' ' + (f.keywords || '') + ' ' + f.variants.map((v) => v.product.name + ' ' + v.product.desc).join(' ')).toLowerCase()
    return terms.every((t) => hay.includes(t))
  })
}

/** Compact catalog shipped to the browser for cart, search and variant switching. */
export const clientCatalog = () => ({
  items: Object.fromEntries(
    families.flatMap((f) =>
      f.variants.map((v) => [
        v.slug,
        { n: v.product.name, p: v.product.price, m: v.product.mrp || v.product.price, i: v.product.images[0], u: '/product/' + v.slug, f: f.id, l: variantLabel(f, v) },
      ]),
    ),
  ),
  families: families.map((f) => ({ id: f.id, t: f.title, tag: f.tagline, c: f.category, s: f.def.slug, k: f.keywords || '', p: f.minPrice, i: f.cover })),
})

/** Pills shown directly on a product card (single-axis families, or the "Single" pack of size x pack families). */
export const cardVariants = (f: Family): Variant[] => {
  if (f.variants.length < 2) return []
  if (f.axes.length === 1) return f.variants
  if (f.axes.length === 2 && f.axes[1].key === 'pack') return f.variants.filter((v) => v.attrs.pack === 'Single')
  return []
}
export const pillText = (f: Family, v: Variant) => (f.axes[0] ? v.attrs[f.axes[0].key] : '')

/** Clean the scraped "note" blob into separate lines. */
export const noteLines = (p: Product): string[] =>
  p.note
    .split(/[\u25CF\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)

export const rankBadge = (f: Family): string => {
  const top = bestSellers().slice(0, 4).map((x) => x.id)
  if (f.isNew) return 'New'
  if (top.includes(f.id)) return 'Best seller'
  const d = off(f.def.product)
  return d >= 50 ? d + '% off' : ''
}
export const productsIn = (cat: string) => families.filter((f) => f.category === cat)

/* ------------------------------------------------------------------ */
/* Variant selector modes (pills vs. combo dropdown)                    */
/* ------------------------------------------------------------------ */
export type CardMode = 'pills' | 'select' | 'choose' | 'single'
/** Two independent size axes (e.g. oil x shampoo) are shown as one dropdown, like "100 / 200 ml". */
export const isComboFamily = (f: Family) => f.axes.length === 2 && f.axes[1].key !== 'pack'
export const cardMode = (f: Family): CardMode => {
  if (f.variants.length < 2) return 'single'
  if (isComboFamily(f)) return 'select'
  return cardVariants(f).length ? 'pills' : 'choose'
}
const mlNum = (s: string) => s.replace(/\s*ml$/i, '')
/** "100 / 200 ml" for combos, otherwise the plain axis value. */
export const optionText = (f: Family, v: Variant) =>
  isComboFamily(f) ? `${mlNum(v.attrs[f.axes[0].key])} / ${mlNum(v.attrs[f.axes[1].key])} ml` : variantLabel(f, v)
export const selectLabel = (f: Family) => (isComboFamily(f) ? f.axes.map((a) => a.label.replace('Hair oil', 'Oil')).join(' / ') + ' sizes' : 'Options')
/** Small grey line beside the price: "100 ml" or "100 ml oil + 200 ml shampoo". */
export const sizeLine = (f: Family, v: Variant) => {
  if (isComboFamily(f)) return `${v.attrs[f.axes[0].key]} ${f.axes[0].key} + ${v.attrs[f.axes[1].key]} ${f.axes[1].key}`
  return f.axes[0] ? v.attrs[f.axes[0].key] || '' : ''
}
export const eyebrowOf = (f: Family) =>
  ({
    'hair-oil': 'Pre-wash oil', shampoo: 'Shampoo', 'oil-shampoo-combo': 'Hair oil and shampoo', 'shampoo-massager-combo': 'Shampoo and tool',
    'hair-care-kit': 'Kit', 'scalp-care-kit': 'Kit', 'hair-growth-kit': 'Kit', 'all-in-one-kit': 'All-in-one kit', 'healthy-hair-kit': 'Three-step kit',
    'mask-powder': 'Weekly mask', rosemary: 'Herb', 'neem-combs': 'Wooden comb', 'scalp-massager': 'Tool',
  } as Record<string, string>)[f.id] || ''
