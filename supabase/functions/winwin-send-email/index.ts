import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const denoRuntime = (globalThis as typeof globalThis & {
  Deno: {
    serve: (handler: (req: Request) => Response | Promise<Response>) => void
    env: {
      get: (name: string) => string | undefined
    }
  }
}).Deno

const ALLOWED_ORIGINS = [
  'https://win-win-beta.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
]

const getCorsHeaders = (origin: string | null) => {
  const isAllowedLocalhost = !!origin && /^https?:\/\/localhost:\d+$/.test(origin)
  const isAllowedOrigin = !!origin && (ALLOWED_ORIGINS.includes(origin) || isAllowedLocalhost)
  const allowedOrigin = isAllowedOrigin ? origin! : ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
  }
}

const escapeHtml = (value: unknown) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return 'Not provided'
  }

  return String(value)
}

const buildQuoteEmail = (data: Record<string, unknown>) => {
  const submittedAt = new Date().toISOString()

  return {
    subject: 'New Quote Request - WinWin Tooling',
    html: `
      <h2>New Get Quotation Form Submission</h2>
      <p><strong>Submitted At:</strong> ${escapeHtml(submittedAt)}</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Full Name</strong></td><td>${escapeHtml(formatValue(data.name))}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(formatValue(data.email))}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(formatValue(data.phone))}</td></tr>
        <tr><td><strong>Company</strong></td><td>${escapeHtml(formatValue(data.company))}</td></tr>
        <tr><td><strong>Location</strong></td><td>${escapeHtml(formatValue(data.location))}</td></tr>
        <tr><td><strong>Product of Interest</strong></td><td>${escapeHtml(formatValue(data.product))}</td></tr>
        <tr><td><strong>Quantity Required</strong></td><td>${escapeHtml(formatValue(data.quantity))}</td></tr>
        <tr><td><strong>Additional Requirements</strong></td><td>${escapeHtml(formatValue(data.message))}</td></tr>
      </table>
    `,
  }
}

const buildContactEmail = (data: Record<string, unknown>) => {
  const submittedAt = new Date().toISOString()

  return {
    subject: 'New Contact Inquiry - WinWin Tooling',
    html: `
      <h2>New Contact Us Form Submission</h2>
      <p><strong>Submitted At:</strong> ${escapeHtml(submittedAt)}</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Full Name</strong></td><td>${escapeHtml(formatValue(data.name))}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(formatValue(data.email))}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(formatValue(data.phone))}</td></tr>
        <tr><td><strong>Company</strong></td><td>${escapeHtml(formatValue(data.company))}</td></tr>
        <tr><td><strong>Location</strong></td><td>${escapeHtml(formatValue(data.location))}</td></tr>
        <tr><td><strong>Inquiry Type</strong></td><td>${escapeHtml(formatValue(data.inquiryType))}</td></tr>
        <tr><td><strong>Message</strong></td><td>${escapeHtml(formatValue(data.message))}</td></tr>
      </table>
    `,
  }
}

denoRuntime.serve(async (req: Request) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: corsHeaders,
      status: 405,
    })
  }

  try {
    const mailgunApiKey = denoRuntime.env.get('WINWIN_MAILGUN_API_KEY')
    const mailgunDomain = denoRuntime.env.get('WINWIN_MAILGUN_DOMAIN')
    const recipientEmail = denoRuntime.env.get('WINWIN_RECIPIENT_EMAIL')

    if (!mailgunApiKey || !mailgunDomain || !recipientEmail) {
      return new Response(JSON.stringify({ error: 'Email service is not configured' }), {
        headers: corsHeaders,
        status: 500,
      })
    }

    const { type, data } = await req.json()

    if (!type || !data || typeof data !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        headers: corsHeaders,
        status: 400,
      })
    }

    const emailTemplate = type === 'quote'
      ? buildQuoteEmail(data as Record<string, unknown>)
      : type === 'contact'
      ? buildContactEmail(data as Record<string, unknown>)
      : null

    if (!emailTemplate) {
      return new Response(JSON.stringify({ error: 'Unsupported form type' }), {
        headers: corsHeaders,
        status: 400,
      })
    }

    const formBody = new URLSearchParams()
    formBody.set('from', `WinWin Tooling <mailgun@${mailgunDomain}>`)
    formBody.set('to', recipientEmail)
    formBody.set('subject', emailTemplate.subject)
    formBody.set('html', emailTemplate.html)

    const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      const isSandboxRestriction = errorText.includes('Sandbox subdomains are for test purposes only')

      if (isSandboxRestriction) {
        return new Response(JSON.stringify({
          error: `Mailgun sandbox restriction: authorize ${recipientEmail} as an Authorized Recipient in Mailgun, or use a custom Mailgun domain.`,
        }), {
          headers: corsHeaders,
          status: 502,
        })
      }

      return new Response(JSON.stringify({ error: `Mailgun request failed: ${errorText}` }), {
        headers: corsHeaders,
        status: 502,
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders,
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }), {
      headers: corsHeaders,
      status: 500,
    })
  }
})
