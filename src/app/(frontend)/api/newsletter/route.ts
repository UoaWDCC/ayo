import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
// sends the correct response messaeg: " You're already subscribed!" or
//  "Almost there! Check your inbox to confirm your subscription."
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  // Honeypot: real users never fill this hidden field, bots usually do.
  if (body?.website) {
    return NextResponse.json({ message: 'Almost there! Check your inbox to confirm.' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const server = process.env.MAILCHIMP_SERVER_PREFIX

  if (!apiKey || !audienceId || !server) {
    console.error('Mailchimp environment variables are missing')
    return NextResponse.json(
      { error: 'Newsletter signup is unavailable right now.' },
      { status: 500 },
    )
  }

  // Mailchimp identifies members by the MD5 hash of the lowercase email.
  const hash = createHash('md5').update(email).digest('hex')

  try {
    const res = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members/${hash}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        },
        body: JSON.stringify({
          email_address: email,
          status_if_new: 'pending', // double opt-in: Mailchimp emails a confirmation link
        }),
      },
    )

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      console.error('Mailchimp error:', data)
      if (data.title === 'Invalid Resource') {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
      }
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 },
      )
    }

    // PUT returns the member's current status, so we can respond accurately.
    switch (data.status) {
      case 'subscribed':
        return NextResponse.json({ message: "You're already subscribed!" })
      case 'unsubscribed':
      case 'cleaned':
        return NextResponse.json(
          { error: "This email can't be re-subscribed here. Please contact us." },
          { status: 400 },
        )
      default: // 'pending'
        return NextResponse.json({
          message: 'Almost there! Check your inbox to confirm your subscription.',
        })
    }
  } catch (err) {
    console.error('Mailchimp request failed:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
