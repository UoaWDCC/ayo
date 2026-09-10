'use client'
import React from 'react'

import type { Person, TeamRole } from '@/payload-types'

interface TeamMember {
  id: string
  name: string
  role: string
}

interface TeamMemberWithRole extends TeamMember {
  sectionId: TeamRole['roleType']
  sortOrder: number
}

interface LeadershipProfile {
  id: string
  name: string
  role: string
  imageUrl: string
}

interface TeamSection {
  id: string
  heading: string
  body: string
  members: TeamMember[]
}

interface OurTeamProps {
  team: Person[]
}

interface TeamContent {
  heading: string
  body: string
}

const TEAM_CONTENT: Record<TeamRole['roleType'], TeamContent> = {
  executive: {
    heading: 'Executive Committee',
    body: "Our Executive Committee oversees everything from finances to logistics to player welfare, all while planning for AYO's future to ensure we stay responsive to the needs of Auckland's young musicians in a changing environment. The committee includes three player representatives, because we believe the people actually in the orchestra should have a voice in how it's run.",
  },
  admin: {
    heading: 'Administration',
    body: "Our Administration Team oversees everything from finances to logistics to player welfare, all while planning for AYO's future to ensure we stay responsive to the needs of Auckland's young musicians in a changing environment. The team includes three player representatives, because we believe the people actually in the orchestra should have a voice in how it's run.",
  },
}

function getTeamSections(team: Person[]): TeamSection[] {
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

  return (Object.keys(TEAM_CONTENT) as TeamRole['roleType'][]).map((sectionId) => ({
    id: sectionId,
    ...TEAM_CONTENT[sectionId],
    members: members
      .filter((member) => member.sectionId === sectionId)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
      .map(({ sectionId: _, sortOrder: __, ...member }) => member),
  }))
}

interface OurTeamContent {
  title: string
  intro: {
    heading: string
    body: string
  }
  leadership: {
    heading: string
    body: string
    profile: LeadershipProfile
  }
}

const MOCK_DATA: OurTeamContent = {
  title: 'Team',
  intro: {
    heading: 'The People Who Keep AYO Running',
    body: "AYO runs entirely on the time, expertise, and passion of volunteers — people who've experienced first-hand what music can do, and who show up to make sure the next generation gets that same chance.",
  },
  leadership: {
    heading: 'Artistic Leadership',
    body: 'Our Music Director and conductor Antun Poljanich shapes every AYO season, choosing repertoire that stretches the current cohort of players, showcases their growing skills, and gives audiences a genuinely great concert experience. His creative direction and ambitious performance standards set the bar, and through intensive sectionals with guest tutors and mentors, every AYO player who gives their best can be sure of being challenged to reach their full potential.',
    profile: {
      id: 'antun-poljanich',
      name: 'Antun Poljanich',
      role: 'Music Director, Conductor',
      imageUrl: '/about-us-our-team.jpg',
    },
  },
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl sm:text-3xl font-semibold mb-3">{children}</h2>
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base sm:text-lg text-black/60 leading-relaxed max-w-4xl mb-8">{children}</p>
  )
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

function LeadershipPhoto({ profile }: { profile: LeadershipProfile }) {
  const [imageFailed, setImageFailed] = React.useState(!profile.imageUrl)
  const showImage = profile.imageUrl && !imageFailed

  return (
    <div
      className="relative w-full overflow-hidden rounded-md mb-16 bg-neutral-200"
      style={{ aspectRatio: '3 / 1', maxHeight: 380 }}
    >
      {showImage ? (
        <img
          src={profile.imageUrl}
          alt={`${profile.name}, ${profile.role}`}
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
        <p className="text-white font-semibold text-sm">{profile.name}</p>
        <p className="text-white/80 italic text-sm">{profile.role}</p>
      </div>
    </div>
  )
}

export default function OurTeam({ team }: OurTeamProps) {
  const { title, intro, leadership } = MOCK_DATA
  const sections = getTeamSections(team)

  return (
    <section className="w-full py-12">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 md:py-24">
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold leading-none m-0">
            Our <em>{title}</em>
          </h1>
        </div>

        <div className="mb-10">
          <SectionHeading>{intro.heading}</SectionHeading>
          <SectionBody>{intro.body}</SectionBody>
        </div>

        <div className="mb-4">
          <SectionHeading>{leadership.heading}</SectionHeading>
          <SectionBody>{leadership.body}</SectionBody>
          <LeadershipPhoto profile={leadership.profile} />
        </div>

        {sections.map((section) => (
          <div key={section.id} className="mb-14">
            <SectionHeading>{section.heading}</SectionHeading>
            <SectionBody>{section.body}</SectionBody>
            <MemberGrid members={section.members} />
          </div>
        ))}
      </div>
    </section>
  )
}
