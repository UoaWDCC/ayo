type Resource = {
  name: string
  date: string
  href: string
}

const RESOURCES: Resource[] = [
  { name: 'AYO_Player_Handbook.pdf', date: '27/06/2026', href: '/sample.pdf' },
  { name: 'AYO_Rehearsal_Schedule.pdf', date: '07/06/2026', href: '/sample.pdf' },
  { name: 'AYO_Concert_Calendar.pdf', date: '18/04/2026', href: '/sample.pdf' },
  { name: 'AYO_Rehearsal_Etiquette.pdf', date: '28/03/2026', href: '/sample.pdf' },
  { name: 'AYO_Attendance_Policy.pdf', date: '17/03/2026', href: '/sample.pdf' },
  { name: 'AYO_Health_and_Safety_Guide.pdf', date: '05/03/2026', href: '/sample.pdf' },
  { name: 'AYO_Audition_Information.pdf', date: '05/03/2026', href: '/sample.pdf' },
  { name: 'AYO_Contact_Directory.pdf', date: '28/02/2026', href: '/sample.pdf' },
]

export default function ResourcesSection() {
  return (
    <section className="px-6 sm:px-12 lg:px-24 py-12">
      <h2 className="font-semibold text-3xl sm:text-4xl text-black mb-8">Resources</h2>

      <div className="border-t border-[#EBEBEB]">
        {RESOURCES.map((resource) => (
          <a
            key={resource.name}
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border-b border-[#EBEBEB] py-4 group"
          >
            <span className="flex items-center gap-2 text-sm text-black underline">
              {resource.name}
              <svg
                width="10"
                height="10"
                viewBox="0 0 13 13"
                fill="none"
                className="rotate-180 transition-transform group-hover:rotate-0"
              >
                <path
                  d="M2 2L11 11M11 11V3M11 11H3"
                  stroke="#1E1E1E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-xs text-[#858585]">{resource.date}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
