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

const products: Product[] = [
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
