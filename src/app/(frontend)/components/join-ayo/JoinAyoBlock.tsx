const photoMoments = [
  {
    src: '/grey_rectangle.png',
    alt: 'AYO musicians gathered in performance',
    label: 'Listen',
  },
  {
    src: '/grey_rectangle.png',
    alt: 'AYO players rehearsing together',
    label: 'Rehearse',
  },
  {
    src: '/grey_rectangle.png',
    alt: 'AYO orchestra performing on stage',
    label: 'Perform',
  },
  {
    src: '/grey_rectangle.png',
    alt: 'AYO musicians preparing for a concert',
    label: 'Belong',
  },
  {
    src: '/grey_rectangle.png',
    alt: 'AYO conductor leading the orchestra',
    label: 'Follow',
  },
  {
    src: '/grey_rectangle.png',
    alt: 'AYO string players in rehearsal',
    label: 'Shape',
  },
  {
    src: '/grey_rectangle.png',
    alt: 'AYO wind players performing together',
    label: 'Blend',
  },
  {
    src: '/grey_rectangle.png',
    alt: 'AYO musicians taking a bow after a concert',
    label: 'Applaud',
  },
]

const orchestraSections = ['Strings', 'Woodwind', 'Brass', 'Percussion']
const scoreNotes = ['p', 'dolce', 'espressivo', 'cresc.', 'tutti']

const sectionPhotos = [
  { src: '/grey_rectangle.png', alt: 'String section musicians playing violins' },
  { src: '/grey_rectangle.png', alt: 'Woodwind section with flutes and clarinets' },
  { src: '/grey_rectangle.png', alt: 'Brass section with trumpets and horns' },
  { src: '/grey_rectangle.png', alt: 'Percussion section with timpani and drums' },
]

const timelineMoments = [
  {
    year: '1959',
    title: 'AYO Founded',
    description: 'First rehearsal at Auckland Town Hall',
    src: '/grey_rectangle.png',
    alt: 'AYO founding concert photograph',
  },
  {
    year: '1965',
    title: 'First International Tour',
    description: 'Tour of Australia',
    src: '/grey_rectangle.png',
    alt: 'AYO musicians on tour',
  },
  {
    year: '1978',
    title: 'European Debut',
    description: 'Performed at Royal Albert Hall',
    src: '/grey_rectangle.png',
    alt: 'AYO performing in London',
  },
  {
    year: '1992',
    title: 'New Music Director',
    description: 'Appointment of new music director',
    src: '/grey_rectangle.png',
    alt: 'AYO conductor leading the orchestra',
  },
  {
    year: '2003',
    title: 'Asia Tour',
    description: 'Performances across Japan and Korea',
    src: '/grey_rectangle.png',
    alt: 'AYO on stage in Asia',
  },
  {
    year: '2011',
    title: 'Town Hall Season',
    description: 'Regular concerts at Auckland Town Hall',
    src: '/grey_rectangle.png',
    alt: 'Auckland Town Hall audience',
  },
  {
    year: '2019',
    title: '60th Anniversary',
    description: 'Gala concert celebrating six decades',
    src: '/grey_rectangle.png',
    alt: 'AYO anniversary performance',
  },
  {
    year: '2024',
    title: 'Record Year',
    description: 'Highest number of applicants in history',
    src: '/grey_rectangle.png',
    alt: 'AYO musicians in rehearsal',
  },
]
const timelineNotes = [
  { type: 'quarter', x: 140, line: 0 },
  { type: 'eighth', x: 380, line: 2 },
  { type: 'half', x: 680, line: 4 },
  { type: 'eighth', x: 980, line: 1 },
  { type: 'quarter', x: 1250, line: 3 },
  { type: 'beamedPair', x: 1550, line: 0 },
  { type: 'sixteenth', x: 1850, line: 2 },
  { type: 'quarter', x: 2150, line: 4 },
  { type: 'eighth', x: 2450, line: 1 },
  { type: 'half', x: 2750, line: 3 },
  { type: 'eighth', x: 3050, line: 0 },
  { type: 'beamedPair', x: 3350, line: 2 },
  { type: 'quarter', x: 3650, line: 4 },
  { type: 'sixteenth', x: 3950, line: 1 },
]

const trebleClefPath =
  'm 76.65,118.95 c -1.13,-4.98 -3.56,-8.51 -4.28,-9.45 -2.93,-3.94 -6.62,-6.56 -10.93,-7.81 -2.86,-0.8 -5.62,-0.91 -7.85,-0.74 C 52.63,95.42 51.71,90.01 50.88,85 55.89,79.32 59.23,73.99 61.32,70.04 64.51,63.99 65.56,59.78 65.62,59.6 67.2,54.8 67.53,47.71 66.51,40.17 65.59,33.23 63.67,27.05 61.5,24.06 c -0.94,-1.3 -1.91,-1.98 -2.86,-1.98 -1.12,0 -3.44,1.14 -6.1,3.69 -2.11,2.01 -5.11,5.59 -7.47,11.12 -2.76,6.5 -2.96,15.22 -2.63,21.4 0.35,6.69 1.37,11.92 1.38,11.97 0.02,0.08 0.26,1.46 0.66,3.82 -0.2,0.21 -0.43,0.42 -0.66,0.65 -0.94,0.92 -2.04,1.95 -3.32,3.23 -0.79,0.79 -1.66,1.62 -2.58,2.51 -7.76,7.49 -19.53,18.83 -19.53,36.44 0,4.33 0.83,8.39 2.47,12.08 1.45,3.31 3.57,6.33 6.27,8.97 7.11,6.95 16.85,9.9 23.33,9.76 2.72,-0.08 5.15,-0.29 7.34,-0.71 1.68,8.84 2.73,15.3 2.76,20.22 0.05,5.99 -1.48,9.65 -5.06,12.2 -2.24,1.59 -4.82,2.47 -7.67,2.6 -2.38,0.11 -4.47,-0.32 -5.77,-0.69 h -0.02 c 0,0 -0.26,-0.09 -0.27,-0.26 -0.02,-0.17 0.31,-0.22 0.31,-0.22 h 0.03 c 1.77,-0.4 5.05,-1.53 7.22,-4.57 1.65,-2.32 2.45,-6.58 0.76,-10.2 -1.02,-2.2 -3.32,-4.91 -8.49,-5.33 -2.3,-0.18 -4.39,0.29 -6.23,1.4 -1.66,0.99 -3.04,2.5 -4,4.34 -2.26,4.32 -1.84,9.59 1.03,13.13 2.73,3.33 6.97,5.46 11.97,5.99 0.79,0.09 1.57,0.11 2.34,0.11 4.08,0 8.12,-1.1 11.41,-3.13 3.36,-2.37 5.32,-6.03 5.93,-11.2 0.52,-4.27 0.16,-9.72 -1.12,-17.15 -0.33,-1.92 -0.83,-4.71 -1.43,-8.16 5.28,-1.76 9.11,-5.05 12.57,-10.44 3.03,-5.28 3.89,-10.89 2.58,-16.7 z m -31.46,24.11 c -4.27,-1.12 -8.35,-3.42 -11.8,-6.65 -1.2,-1.12 -2.93,-3.12 -4.28,-6.24 -1.25,-2.91 -1.87,-6.08 -1.81,-9.37 0.06,-4.32 1.26,-8.76 3.56,-13.16 2.69,-5.13 6.89,-10.21 12.46,-15.11 1.34,-1.18 2.6,-2.36 3.78,-3.54 0.7,3.93 1.46,8.24 2.27,12.72 -3.54,1.16 -7.9,4.07 -10.76,9.27 -3.26,6.03 -3.13,11.12 -2.46,14.32 0.86,4.1 3.19,7.56 6.37,9.48 0.86,0.52 4.65,2.48 6.35,1.94 0.34,-0.1 0.59,-0.31 0.71,-0.61 0.48,-1.08 -0.47,-1.67 -1.89,-2.55 -0.56,-0.34 -1.18,-0.73 -1.84,-1.22 -3.06,-2.28 -4.4,-6.38 -3.41,-10.41 0.54,-2.2 1.71,-4.2 3.41,-5.77 1.52,-1.42 3.4,-2.42 5.59,-3.01 1.88,10.34 3.78,20.6 5.29,28.29 0.11,0.63 0.24,1.25 0.36,1.87 -4.03,0.86 -8.02,0.77 -11.9,-0.25 z m 10.42,-30.53 c 9.51,-0.43 13.43,6.41 14.25,10.85 0.43,2.34 0.43,6.42 -0.99,10.3 -1.08,2.92 -3.34,6.67 -8.06,8.56 -0.06,-0.39 -0.13,-0.79 -0.2,-1.18 -1.43,-8.07 -3.21,-18.19 -5,-28.53 z M 48.87,47.28 c 1.63,-5.27 4.15,-8.26 5.99,-9.85 1.61,-1.4 3.12,-2.06 3.96,-2.06 0.13,0 0.25,0.03 0.33,0.06 0.44,0.13 0.92,0.65 1.35,1.45 2.13,3.94 1.44,10.11 0.21,14.2 -1.5,4.97 -4.19,10.12 -12.27,18.96 -0.16,-1.02 -0.31,-1.98 -0.45,-2.89 -1.15,-7.61 -0.85,-14.31 0.88,-19.87 z'

function TimelineNote({ type }: { type: string }) {
  const head = (fill: boolean) => (
    <ellipse
      cx="4.5"
      cy="19"
      rx="3.5"
      ry="2.4"
      transform="rotate(-15 4.5 19)"
      fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? undefined : 'currentColor'}
      strokeWidth={fill ? undefined : '1.3'}
    />
  )
  const stem = <rect x="7.2" y="3" width="1.2" height="16" fill="currentColor" />
  const flag = (offsetY: number) => (
    <path
      d={`M8.2 ${3 + offsetY} Q13 ${8 + offsetY} 11.5 ${16 + offsetY} Q10 ${10 + offsetY} 8.2 ${8 + offsetY}`}
      fill="currentColor"
    />
  )
  switch (type) {
    case 'quarter':
      return (
        <svg viewBox="0 0 14 24" width="18" height="31" className="inline-block">
          {head(true)}
          {stem}
        </svg>
      )
    case 'half':
      return (
        <svg viewBox="0 0 14 24" width="18" height="31" className="inline-block">
          {head(false)}
          {stem}
        </svg>
      )
    case 'eighth':
      return (
        <svg viewBox="0 0 14 24" width="18" height="31" className="inline-block">
          {head(true)}
          {stem}
          {flag(0)}
        </svg>
      )
    case 'sixteenth':
      return (
        <svg viewBox="0 0 14 24" width="18" height="31" className="inline-block">
          {head(true)}
          {stem}
          {flag(0)}
          {flag(8)}
        </svg>
      )
    case 'beamedPair':
      return (
        <svg viewBox="0 0 22 24" width="30" height="31" className="inline-block">
          {head(true)}
          <ellipse
            cx="15"
            cy="19"
            rx="3.5"
            ry="2.4"
            transform="rotate(-15 15 19)"
            fill="currentColor"
          />
          {stem}
          <rect x="17.2" y="3" width="1.2" height="16" fill="currentColor" />
          <rect x="7.2" y="3" width="11.2" height="2.5" fill="currentColor" />
        </svg>
      )
    default:
      return null
  }
}

const photoLayout = [
  { left: 2, top: 10, width: 30, height: 58 },
  { left: 26, top: 0, width: 24, height: 48 },
  { left: 52, top: 14, width: 28, height: 58 },
  { left: 76, top: 4, width: 20, height: 40 },
  { left: 8, top: 58, width: 22, height: 34 },
  { left: 34, top: 52, width: 23, height: 38 },
  { left: 61, top: 62, width: 20, height: 32 },
  { left: 82, top: 48, width: 16, height: 36 },
]

export default function JoinAyoSection() {
  const openingPhoto = photoMoments[0]

  return (
    <section className="join-ayo-stage relative h-[1500vh] w-full bg-black text-white">
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black" />

        <div className="join-curtain join-curtain-left absolute inset-y-0 left-0 z-30 w-1/2 overflow-hidden bg-black">
          <img
            src={openingPhoto.src}
            alt=""
            className="h-full w-[200%] max-w-none object-cover opacity-90 grayscale"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="join-curtain join-curtain-right absolute inset-y-0 right-0 z-30 w-1/2 overflow-hidden bg-black">
          <img
            src={openingPhoto.src}
            alt=""
            className="ml-[-100%] h-full w-[200%] max-w-none object-cover opacity-90 grayscale"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="join-opening-title pointer-events-none absolute inset-x-6 top-1/2 z-40 mx-auto max-w-4xl -translate-y-1/2 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-white/80">
            Auckland Youth Orchestra
          </p>
          <h1 className="text-5xl font-semibold leading-none sm:text-7xl lg:text-8xl">
            Join the sound.
          </h1>
        </div>

        <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-12 sm:px-8 lg:px-16">
          <div className="join-photo-wrap absolute inset-0 flex items-center justify-center opacity-0">
            <div className="relative h-[74vh] w-full max-w-6xl">
              {photoMoments.map((moment, index) => (
                <figure
                  key={moment.label}
                  className="join-photo-card absolute overflow-hidden bg-black shadow-2xl"
                  style={{
                    left: `${photoLayout[index].left}%`,
                    top: `${photoLayout[index].top}%`,
                    width: `${photoLayout[index].width}%`,
                    height: `${photoLayout[index].height}%`,
                  }}
                >
                  <img
                    src={moment.src}
                    alt={moment.alt}
                    className="h-full w-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 border border-white/18" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_38%,rgba(255,255,255,0.06))]" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/65 to-transparent" />
                  <figcaption className="absolute bottom-4 left-4 right-4 text-xs font-semibold uppercase tracking-[0.26em] text-white">
                    {moment.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="join-copy join-copy-one absolute left-6 top-[18vh] z-20 max-w-xl opacity-0 sm:left-12 lg:left-[10vw]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
              The first rehearsal
            </p>
            <h2 className="text-4xl font-semibold leading-tight sm:text-6xl">
              Sit inside something larger than yourself.
            </h2>
          </div>

          <div className="join-copy join-copy-two absolute bottom-[16vh] right-6 z-20 max-w-xl text-right opacity-0 sm:right-12 lg:right-[10vw]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
              The work
            </p>
            <p className="text-2xl leading-body text-white sm:text-4xl">
              Section by section, phrase by phrase, the orchestra becomes one instrument.
            </p>
          </div>

          <div className="join-score absolute inset-0 z-20 opacity-0 overflow-hidden">
            <div
              className="join-score-timeline absolute inset-y-0 left-0"
              style={{ width: '4400px' }}
            >
              {/* Staff lines — continuous across the full timeline */}
              <div
                className="absolute left-0 right-0 space-y-4"
                style={{ top: 'calc(50% - 34px)' }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-px bg-white/35" style={{ width: '4400px' }} />
                ))}
              </div>

              {/* Treble clef at the start of the staff */}
              <div
                className="join-timeline-clef absolute"
                style={{ left: '16px', top: 'calc(50% - 60px)' }}
              >
                <svg
                  viewBox="10 5 90 190"
                  width="55"
                  height="115"
                  fill="currentColor"
                  className="text-white/70"
                >
                  <path d={trebleClefPath} />
                </svg>
              </div>

              {/* Musical notes scattered along the staff lines */}
              {timelineNotes.map((note, i) => (
                <div
                  key={i}
                  className="join-timeline-note absolute"
                  style={{
                    left: `${note.x}px`,
                    top: `calc(50% - 34px + ${note.line * 17}px)`,
                    transform: 'translateY(-55%)',
                  }}
                >
                  <TimelineNote type={note.type} />
                </div>
              ))}

              {/* Timeline items — float above the staff lines */}
              {timelineMoments.map((moment, i) => {
                const isAbove = i % 2 === 0
                return (
                  <div
                    key={i}
                    className="join-timeline-item absolute w-70"
                    style={{
                      left: `${200 + i * 500}px`,
                      top: isAbove ? '12%' : '64%',
                    }}
                  >
                    <div className="aspect-4/3 overflow-hidden bg-black/60 mb-4 border border-white/15">
                      <img
                        src={moment.src}
                        alt={moment.alt}
                        className="h-full w-full object-cover grayscale"
                      />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.32em] text-white/55">
                      {moment.year}
                    </span>
                    <h3 className="text-xl font-semibold text-white mt-1 leading-tight">
                      {moment.title}
                    </h3>
                    <p className="text-sm text-white/65 mt-1 leading-body">{moment.description}</p>
                  </div>
                )
              })}
            </div>

            {/* Fixed label — bottom-right corner, stays in viewport */}
            <div className="join-timeline-label absolute bottom-8 right-8 z-30 pointer-events-none text-right">
              <span className="text-xs font-semibold uppercase tracking-[0.32em] text-white/55">
                AYO History
              </span>
              <h3 className="text-2xl font-semibold text-white mt-1 leading-tight">
                1959 – Present
              </h3>
            </div>
          </div>

          <div className="join-sections absolute inset-x-6 top-[16vh] z-20 mx-auto grid max-w-5xl gap-4 opacity-0 sm:grid-cols-4">
            {orchestraSections.map((section, idx) => (
              <div key={section} className="join-section-family text-left">
                <div className="mb-4 aspect-4/3 overflow-hidden bg-black/40 join-section-photo-wrap">
                  <img
                    src={sectionPhotos[idx].src}
                    alt={sectionPhotos[idx].alt}
                    className="join-section-photo h-full w-full object-cover"
                  />
                </div>
                <div className="border-t border-white/35 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                    Section
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{section}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="join-crescendo absolute inset-x-6 bottom-[18vh] z-20 mx-auto max-w-4xl text-center opacity-0">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
              Crescendo
            </p>
            <h2 className="text-4xl font-semibold leading-tight sm:text-6xl">
              Everyone arrives at the same breath.
            </h2>
          </div>

          <div className="join-applause absolute inset-0 z-10 opacity-0">
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-white/12 to-transparent" />
            <div className="absolute bottom-[18vh] left-1/2 flex w-[120vw] -translate-x-1/2 items-end justify-center gap-2 opacity-70 sm:gap-3">
              {Array.from({ length: 24 }).map((_, index) => (
                <span
                  key={index}
                  className="join-applause-mark block w-px bg-white/70"
                  style={{
                    height: `${18 + (index % 7) * 9}px`,
                    opacity: 0.2 + (index % 5) * 0.12,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="join-finale absolute inset-x-6 top-[15vh] z-20 mx-auto max-w-4xl text-center opacity-0">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
              After the final note
            </p>
            <h2 className="text-4xl font-semibold leading-tight sm:text-6xl">The room answers.</h2>
          </div>

          <div className="join-register absolute inset-x-6 bottom-[12vh] z-20 mx-auto max-w-3xl border-t border-white/35 pt-7 text-center opacity-0 sm:pt-9">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
              Auditions
            </p>
            <h2 className="text-5xl font-semibold leading-none sm:text-7xl">Register AYO</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-body text-white/82">
              Registrations are currently open until <strong>May 20th, 2026.</strong>
            </p>
            <a
              href="#"
              className="mt-8 inline-flex min-h-12 items-center justify-center border border-white px-7 text-base font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Register for an audition
            </a>
            <div className="mt-8 text-sm leading-body text-white/70">
              <p className="font-semibold text-white">Enquires: Mary Lin, Orchestra Manager</p>
              <a href="mailto:manager@ayo.org.nz" className="underline underline-offset-3">
                manager@ayo.org.nz
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
