export interface Product {
  id: string
  collection: string
  category: string
  priceEur: number
  priceDisplay: string
  images: string[]
  materials: string[]
  stock: number
  weight: string
}

// ── Image pool ──────────────────────────────────────────────────────────────
const imagePool = [
  'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/{size}?1771499425',
  'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/{size}?1771500213',
  'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/{size}?1771427526',
  'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/{size}?1771514251',
  'https://cdnx.jumpseller.com/cahico/image/74201642/thumb/{size}?1772729926',
  'https://cdnx.jumpseller.com/cahico/image/74201707/thumb/{size}?1772730169',
  'https://cdnx.jumpseller.com/cahico/image/74201663/thumb/{size}?1772729987',
  'https://cdnx.jumpseller.com/cahico/image/74305850/thumb/{size}?1772902538',
  'https://cdnx.jumpseller.com/cahico/image/73511629/thumb/{size}?1772565002',
  'https://cdnx.jumpseller.com/cahico/image/74305962/thumb/{size}?1772902991',
]

function makeImages(index: number): string[] {
  const tpl = imagePool[index % imagePool.length]!
  return [
    tpl.replace('{size}', '299/399'),
    tpl.replace('{size}', '540/720'),
    tpl.replace('{size}', '180/240'),
  ]
}

// ── Per-category specs ──────────────────────────────────────────────────────
interface CategorySpec {
  target: number
  priceRange: [number, number]
  materials: string[][]
  weightRange: [number, number]
  weightUnit: string
}

const categorySpecs: Record<string, CategorySpec> = {
  rings: {
    target: 24,
    priceRange: [280, 2400],
    materials: [
      ['18k Gold', 'Diamond'],
      ['Sterling Silver', 'Onyx'],
      ['14k Gold', 'Sapphire'],
      ['18k Rose Gold'],
      ['Sterling Silver', 'Garnet'],
      ['Platinum', 'Ruby'],
      ['18k Gold', 'Emerald'],
      ['14k Gold'],
    ],
    weightRange: [3, 8],
    weightUnit: 'g',
  },
  necklaces: {
    target: 18,
    priceRange: [420, 2800],
    materials: [
      ['Sterling Silver', 'Pearl'],
      ['18k Gold', 'Emerald'],
      ['14k Gold', 'Amethyst'],
      ['18k Rose Gold', 'Morganite'],
      ['Sterling Silver', 'Topaz'],
      ['18k Gold', 'Diamond'],
    ],
    weightRange: [6, 18],
    weightUnit: 'g',
  },
  earrings: {
    target: 31,
    priceRange: [180, 1600],
    materials: [
      ['14k Gold', 'Topaz'],
      ['Sterling Silver', 'Pearl'],
      ['18k Gold', 'Ruby'],
      ['14k Rose Gold', 'Garnet'],
      ['Sterling Silver', 'Amethyst'],
      ['18k Gold', 'Sapphire'],
      ['14k Gold', 'Citrine'],
    ],
    weightRange: [2, 6],
    weightUnit: 'g',
  },
  bracelets: {
    target: 15,
    priceRange: [320, 2200],
    materials: [
      ['18k Rose Gold'],
      ['Sterling Silver', 'Turquoise'],
      ['18k Gold', 'Diamond'],
      ['14k Gold', 'Pearl'],
      ['Sterling Silver', 'Onyx'],
    ],
    weightRange: [8, 18],
    weightUnit: 'g',
  },
  anklets: {
    target: 8,
    priceRange: [180, 680],
    materials: [
      ['Sterling Silver'],
      ['14k Gold'],
      ['Sterling Silver', 'Turquoise'],
      ['14k Rose Gold'],
    ],
    weightRange: [3, 7],
    weightUnit: 'g',
  },
  brooches: {
    target: 12,
    priceRange: [240, 1200],
    materials: [
      ['Sterling Silver', 'Enamel'],
      ['18k Gold', 'Ruby'],
      ['14k Gold', 'Pearl'],
      ['Sterling Silver', 'Garnet'],
    ],
    weightRange: [4, 12],
    weightUnit: 'g',
  },
  pendants: {
    target: 20,
    priceRange: [260, 1800],
    materials: [
      ['18k Gold', 'Sapphire'],
      ['Sterling Silver', 'Moonstone'],
      ['14k Gold', 'Opal'],
      ['18k Rose Gold', 'Morganite'],
      ['Sterling Silver', 'Amethyst'],
      ['18k Gold', 'Emerald'],
    ],
    weightRange: [3, 10],
    weightUnit: 'g',
  },
  cufflinks: {
    target: 9,
    priceRange: [220, 980],
    materials: [
      ['Sterling Silver', 'Onyx'],
      ['18k Gold'],
      ['Sterling Silver', 'Mother of Pearl'],
      ['14k Gold', 'Lapis Lazuli'],
    ],
    weightRange: [6, 14],
    weightUnit: 'g',
  },
}

const collections = ['alfama', 'chiado', 'santos', 'canastras', 'belem', 'sintra', 'cascais', 'mouraria']
const categories = Object.keys(categorySpecs)

// ── Original 6 featured products ────────────────────────────────────────────
const featuredProducts: Product[] = [
  {
    id: 'alfama-ring',
    collection: 'alfama',
    category: 'rings',
    priceEur: 1240,
    priceDisplay: '€1,240',
    images: [
      'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/299/399?1771499425',
      'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/540/720?1771499425',
      'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/180/240?1771499425',
    ],
    materials: ['18k Gold', 'Diamond'],
    stock: 3,
    weight: '4.2g',
  },
  {
    id: 'alfama-necklace',
    collection: 'alfama',
    category: 'necklaces',
    priceEur: 680,
    priceDisplay: '€680',
    images: [
      'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/299/399?1771500213',
      'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/540/720?1771500213',
      'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/180/240?1771500213',
    ],
    materials: ['Sterling Silver', 'Pearl'],
    stock: 5,
    weight: '8.6g',
  },
  {
    id: 'alfama-bracelet',
    collection: 'alfama',
    category: 'bracelets',
    priceEur: 920,
    priceDisplay: '€920',
    images: [
      'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/299/399?1771514251',
      'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/540/720?1771514251',
      'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/180/240?1771514251',
    ],
    materials: ['18k Rose Gold'],
    stock: 2,
    weight: '12.1g',
  },
  {
    id: 'alfama-earrings',
    collection: 'alfama',
    category: 'earrings',
    priceEur: 540,
    priceDisplay: '€540',
    images: [
      'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/299/399?1771427526',
      'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/540/720?1771427526',
      'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/180/240?1771427526',
    ],
    materials: ['14k Gold', 'Topaz'],
    stock: 7,
    weight: '3.4g',
  },
  {
    id: 'chiado-ring',
    collection: 'chiado',
    category: 'rings',
    priceEur: 380,
    priceDisplay: '€380',
    images: [
      'https://cdnx.jumpseller.com/cahico/image/74201642/thumb/299/399?1772729926',
      'https://cdnx.jumpseller.com/cahico/image/74201642/thumb/540/720?1772729926',
      'https://cdnx.jumpseller.com/cahico/image/74201642/thumb/180/240?1772729926',
    ],
    materials: ['Sterling Silver', 'Onyx'],
    stock: 0,
    weight: '5.8g',
  },
  {
    id: 'chiado-necklace',
    collection: 'chiado',
    category: 'necklaces',
    priceEur: 1580,
    priceDisplay: '€1,580',
    images: [
      'https://cdnx.jumpseller.com/cahico/image/74201707/thumb/299/399?1772730169',
      'https://cdnx.jumpseller.com/cahico/image/74201707/thumb/540/720?1772730169',
      'https://cdnx.jumpseller.com/cahico/image/74201707/thumb/180/240?1772730169',
    ],
    materials: ['18k Gold', 'Emerald'],
    stock: 1,
    weight: '15.3g',
  },
]

const featuredIds = new Set(featuredProducts.map((p) => p.id))

// ── Deterministic generator ─────────────────────────────────────────────────
function formatPrice(eur: number): string {
  return '€' + eur.toLocaleString('en-IE')
}

function generateProducts(): Product[] {
  const generated: Product[] = []

  for (const cat of categories) {
    const spec = categorySpecs[cat]!
    let count = 0
    // First count how many featured products exist for this category
    const featuredInCat = featuredProducts.filter((p) => p.category === cat).length
    const needed = spec.target - featuredInCat

    let globalIdx = 0
    for (const col of collections) {
      if (count >= needed) break

      // How many items from this collection for this category
      const remaining = needed - count
      const remainingCols = collections.length - collections.indexOf(col)
      const batch = Math.min(Math.ceil(remaining / remainingCols), remaining)

      for (let i = 0; i < batch; i++) {
        const id = `${col}-${cat}-${i + 1}`
        if (featuredIds.has(id)) continue

        const seed = globalIdx
        const matIdx = seed % spec.materials.length
        const priceFraction = ((seed * 7 + 3) % 11) / 10
        const price = Math.round(
          (spec.priceRange[0] + (spec.priceRange[1] - spec.priceRange[0]) * priceFraction) / 10,
        ) * 10
        const weightFraction = ((seed * 13 + 5) % 9) / 8
        const weight = (
          spec.weightRange[0] +
          (spec.weightRange[1] - spec.weightRange[0]) * weightFraction
        ).toFixed(1)
        const stock = ((seed * 3 + 2) % 10)

        generated.push({
          id,
          collection: col,
          category: cat,
          priceEur: price,
          priceDisplay: formatPrice(price),
          images: makeImages(seed),
          materials: spec.materials[matIdx]!,
          stock,
          weight: `${weight}${spec.weightUnit}`,
        })

        count++
        globalIdx++
      }
    }
  }

  return generated
}

const products: Product[] = [...featuredProducts, ...generateProducts()]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getRelatedProducts(id: string): Product[] {
  const product = getProductById(id)
  if (!product) return []
  return products
    .filter((p) => p.id !== id && (p.collection === product.collection || p.category === product.category))
    .slice(0, 3)
}

export function getAllProducts(): Product[] {
  return products
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getProductsByCollection(collection: string): Product[] {
  return products.filter((p) => p.collection === collection)
}
