'use client'
import React from 'react'

interface TeamMember {
  id: string
  name: string
  role: string
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
  sections: TeamSection[]
}

const MOCK_DATA: OurTeamProps = {
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
  sections: [
    {
      id: 'executive-committee',
      heading: 'Executive Committee',
      body: "Our Executive Committee oversees everything from finances to logistics to player welfare, all while planning for AYO's future to ensure we stay responsive to the needs of Auckland's young musicians in a changing environment. The committee includes three player representatives, because we believe the people actually in the orchestra should have a voice in how it's run.",
      members: [
        { id: 'e1', name: 'Hon. Christopher Finlayson KC', role: 'Patron' },
        { id: 'e2', name: 'Alastair Clement', role: 'President' },
        { id: 'e3', name: 'Alexander Cowdell', role: 'Vice President' },
        { id: 'e4', name: 'Adrian Hirst', role: 'Chairperson' },
        { id: 'e5', name: 'Anne-Marie Forsyth', role: 'Secretary' },
        { id: 'e6', name: 'Alastair Clement', role: 'Music Director' },
        { id: 'e7', name: 'Alexander Cowdell', role: 'Orchestra Manager' },
        { id: 'e8', name: 'Adrian Hirst', role: 'Assistant Orchestra Manager' },
      ],
    },
    {
      id: 'administration',
      heading: 'Administration',
      body: "Our Administration Team oversees everything from finances to logistics to player welfare, all while planning for AYO's future to ensure we stay responsive to the needs of Auckland's young musicians in a changing environment. The team includes three player representatives, because we believe the people actually in the orchestra should have a voice in how it's run.",
      members: [
        { id: 'a1', name: 'Hon. Christopher Finlayson KC', role: 'Patron' },
        { id: 'a2', name: 'Alastair Clement', role: 'President' },
        { id: 'a3', name: 'Alexander Cowdell', role: 'Vice President' },
        { id: 'a4', name: 'Adrian Hirst', role: 'Chairperson' },
        { id: 'a5', name: 'Anne-Marie Forsyth', role: 'Secretary' },
        { id: 'a6', name: 'Alastair Clement', role: 'Music Director' },
        { id: 'a7', name: 'Alexander Cowdell', role: 'Orchestra Manager' },
        { id: 'a8', name: 'Adrian Hirst', role: 'Assistant Orchestra Manager' },
      ],
    },
  ],
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

export default function OurTeam() {
  const { title, intro, leadership, sections } = MOCK_DATA

  return (
    <section className="w-full py-12 px-10">
      <div className="max-w-6xl mx-auto">
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
