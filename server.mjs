/**
 * Express server for Railway deployment.
 * Serves the Vite-built SPA, API routes, OG meta middleware, and cron jobs.
 */

import express from 'express'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import { fileURLToPath } from 'url'
import cron from 'node-cron'
import { getProductById } from './server/product-data.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// ─── OG Meta Middleware for social crawlers ─────────────────────────────────
const CRAWLER_UAS = [
  'facebookexternalhit',
  'Twitterbot',
  'WhatsApp',
  'LinkedInBot',
  'Slackbot',
  'Discordbot',
  'TelegramBot',
]

function isCrawler(userAgent) {
  return CRAWLER_UAS.some((bot) => userAgent.includes(bot))
}

import { readFileSync } from 'fs'

let indexHtml = ''
try {
  indexHtml = readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8')
} catch {
  // Will be populated after build
}

app.get('/product/:productId', (req, res, next) => {
  const ua = req.headers['user-agent'] || ''
  if (!isCrawler(ua)) return next()

  const product = getProductById(req.params.productId)
  if (!product) return next()

  if (!indexHtml) {
    try {
      indexHtml = readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8')
    } catch {
      return next()
    }
  }

  const materialsText = product.materials.join(' & ')
  const description = `${materialsText} — ${product.priceDisplay} | Handcrafted Portuguese Jewelry`
  const title = `${product.name} | CAHICO`
  const productUrl = `${req.protocol}://${req.get('host')}/product/${product.id}`

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

  const modifiedHtml = indexHtml.replace('</head>', `${ogTags}</head>`)
  res.send(modifiedHtml)
})

// ─── API Routes ─────────────────────────────────────────────────────────────

// Gift card email
app.post('/api/send-gift-card-email', async (req, res) => {
  const resendKey = process.env.RESEND_API_KEY

  if (!resendKey) {
    console.log('RESEND_API_KEY not configured — skipping gift card email')
    return res.json({ sent: false })
  }

  const { recipientEmail, code, valueEur, expiryDate } = req.body

  if (!recipientEmail || !code || !valueEur) {
    return res.status(400).send('Missing required fields')
  }

  const formattedValue = `€${Number(valueEur).toLocaleString('en-IE')}`
  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: 'Cahico <noreply@cahico.com>',
      to: [recipientEmail],
      subject: `You've received a CAHICO gift card!`,
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #fafafa;">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h1 style="color: #175976; font-size: 1.75rem; margin: 0;">CAHICO</h1>
            <p style="color: #888; font-size: 0.85rem; margin: 0.25rem 0 0;">Handcrafted Portuguese Jewelry</p>
          </div>
          <div style="background: white; border-radius: 12px; padding: 2rem; border: 1px solid #e5e5e5;">
            <h2 style="color: #175976; text-align: center; margin: 0 0 0.5rem;">You've received a gift card!</h2>
            <p style="color: #666; text-align: center; margin: 0 0 1.5rem;">Someone special has sent you a CAHICO gift card.</p>
            <div style="background: #f0f7fa; border-radius: 8px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
              <p style="color: #888; font-size: 0.85rem; margin: 0 0 0.5rem;">Your gift card code</p>
              <p style="color: #175976; font-size: 1.5rem; font-weight: 700; letter-spacing: 2px; margin: 0;">${code}</p>
            </div>
            <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem;">
              <div style="text-align: center;">
                <p style="color: #888; font-size: 0.85rem; margin: 0 0 0.25rem;">Value</p>
                <p style="color: #175976; font-size: 1.25rem; font-weight: 600; margin: 0;">${formattedValue}</p>
              </div>
              ${
                formattedExpiry
                  ? `<div style="text-align: center;">
                <p style="color: #888; font-size: 0.85rem; margin: 0 0 0.25rem;">Valid until</p>
                <p style="color: #175976; font-size: 1.25rem; font-weight: 600; margin: 0;">${formattedExpiry}</p>
              </div>`
                  : ''
              }
            </div>
            <div style="text-align: center;">
              <a href="https://cahico.com"
                 style="display: inline-block; background: #175976; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Shop Now
              </a>
            </div>
          </div>
          <p style="text-align: center; margin-top: 1.5rem; color: #888; font-size: 0.8rem;">
            Enter your gift card code at checkout to redeem.
          </p>
        </div>
      `,
    }),
  })

  if (result.ok) {
    console.log(`Gift card email sent to ${recipientEmail}`)
    return res.json({ sent: true })
  } else {
    const errorText = await result.text()
    console.error(`Failed to send gift card email to ${recipientEmail}:`, errorText)
    return res.status(500).json({ sent: false, error: errorText })
  }
})

// ─── Static files + SPA fallback ────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// ─── Cron Jobs ──────────────────────────────────────────────────────────────

// Abandoned cart reminder — every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('[cron] Running abandoned cart check...')

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.log('[cron] Missing env vars — skipping abandoned cart check')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()

  const { data: carts, error } = await supabase
    .from('abandoned_carts')
    .select('user_id, email, items')
    .eq('notified', false)
    .lt('updated_at', twoHoursAgo)

  if (error) {
    console.error('[cron] Error querying abandoned carts:', error.message)
    return
  }

  if (!carts || carts.length === 0) {
    console.log('[cron] No abandoned carts to process')
    return
  }

  const processedIds = []

  for (const cart of carts) {
    const items = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items
    if (!Array.isArray(items) || items.length === 0) continue

    const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Cahico <noreply@cahico.com>',
        to: [cart.email],
        subject: 'You left something beautiful behind',
        html: `
          <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
            <h1 style="color: #175976;">Still thinking it over?</h1>
            <p>You have ${itemCount} item${itemCount > 1 ? 's' : ''} waiting in your cart at Cahico.</p>
            <p>Each piece is handcrafted and one-of-a-kind — don't let yours slip away.</p>
            <a href="https://cahico.com/cart"
               style="display: inline-block; background: #175976; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 1rem;">
              Return to your cart
            </a>
            <p style="margin-top: 2rem; color: #888; font-size: 0.85rem;">
              If you no longer wish to receive these emails, simply empty your cart.
            </p>
          </div>
        `,
      }),
    })

    if (res.ok) {
      processedIds.push(cart.user_id)
    } else {
      console.error(`[cron] Failed to send email to ${cart.email}:`, await res.text())
    }
  }

  if (processedIds.length > 0) {
    await supabase
      .from('abandoned_carts')
      .update({ notified: true })
      .in('user_id', processedIds)
  }

  console.log(`[cron] Processed ${processedIds.length} abandoned cart reminders`)
})

// Daily newsletter — 9 AM UTC
const collections = ['alfama', 'chiado', 'santos', 'canastras', 'belem', 'sintra', 'cascais', 'mouraria']
const categories = ['rings', 'necklaces', 'earrings', 'bracelets', 'pendants', 'brooches', 'anklets', 'cufflinks']
const categoryNames = {
  rings: 'Ring', necklaces: 'Necklace', earrings: 'Earrings', bracelets: 'Bracelet',
  pendants: 'Pendant', brooches: 'Brooch', anklets: 'Anklet', cufflinks: 'Cufflinks',
}
const imagePool = [
  'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/540/720?1771499425',
  'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/540/720?1771500213',
  'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/540/720?1771427526',
  'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/540/720?1771514251',
  'https://cdnx.jumpseller.com/cahico/image/74201642/thumb/540/720?1772729926',
  'https://cdnx.jumpseller.com/cahico/image/74201707/thumb/540/720?1772730169',
  'https://cdnx.jumpseller.com/cahico/image/74201663/thumb/540/720?1772729987',
  'https://cdnx.jumpseller.com/cahico/image/74305850/thumb/540/720?1772902538',
]

function getFeaturedProducts(date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const products = []

  for (let i = 0; i < 4; i++) {
    const catIdx = (dayOfYear + i) % categories.length
    const colIdx = (dayOfYear * 3 + i * 7) % collections.length
    const cat = categories[catIdx]
    const col = collections[colIdx]
    const noun = categoryNames[cat]
    const price = 280 + ((dayOfYear * 13 + i * 41) % 20) * 100
    const image = imagePool[(dayOfYear + i) % imagePool.length]

    products.push({
      id: `${col}-${cat}-1`,
      name: `${col.charAt(0).toUpperCase() + col.slice(1)} ${noun}`,
      price: `€${price.toLocaleString('en-IE')}`,
      image,
    })
  }

  return products
}

cron.schedule('0 9 * * *', async () => {
  console.log('[cron] Running daily newsletter...')

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.log('[cron] Missing env vars — skipping newsletter')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: subs, error } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('active', true)

  if (error) {
    console.error('[cron] Error querying subscribers:', error.message)
    return
  }

  if (!subs || subs.length === 0) {
    console.log('[cron] No active subscribers')
    return
  }

  const products = getFeaturedProducts(new Date())

  const productHtml = products
    .map(
      (p) => `
      <div style="display: inline-block; width: 48%; vertical-align: top; margin-bottom: 1rem; box-sizing: border-box;">
        <a href="https://cahico.com/product/${p.id}" style="text-decoration: none; color: inherit;">
          <img src="${p.image}" alt="${p.name}" style="width: 100%; border-radius: 8px; display: block;" />
          <p style="margin: 0.5rem 0 0.15rem; font-weight: 600; color: #175976; font-size: 0.95rem;">${p.name}</p>
          <p style="margin: 0; color: #666; font-size: 0.9rem;">${p.price}</p>
        </a>
      </div>`,
    )
    .join('\n')

  const html = `
    <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #fafafa;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h1 style="color: #175976; font-size: 1.75rem; margin: 0;">CAHICO</h1>
        <p style="color: #888; font-size: 0.85rem; margin: 0.25rem 0 0;">Handcrafted Portuguese Jewelry</p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 1.5rem; border: 1px solid #e5e5e5;">
        <h2 style="color: #175976; text-align: center; margin: 0 0 0.25rem;">Today's Picks</h2>
        <p style="color: #666; text-align: center; margin: 0 0 1.25rem; font-size: 0.9rem;">Curated selections from our artisans</p>
        <div style="text-align: center;">
          ${productHtml}
        </div>
        <div style="text-align: center; margin-top: 1rem;">
          <a href="https://cahico.com"
             style="display: inline-block; background: #175976; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Explore All Pieces
          </a>
        </div>
      </div>
      <p style="text-align: center; margin-top: 1.5rem; color: #888; font-size: 0.8rem;">
        You're receiving this because you subscribed to the CAHICO newsletter.<br/>
        <a href="https://cahico.com/profile" style="color: #175976;">Unsubscribe</a> at any time.
      </p>
    </div>
  `

  const emails = subs.map((s) => s.email)
  let sent = 0

  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Cahico <noreply@cahico.com>',
        to: batch,
        subject: "Today's Picks from CAHICO",
        html,
      }),
    })

    if (res.ok) {
      sent += batch.length
    } else {
      console.error(`[cron] Failed to send batch ${i}:`, await res.text())
    }
  }

  console.log(`[cron] Newsletter sent to ${sent}/${emails.length} subscribers`)
})

// ─── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
