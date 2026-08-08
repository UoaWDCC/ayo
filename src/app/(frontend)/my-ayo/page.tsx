import MyAYOCopyLink from '../components/MyAYOCopyLink'
import NavBar from '../components/NavBar'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function checkPassword(formData: FormData) {
  'use server'
  const payload = await getPayload({ config })
  const password = formData.get('password')
  const { docs } = await payload.find({
    collection: 'passwords',
  })
  const correctPasswords = docs.map((doc) => doc.password)

  if (password && correctPasswords.includes(password as string)) {
    const cookieStore = await cookies()
    cookieStore.set('my-ayo-access', 'granted', {
      httpOnly: true,
      path: '/my-ayo',
      maxAge: 60 * 60 * 24 * 7,
    })
    redirect('/my-ayo')
  }

  redirect('/my-ayo?error=1')
}

export default async function MyAyoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const payload = await getPayload({ config })

  const linkResult = await payload.find({
    collection: 'links',
    limit: 1,
  })

  const doc = linkResult.docs[0]
  const calendarEmbed = doc?.embedLink ?? ''
  const calendarUrl = doc?.publicLink ?? ''
  const calendarICal = doc?.icalLink ?? ''

  const cookieStore = await cookies()
  const hasAccess = cookieStore.get('my-ayo-access')?.value === 'granted'
  if (!hasAccess) {
    const { error } = await searchParams
    return (
      <main>
        <NavBar />
        <form action={checkPassword}>
          <input type="password" name="password" placeholder="Enter password" required />
          <button type="submit">Submit</button>
        </form>
      </main>
    )
  }

  return (
    <main>
      <NavBar />
      <iframe src={calendarEmbed} className="ml-30 border: 0" width="800" height="600"></iframe>
      <div className="flex">
        <a href={calendarUrl} className="p-3 ml-30 border-black border-2 rounded-md">
          <p>Add to Google Calendar</p>
        </a>
        <a href={calendarICal} className="p-3 ml-30 border-black border-2 rounded-md">
          <p>Subscribe on iPhone / Apple Calendar</p>
        </a>
        <MyAYOCopyLink copyLink={calendarICal} />
      </div>
    </main>
  )
}
