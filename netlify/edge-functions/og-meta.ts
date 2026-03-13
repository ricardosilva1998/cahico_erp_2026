import { getProductById } from './product-data.ts'

const CRAWLER_UAS = [
  'facebookexternalhit',
  'Twitterbot',
  'WhatsApp',
  'LinkedInBot',
  'Slackbot',
  'Discordbot',
  'TelegramBot',
]

function isCrawler(userAgent: string): boolean {
  return CRAWLER_UAS.some((bot) => userAgent.includes(bot))
}

export default async function handler(request: Request, context: { next: () => Promise<Response> }) {
  const url = new URL(request.url)
  const pathMatch = url.pathname.match(/^\/product\/([^/]+)$/)

  if (!pathMatch) {
    return context.next()
  }

  const ua = request.headers.get('user-agent') ?? ''
  if (!isCrawler(ua)) {
    return context.next()
  }

  const productId = pathMatch[1]!
  const product = getProductById(productId)

  if (!product) {
    return context.next()
  }

  const response = await context.next()
  const html = await response.text()

  const materialsText = product.materials.join(' & ')
  const description = `${materialsText} — ${product.priceDisplay} | Handcrafted Portuguese Jewelry`
  const title = `${product.name} | CAHICO`
  const productUrl = `${url.origin}/product/${product.id}`

  const ogTags = `
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${product.image}" />
    <meta property="og:url" content="${productUrl}" />
    <meta property="og:site_name" content="CAHICO" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${product.image}" />
  `

  const modifiedHtml = html.replace('</head>', `${ogTags}</head>`)

  return new Response(modifiedHtml, {
    status: response.status,
    headers: response.headers,
  })
}

export const config = {
  path: '/product/*',
}
