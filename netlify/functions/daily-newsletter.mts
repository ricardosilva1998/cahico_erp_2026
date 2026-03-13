/**
 * Daily Newsletter — Netlify Scheduled Function
 * Runs at 9 AM UTC daily to send product newsletter to subscribers.
 *
 * Required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY
 * Required Supabase table:
 *
 * CREATE TABLE newsletter_subscribers (
 *   email TEXT PRIMARY KEY,
 *   subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 *   active BOOLEAN NOT NULL DEFAULT true
 * );
 */

import type { Config, Context } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const collections = ['alfama', 'chiado', 'santos', 'canastras', 'belem', 'sintra', 'cascais', 'mouraria']
const categories = ['rings', 'necklaces', 'earrings', 'bracelets', 'pendants', 'brooches', 'anklets', 'cufflinks']

const categoryNames: Record<string, string> = {
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

function getFeaturedProducts(date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const products = []

  for (let i = 0; i < 4; i++) {
    const catIdx = (dayOfYear + i) % categories.length
    const colIdx = (dayOfYear * 3 + i * 7) % collections.length
    const cat = categories[catIdx]!
    const col = collections[colIdx]!
    const noun = categoryNames[cat]!
    const price = 280 + ((dayOfYear * 13 + i * 41) % 20) * 100
    const image = imagePool[(dayOfYear + i) % imagePool.length]!

    products.push({
      id: `${col}-${cat}-1`,
      name: `${col.charAt(0).toUpperCase() + col.slice(1)} ${noun}`,
      price: `€${price.toLocaleString('en-IE')}`,
      image,
    })
  }

  return products
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(_req: Request, _context: Context) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.log('Missing env vars — skipping newsletter')
    return new Response('No-op: env vars not configured', { status: 200 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: subs, error } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('active', true)

  if (error) {
    console.error('Error querying subscribers:', error.message)
    return new Response('Query error', { status: 500 })
  }

  if (!subs || subs.length === 0) {
    console.log('No active subscribers')
    return new Response('No subscribers', { status: 200 })
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

  // Send in batches of 100
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
      console.error(`Failed to send batch ${i}:`, await res.text())
    }
  }

  console.log(`Newsletter sent to ${sent}/${emails.length} subscribers`)
  return new Response(`Sent to ${sent} subscribers`, { status: 200 })
}

export const config: Config = {
  schedule: '0 9 * * *',
}
