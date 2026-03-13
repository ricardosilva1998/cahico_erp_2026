/**
 * Gift Card Email Notification — Netlify Function
 * Sends a styled email to the gift card recipient with code, value, and expiry.
 *
 * POST body: { recipientEmail, code, valueEur, expiryDate }
 * Requires RESEND_API_KEY env var. Graceful no-op if missing.
 */

import type { Config, Context } from '@netlify/functions'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(req: Request, _context: Context) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const resendKey = process.env.RESEND_API_KEY

  if (!resendKey) {
    console.log('RESEND_API_KEY not configured — skipping gift card email')
    return new Response(JSON.stringify({ sent: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { recipientEmail, code, valueEur, expiryDate } = await req.json()

  if (!recipientEmail || !code || !valueEur) {
    return new Response('Missing required fields', { status: 400 })
  }

  const formattedValue = `€${Number(valueEur).toLocaleString('en-IE')}`
  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const res = await fetch('https://api.resend.com/emails', {
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

  if (res.ok) {
    console.log(`Gift card email sent to ${recipientEmail}`)
    return new Response(JSON.stringify({ sent: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } else {
    const errorText = await res.text()
    console.error(`Failed to send gift card email to ${recipientEmail}:`, errorText)
    return new Response(JSON.stringify({ sent: false, error: errorText }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config: Config = {
  path: '/api/send-gift-card-email',
}
