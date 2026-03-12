/**
 * Abandoned Cart Email Reminder — Netlify Scheduled Function
 * Runs every 30 minutes to send email reminders for carts abandoned > 2 hours.
 *
 * Required Supabase migration:
 *
 * CREATE TABLE abandoned_carts (
 *   user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 *   email TEXT NOT NULL,
 *   items JSONB NOT NULL DEFAULT '[]',
 *   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 *   notified BOOLEAN NOT NULL DEFAULT false
 * );
 * CREATE INDEX idx_abandoned_carts_lookup ON abandoned_carts (updated_at, notified) WHERE notified = false;
 */

import type { Config, Context } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(_req: Request, _context: Context) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.log('Missing env vars — skipping abandoned cart check')
    return new Response('No-op: env vars not configured', { status: 200 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()

  const { data: carts, error } = await supabase
    .from('abandoned_carts')
    .select('user_id, email, items')
    .eq('notified', false)
    .lt('updated_at', twoHoursAgo)

  if (error) {
    console.error('Error querying abandoned carts:', error.message)
    return new Response('Query error', { status: 500 })
  }

  if (!carts || carts.length === 0) {
    console.log('No abandoned carts to process')
    return new Response('No carts', { status: 200 })
  }

  const processedIds: string[] = []

  for (const cart of carts) {
    const items = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items
    if (!Array.isArray(items) || items.length === 0) continue

    const itemCount = items.reduce((sum: number, i: { quantity: number }) => sum + (i.quantity || 1), 0)

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
      console.error(`Failed to send email to ${cart.email}:`, await res.text())
    }
  }

  if (processedIds.length > 0) {
    await supabase
      .from('abandoned_carts')
      .update({ notified: true })
      .in('user_id', processedIds)
  }

  console.log(`Processed ${processedIds.length} abandoned cart reminders`)
  return new Response(`Sent ${processedIds.length} reminders`, { status: 200 })
}

export const config: Config = {
  schedule: '*/30 * * * *',
}
