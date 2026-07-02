import MyAYOLink from '../components/MyAYOLink'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

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
  }
}

export default async function MyAyoPage() {
  const cookieStore = await cookies()
  const hasAccess = cookieStore.get('my-ayo-access')?.value === 'granted'

  if (!hasAccess) {
    return (
      <main>
        <form action={checkPassword}>
          <input type="password" name="password" placeholder="Enter password" required />
          <button type="submit">Submit</button>
        </form>
      </main>
    )
  }

  return (
    <main>
      <iframe
        src="https://calendar.google.com/calendar/embed?src=d4e4e881da9aa9c00cd2e9cb6a396106416b51b124e4051464075206f5137a06%40group.calendar.google.com&ctz=Pacific%2FAuckland"
        className="ml-30 border: 0"
        width="800"
        height="600"
      ></iframe>
      <div className="flex">
        <a href="https://google.com" className="p-3 ml-30 border-black border-2 rounded-md">
          <p>Add to Google Calendar</p>
        </a>
        <a href="https://google.com" className="p-3 ml-30 border-black border-2 rounded-md">
          <p>Subscribe on iPhone / Apple Calendar</p>
        </a>
        <MyAYOLink />
      </div>
    </main>
  )
}
