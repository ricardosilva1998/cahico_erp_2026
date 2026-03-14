/**
 * Product data for OG meta injection (server-side).
 * Ported from netlify/edge-functions/product-data.ts
 */

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

function makeImage(index) {
  const tpl = imagePool[index % imagePool.length]
  return tpl.replace('{size}', '540/720')
}

const categorySpecs = {
  rings: { target: 24, priceRange: [280, 2400], materials: [['18k Gold', 'Diamond'], ['Sterling Silver', 'Onyx'], ['14k Gold', 'Sapphire'], ['18k Rose Gold'], ['Sterling Silver', 'Garnet'], ['Platinum', 'Ruby'], ['18k Gold', 'Emerald'], ['14k Gold']] },
  necklaces: { target: 18, priceRange: [420, 2800], materials: [['Sterling Silver', 'Pearl'], ['18k Gold', 'Emerald'], ['14k Gold', 'Amethyst'], ['18k Rose Gold', 'Morganite'], ['Sterling Silver', 'Topaz'], ['18k Gold', 'Diamond']] },
  earrings: { target: 31, priceRange: [180, 1600], materials: [['14k Gold', 'Topaz'], ['Sterling Silver', 'Pearl'], ['18k Gold', 'Ruby'], ['14k Rose Gold', 'Garnet'], ['Sterling Silver', 'Amethyst'], ['18k Gold', 'Sapphire'], ['14k Gold', 'Citrine']] },
  bracelets: { target: 15, priceRange: [320, 2200], materials: [['18k Rose Gold'], ['Sterling Silver', 'Turquoise'], ['18k Gold', 'Diamond'], ['14k Gold', 'Pearl'], ['Sterling Silver', 'Onyx']] },
  anklets: { target: 8, priceRange: [180, 680], materials: [['Sterling Silver'], ['14k Gold'], ['Sterling Silver', 'Turquoise'], ['14k Rose Gold']] },
  brooches: { target: 12, priceRange: [240, 1200], materials: [['Sterling Silver', 'Enamel'], ['18k Gold', 'Ruby'], ['14k Gold', 'Pearl'], ['Sterling Silver', 'Garnet']] },
  pendants: { target: 20, priceRange: [260, 1800], materials: [['18k Gold', 'Sapphire'], ['Sterling Silver', 'Moonstone'], ['14k Gold', 'Opal'], ['18k Rose Gold', 'Morganite'], ['Sterling Silver', 'Amethyst'], ['18k Gold', 'Emerald']] },
  cufflinks: { target: 9, priceRange: [220, 980], materials: [['Sterling Silver', 'Onyx'], ['18k Gold'], ['Sterling Silver', 'Mother of Pearl'], ['14k Gold', 'Lapis Lazuli']] },
}

const collections = ['alfama', 'chiado', 'santos', 'canastras', 'belem', 'sintra', 'cascais', 'mouraria']
const categories = Object.keys(categorySpecs)

const categoryNouns = {
  rings: 'Ring', necklaces: 'Necklace', earrings: 'Earrings', bracelets: 'Bracelet',
  anklets: 'Anklet', brooches: 'Brooch', pendants: 'Pendant', cufflinks: 'Cufflinks',
}

const styleAdjectives = ['Classic', 'Heritage', 'Artisan', 'Signature', 'Deluxe', 'Royal', 'Refined', 'Noble']

const featuredProducts = [
  { id: 'alfama-ring', collection: 'alfama', category: 'rings', priceDisplay: '€1,240', image: 'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/540/720?1771499425', materials: ['18k Gold', 'Diamond'], name: 'Alfama Ring' },
  { id: 'alfama-necklace', collection: 'alfama', category: 'necklaces', priceDisplay: '€680', image: 'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/540/720?1771500213', materials: ['Sterling Silver', 'Pearl'], name: 'Alfama Necklace' },
  { id: 'alfama-bracelet', collection: 'alfama', category: 'bracelets', priceDisplay: '€920', image: 'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/540/720?1771514251', materials: ['18k Rose Gold'], name: 'Alfama Bracelet' },
  { id: 'alfama-earrings', collection: 'alfama', category: 'earrings', priceDisplay: '€540', image: 'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/540/720?1771427526', materials: ['14k Gold', 'Topaz'], name: 'Alfama Earrings' },
  { id: 'chiado-ring', collection: 'chiado', category: 'rings', priceDisplay: '€380', image: 'https://cdnx.jumpseller.com/cahico/image/74201642/thumb/540/720?1772729926', materials: ['Sterling Silver', 'Onyx'], name: 'Chiado Ring' },
  { id: 'chiado-necklace', collection: 'chiado', category: 'necklaces', priceDisplay: '€1,580', image: 'https://cdnx.jumpseller.com/cahico/image/74201707/thumb/540/720?1772730169', materials: ['18k Gold', 'Emerald'], name: 'Chiado Necklace' },
]

const featuredIds = new Set(featuredProducts.map((p) => p.id))

function formatPrice(eur) {
  return '€' + eur.toLocaleString('en-IE')
}

function hashId(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function generateProductName(id, collection, category) {
  const col = collection.charAt(0).toUpperCase() + collection.slice(1)
  const noun = categoryNouns[category] ?? category
  const idx = hashId(id)
  const adj = styleAdjectives[idx % styleAdjectives.length]
  return `${col} ${adj} ${noun}`
}

function generateProducts() {
  const generated = []

  for (const cat of categories) {
    const spec = categorySpecs[cat]
    let count = 0
    const featuredInCat = featuredProducts.filter((p) => p.category === cat).length
    const needed = spec.target - featuredInCat
    let globalIdx = 0

    for (const col of collections) {
      if (count >= needed) break
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

        generated.push({
          id,
          collection: col,
          category: cat,
          priceDisplay: formatPrice(price),
          image: makeImage(seed),
          materials: spec.materials[matIdx],
          name: generateProductName(id, col, cat),
        })

        count++
        globalIdx++
      }
    }
  }

  return generated
}

const allProducts = [...featuredProducts, ...generateProducts()]
const productMap = new Map(allProducts.map((p) => [p.id, p]))

export function getProductById(id) {
  return productMap.get(id)
}

export function getProductName(id) {
  const product = productMap.get(id)
  if (!product) return id
  return product.name
}
