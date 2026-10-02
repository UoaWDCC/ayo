'use client'
import React from 'react'

import type { Person, TeamRole } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from './RichText'

interface TeamMember {
  id: string
  name: string
  role: string
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
}

const SECTION_ORDER: TeamRole['roleType'][] = ['executive', 'admin']

function getTeamSections(team: Person[]) {
  const members = team.flatMap((person): TeamMemberWithRole[] => {
    const teamRoles = (person.teamRoles ?? []).filter(
      (teamRole): teamRole is TeamRole => typeof teamRole === 'object' && teamRole !== null,
    )

    return teamRoles.map((teamRole) => ({
      id: `${person.id}-${teamRole.id}`,
      name: person.name,
      role: teamRole.roleName,
      sectionId: teamRole.roleType,
      sortOrder: teamRole.sortOrder,
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

function MemberGrid({ members }: { members: TeamMember[] }) {
  return (
    <div
      className="grid gap-x-8 gap-y-6"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
    >
      {members.map((member) => (
        <div key={member.id}>
          <span className="block text-base font-semibold underline underline-offset-2 decoration-1">
            {member.name}
          </span>
          <p className="text-base italic text-black/70 mt-0.5">{member.role}</p>
        </div>
      ))}
    </div>
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

  return (
    <div
      className="relative w-full overflow-hidden rounded-md mb-16 bg-neutral-200"
      style={{ aspectRatio: '3 / 1', maxHeight: 380 }}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={`${name}, ${role}`}
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-neutral-400 fill-current">
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
}: OurTeamProps) {
  const sections = getTeamSections(team)
  const sectionTextMap: Partial<Record<TeamRole['roleType'], SerializedEditorState | undefined>> = {
    executive: executiveText,
    admin: adminText,
  }

  return (
    <section className="w-full mt-5">
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-6xl font-bold leading-none m-0">
          Our <em>Team</em>
        </h1>
      </div>

      {introText && (
        <div className="mb-10 text-base sm:text-lg text-[#2E2E2E] leading-relaxed [&_h1]:text-2xl [&_h1]:mb-3">
          <RichText data={introText} />
        </div>
      )}

      {leadershipText && (
        <div className="mb-4">
          <div className="mb-8 text-base sm:text-lg text-[#2E2E2E] leading-relaxed [&_h1]:text-2xl [&_h1]:mb-3">
            <RichText data={leadershipText} />
          </div>
          <LeadershipPhoto
            imageUrl={leadershipImageUrl}
            name="Antun Poljanich"
            role="Music Director, Conductor"
          />
        </div>
      )}

      {sections.map((section) => {
        const text = sectionTextMap[section.id]
        return (
          <div key={section.id} className="mb-14">
            {text && (
              <div className="mb-8 text-base sm:text-lg text-[#2E2E2E] leading-relaxed [&_h1]:text-2xl [&_h1]:mb-3">
                <RichText data={text} />
              </div>
            )}
            <MemberGrid members={section.members} />
          </div>
        )
      })}
    </section>
  )
}
