import MyAYOCopyLink from '../components/MyAYOCopyLink'
import NavBar from '../components/NavBar'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import Resources from '../components/Resources'

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
      <main className="min-h-screen flex flex-col">
        <NavBar variant="dark" />
        <div className="relative bg-white flex-1 flex flex-col px-6 sm:px-12 lg:px-24">
          <div className="mt-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-16 md:pb-24">
            <h1 className="font-bold text-black leading-none">
              <span className="block text-4xl sm:text-5xl lg:text-6xl leading-none">My</span>
              <span className="block text-7xl sm:text-8xl lg:text-9xl leading-none">AYO</span>
            </h1>

            <form
              action={checkPassword}
              className="flex flex-col items-start w-full md:w-96 lg:w-[420px]"
            >
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full border-0 border-b border-black bg-transparent text-base font-normal text-black placeholder-black pb-2 focus:outline-none"
              />
              <div className="flex w-full items-center justify-between mt-4">
                {error ? (
                  <p className="italic font-semibold text-[15px] text-black">
                    Password is incorrect.
                  </p>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  className="bg-black text-white font-semibold text-[15px] px-6 py-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <NavBar />
      <Resources />
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
