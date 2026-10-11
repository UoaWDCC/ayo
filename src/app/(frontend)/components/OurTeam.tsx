'use client'

import { gsap } from 'gsap'
import Image from 'next/image'
import React from 'react'

import type { Person, TeamRole } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'
import PersonDetailsPanel, { type PersonPanelData } from './PersonDetailsPanel'
import StaggerReveal from './StaggerReveal'
import { createSubsectionConverters } from './richTextConverters'

interface TeamMember {
  id: string
  name: string
  role: string
  /** Everything the person's drawer shows. */
  panel: PersonPanelData
}

interface TeamMemberWithRole extends TeamMember {
  sectionId: TeamRole['roleType']
  sortOrder: number
}

interface OurTeamProps {
  team: Person[]
  introText?: SerializedEditorState
  leadershipText?: SerializedEditorState
  leadershipImageUrl?: string
  executiveText?: SerializedEditorState
  adminText?: SerializedEditorState
  /** See `Grid` — the filter re-entry replaces the scroll reveal. */
  skipReveal?: boolean
}

const SECTION_ORDER: TeamRole['roleType'][] = ['executive', 'admin']

const FADE = 'team-fade'

// Headings inside these blocks are sub-headings of "Our Team", so they render as
// h3 rather than another section-scale h2.
const introConverters = createSubsectionConverters(FADE)
const executiveConverters = createSubsectionConverters(`${FADE}-executive`)
const adminConverters = createSubsectionConverters(`${FADE}-admin`)

function getTeamSections(team: Person[]) {
  const members = team.flatMap((person): TeamMemberWithRole[] => {
    const teamRoles = (person.teamRoles ?? []).filter(
      (teamRole): teamRole is TeamRole => typeof teamRole === 'object' && teamRole !== null,
    )

    // A person can hold several roles; the drawer lists all of them.
    const allRoles = teamRoles.map((teamRole) => teamRole.roleName)

    return teamRoles.map((teamRole) => ({
      id: `${person.id}-${teamRole.id}`,
      name: person.name,
      role: teamRole.roleName,
      sectionId: teamRole.roleType,
      sortOrder: teamRole.sortOrder,
      panel: {
        name: person.name,
        role: teamRole.roleName,
        imageUrl:
          typeof person.photo === 'object' && person.photo !== null && person.photo.url
            ? person.photo.url
            : undefined,
        description: person.description ?? undefined,
        years: person.years,
        roles: allRoles,
        footerNote: 'AYO team.',
      },
    }))
  })

  return SECTION_ORDER.map((sectionId) => ({
    id: sectionId,
    members: members
      .filter((member) => member.sectionId === sectionId)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
      .map(({ sectionId: _, sortOrder: __, ...member }) => member),
  }))
}

/**
 * A name/role pair. Hover lifts it 2px — the row hover, scaled down to a list
 * item — and clicking opens the same drawer as a player card.
 */
function Member({ member }: { member: TeamMember }) {
  const [isPanelOpen, setIsPanelOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onEnter = () => gsap.to(el, { y: -2, duration: 0.2, ease: 'power2.out' })
    const onLeave = () => gsap.to(el, { y: 0, duration: 0.2, ease: 'power2.in' })

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={`${FADE}-member transition-opacity hover:opacity-70`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsPanelOpen(true)}
        aria-haspopup="dialog"
        className="block w-full text-left cursor-pointer"
      >
        <span className="block text-base font-semibold underline underline-offset-2 decoration-1">
          {member.name}
        </span>
        <span className="block text-base italic text-[#B2B2B2] mt-0.5">{member.role}</span>
      </button>

      <PersonDetailsPanel
        person={member.panel}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false)
          triggerRef.current?.focus()
        }}
      />
    </div>
  )
}

function MemberGrid({ members, skipReveal }: { members: TeamMember[]; skipReveal: boolean }) {
  return (
    <StaggerReveal
      fadeClass={`${FADE}-member`}
      stagger={0.04}
      active={!skipReveal}
      className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-8 gap-y-6"
    >
      {members.map((member) => (
        <Member key={member.id} member={member} />
      ))}
    </StaggerReveal>
  )
}

function LeadershipPhoto({
  imageUrl,
  name,
  role,
}: {
  imageUrl?: string
  name: string
  role: string
}) {
  const [imageFailed, setImageFailed] = React.useState(!imageUrl)
  const showImage = imageUrl && !imageFailed
  const frameRef = React.useRef<HTMLDivElement>(null)
  const imageRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const frame = frameRef.current
    const image = imageRef.current
    if (!frame || !image) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onEnter = () => gsap.to(image, { scale: 1.05, duration: 0.4, ease: 'power2.out' })
    const onLeave = () => gsap.to(image, { scale: 1, duration: 0.4, ease: 'power2.in' })

    frame.addEventListener('mouseenter', onEnter)
    frame.addEventListener('mouseleave', onLeave)

    return () => {
      frame.removeEventListener('mouseenter', onEnter)
      frame.removeEventListener('mouseleave', onLeave)
    }
  }, [showImage])

  return (
    <div
      ref={frameRef}
      className={`${FADE} relative w-full overflow-hidden mb-16 bg-[#EBEBEB]`}
      style={{ aspectRatio: '3 / 1', maxHeight: 380 }}
    >
      {showImage ? (
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={`${name}, ${role}`}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: 'center 25%' }}
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#EBEBEB]">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#B2B2B2] fill-current">
            <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5Z" />
          </svg>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4">
        <p className="text-white font-semibold text-sm">{name}</p>
        <p className="text-white/80 italic text-sm">{role}</p>
      </div>
    </div>
  )
}

export default function OurTeam({
  team,
  introText,
  leadershipText,
  leadershipImageUrl,
  executiveText,
  adminText,
  skipReveal = false,
}: OurTeamProps) {
  const sections = getTeamSections(team)
  const sectionTextMap: Partial<Record<TeamRole['roleType'], SerializedEditorState | undefined>> = {
    executive: executiveText,
    admin: adminText,
  }

  return (
    <div className="about-filter-section w-full">
      <StaggerReveal fadeClass={FADE} active={!skipReveal}>
        <h2
          className={`${FADE} font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]`}
        >
          Our <em>Team</em>
        </h2>

        {/* TODO: move this sub-line into Payload alongside the section's rich text. */}
        <p className={`${FADE} mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic`}>
          The people who keep AYO running, on and off the stage.
        </p>

        {introText && (
          <div className="mt-8 mb-10">
            <RichText data={introText} converters={introConverters} />
          </div>
        )}

        {leadershipText && (
          <div className="mb-4">
            <div className="mb-8">
              <RichText data={leadershipText} converters={introConverters} />
            </div>
            <LeadershipPhoto
              imageUrl={leadershipImageUrl}
              name="Antun Poljanich"
              role="Music Director, Conductor"
            />
          </div>
        )}
      </StaggerReveal>

      {sections.map((section) => {
        const text = sectionTextMap[section.id]
        return (
          <div key={section.id} className="mb-14">
            {text && (
              <StaggerReveal fadeClass={`${FADE}-${section.id}`} active={!skipReveal}>
                <div className="mb-8">
                  <RichText
                    data={text}
                    converters={section.id === 'admin' ? adminConverters : executiveConverters}
                  />
                </div>
              </StaggerReveal>
            )}
            <MemberGrid members={section.members} skipReveal={skipReveal} />
          </div>
        )
      })}
    </div>
  )
}
