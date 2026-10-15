import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Button from '../components/Button'
import DocumentList from '../components/DocumentList'
import Hero from '../components/Hero'
import MyAYOCopyLink from '../components/MyAYOCopyLink'
import StaggerReveal from '../components/StaggerReveal'
import { createIntroConverters } from '../components/richTextConverters'
import { getPageBySlug } from '@/lib/getPageBySlug'
import { resolveHeroImage } from '@/lib/heroImage'
import { getCurrentSettingsRecord } from '@/lib/getCurrentSettingsRecord'
import { safeHref } from '@/lib/urls'
import type { Page } from '@/payload-types'

export const dynamic = 'force-dynamic'

const introConverters = createIntroConverters('my-ayo-intro-fade')

/** The sections a member-section block can be assigned to, straight from the block's schema. */
type MemberSectionName = Extract<
  NonNullable<Page['layout']>[number],
  { blockType: 'member-section' }
>['section']

const inputClasses =
  'w-full border-0 border-b border-black bg-transparent px-2 pb-3 text-[16px] outline-none'

async function checkPassword(formData: FormData) {
  'use server'
  const payload = await getPayload({ config })
  const password = formData.get('password')
  const { docs } = await payload.find({
    collection: 'passwords',
    pagination: false,
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
  const page = await getPageBySlug('my-ayo')

  const heroBlock = page?.layout?.find((block) => block.blockType === 'hero')
  const heroImage = resolveHeroImage(heroBlock?.backgroundImage)
  const hero = (
    <Hero
      title={heroBlock?.slogan || page?.title || ''}
      subtitle={heroBlock?.subtitle ?? undefined}
      backgroundImage={heroImage}
    />
  )

  // Each fixed section of this page takes its heading and sub-line from the
  // member-section block that names it, so the copy is editable without the
  // sections themselves depending on block order.
  const memberSections = page?.layout?.filter((block) => block.blockType === 'member-section') ?? []
  const sectionCopy = (section: MemberSectionName) =>
    memberSections.find((block) => block.section === section)

  const cookieStore = await cookies()
  const hasAccess = cookieStore.get('my-ayo-access')?.value === 'granted'

  if (!hasAccess) {
    const { error } = await searchParams

    const login = sectionCopy('login')

    return (
      <main className="min-h-screen bg-white text-black">
        {hero}

        <section className="bg-white w-full">
          <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-25 pb-12.5">
            <StaggerReveal fadeClass="my-ayo-login-fade" className="max-w-[1380px]">
              {login?.heading && (
                <h2 className="my-ayo-login-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
                  {login.heading}
                </h2>
              )}
              {login?.subtitle && (
                <p className="my-ayo-login-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
                  {login.subtitle}
                </p>
              )}

              <form
                action={checkPassword}
                className="my-ayo-login-fade mt-8 w-full md:w-96 lg:w-[420px]"
              >
                <label className="block">
                  <span className="block px-2 pb-3 text-[15px] font-semibold">Password</span>
                  <input
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'my-ayo-password-error' : undefined}
                    className={inputClasses}
                  />
                </label>

                <div className="mt-6 flex w-full items-center justify-between gap-4">
                  {error ? (
                    <p
                      id="my-ayo-password-error"
                      role="alert"
                      className="text-[15px] leading-[18px] italic text-black"
                    >
                      Password is incorrect.
                    </p>
                  ) : (
                    <span />
                  )}
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </StaggerReveal>
          </div>
        </section>
      </main>
    )
  }

  const payload = await getPayload({ config })

  const [calendar, resourcesResult, linksResult] = await Promise.all([
    getCurrentSettingsRecord('calendar-links'),
    payload.find({
      collection: 'link',
      where: { category: { equals: 'resources' } },
      pagination: false,
    }),
    payload.find({
      collection: 'link',
      where: { category: { equals: 'links' } },
      pagination: false,
    }),
  ])

  const calendarCopy = sectionCopy('calendar')
  const calendarEmbed = safeHref(calendar?.embedLink)
  const calendarUrl = safeHref(calendar?.publicLink)
  const calendarICal = safeHref(calendar?.icalLink, { allowWebcal: true })

  // Rich-text block [0] on the `my-ayo` page: optional intro shown once a member has logged in.
  const richTextBlocks = page?.layout?.filter((block) => block.blockType === 'rich-text') ?? []
  const introContent = richTextBlocks[0]?.content

  return (
    <main className="min-h-screen bg-white text-black">
      {hero}

      {introContent && (
        <section className="bg-white w-full">
          <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-25 pb-12.5">
            <div className="max-w-[1380px]">
              <StaggerReveal fadeClass="my-ayo-intro-fade">
                <RichText data={introContent} converters={introConverters} />
              </StaggerReveal>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white w-full">
        <div
          className={`mx-8 md:mx-20 lg:mx-24 xl:mx-32 ${introContent ? 'py-12.5' : 'pt-25 pb-12.5'}`}
        >
          <StaggerReveal fadeClass="my-ayo-calendar-fade">
            {calendarCopy?.heading && (
              <h2 className="my-ayo-calendar-fade font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]">
                {calendarCopy.heading}
              </h2>
            )}
            {calendarCopy?.subtitle && (
              <p className="my-ayo-calendar-fade mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic">
                {calendarCopy.subtitle}
              </p>
            )}

            {calendarEmbed ? (
              <iframe
                src={calendarEmbed}
                title="AYO calendar"
                className="my-ayo-calendar-fade mt-8 block w-full aspect-[3/4] md:aspect-[16/9] border border-[#EBEBEB]"
              />
            ) : (
              <p className="my-ayo-calendar-fade mt-8 text-[18px] leading-[22px] italic text-[#B2B2B2]">
                The calendar isn&apos;t available yet.
              </p>
            )}

            {(calendarUrl || calendarICal) && (
              <div className="my-ayo-calendar-fade mt-8 flex flex-wrap items-center gap-4">
                {calendarUrl && (
                  <Button href={calendarUrl} external>
                    Add to Google Calendar
                  </Button>
                )}
                {calendarICal && (
                  <Button href={calendarICal} external>
                    Subscribe on Apple Calendar
                  </Button>
                )}
                {calendarICal && <MyAYOCopyLink copyLink={calendarICal} />}
              </div>
            )}
          </StaggerReveal>
        </div>
      </section>

      <DocumentList
        title={sectionCopy('resources')?.heading}
        subtitle={sectionCopy('resources')?.subtitle ?? undefined}
        documents={resourcesResult.docs}
        fadeClass="my-ayo-resources-fade"
        searchable
        showDate
      />

      <DocumentList
        title={sectionCopy('links')?.heading}
        subtitle={sectionCopy('links')?.subtitle ?? undefined}
        documents={linksResult.docs}
        fadeClass="my-ayo-links-fade"
      />
    </main>
  )
}
