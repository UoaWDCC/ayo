import type React from 'react'
import Image from 'next/image'
import Button from '../Button'
import ScrollAnimation from './ScrollAnimation'
import { safeHref } from '@/lib/urls'
import type { Media, Page } from '@/payload-types'

export type JoinStageBlock = Extract<
  NonNullable<Page['layout']>[number],
  { blockType: 'join-stage' }
>

const PLACEHOLDER = '/grey_rectangle.png'

/** A populated Media doc's URL and alt text, or the grey placeholder while a photo is unset. */
function photo(image: Media | string | null | undefined, fallbackAlt: string) {
  if (typeof image === 'object' && image?.url) {
    return { src: image.url, alt: image.alt || fallbackAlt }
  }
  return { src: PLACEHOLDER, alt: fallbackAlt }
}

function Eyebrow({ children, className = '' }: { children?: string | null; className?: string }) {
  if (!children) return null
  return (
    <p
      className={`mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-white/65 ${className}`}
    >
      {children}
    </p>
  )
}

/**
 * A full-screen photo behind a single heading, darkened from the edge the heading
 * sits against so the text reads on any photo. Renders nothing when unset.
 */
function SceneBackdrop({
  image,
  className,
  fadeFrom,
}: {
  image: Media | string | null | undefined
  className: string
  fadeFrom: 'top' | 'bottom'
}) {
  if (typeof image !== 'object' || !image?.url) return null
  return (
    <div className={`join-scene-backdrop ${className} absolute inset-0 z-10 opacity-0`}>
      <Image
        src={image.url}
        alt={image.alt || ''}
        fill
        sizes="100vw"
        className="object-cover grayscale"
      />
      <div
        className={`join-scene-backdrop-fade absolute inset-0 ${
          fadeFrom === 'bottom'
            ? 'bg-linear-to-t from-black via-black/70 via-35% to-transparent to-75%'
            : 'bg-linear-to-b from-black via-black/70 via-35% to-transparent to-75%'
        }`}
      />
    </div>
  )
}

// Staff-width maths: milestone i sits at 200 + i * 500px and the staff runs
// 200px past the last one. ScrollAnimation reads the rendered width back.
const MILESTONE_SPACING = 500
const STAFF_PADDING = 200
// The five staff lines span 69px centred on the stage (top at 50% - 34px).
const STAFF_HALF_HEIGHT = 35
// Clear space between a milestone card and the nearest staff line, past note stems.
const CARD_GAP = 40

// Behind copy that sits over photos (the collage, passing milestones), so it stays legible.
const copyScrim =
  "before:pointer-events-none before:absolute before:-inset-x-12 before:-inset-y-10 before:-z-10 before:bg-[radial-gradient(closest-side,rgba(0,0,0,0.78),transparent)] before:content-['']"

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

// The collage is a board of loosely pinned photos covering the whole screen. The
// photos are spread over rows to suit the screen's shape (`aspect` is its width over
// its height), each sized a little over its cell so it overlaps its neighbours, then
// nudged and angled by a fixed per-photo amount so the board looks pinned, not gridded.
// Later photos land on top, covering their neighbours' right and bottom edges,
// which is why labels sit top left. Values are percentages of the screen.
const MAX_PHOTOS = 24
// Phones show only the first photos, laid out for a portrait screen.
const PHONE_PHOTOS = 12
const WIDE_ASPECT = 1.6
const PHONE_ASPECT = 0.46
const CARD_OVERSIZE = 1.3

function boardLayout(count: number, aspect: number) {
  const rows = Math.max(1, Math.round(Math.sqrt(count / aspect)))
  const perRow = Array.from(
    { length: rows },
    (_, row) => Math.floor(count / rows) + (row < count % rows ? 1 : 0),
  )
  return perRow.flatMap((columns, row) =>
    Array.from({ length: columns }, (_, column) => {
      const index = perRow.slice(0, row).reduce((sum, n) => sum + n, 0) + column
      const cellWidth = 100 / columns
      const cellHeight = 100 / rows
      const width = cellWidth * CARD_OVERSIZE
      const height = cellHeight * CARD_OVERSIZE
      // Fixed pseudo-random offsets in [-1, 1], so the board is the same on every load.
      const jitterX = (((index * 37) % 11) - 5) / 5
      const jitterY = (((index * 23) % 9) - 4) / 4
      const angle = (((index * 53) % 13) - 6) / 6
      return {
        left: column * cellWidth - (width - cellWidth) / 2 + jitterX * cellWidth * 0.08,
        top: row * cellHeight - (height - cellHeight) / 2 + jitterY * cellHeight * 0.08,
        width,
        height,
        rotate: angle === 0 ? 2 : angle * 6,
      }
    }),
  )
}

export default function JoinAyoBlock({ block }: { block: JoinStageBlock }) {
  const { opening, collage, history, sections, crescendo, finale, register } = block
  const photos = (collage?.photos ?? []).slice(0, MAX_PHOTOS)
  const board = boardLayout(photos.length, WIDE_ASPECT)
  const phoneBoard = boardLayout(Math.min(photos.length, PHONE_PHOTOS), PHONE_ASPECT)
  const milestones = history?.milestones ?? []
  const sectionItems = sections?.items ?? []
  const curtain = photo(opening?.curtainImage, '')
  const staffWidth = STAFF_PADDING * 2 + milestones.length * MILESTONE_SPACING
  const buttonHref = safeHref(register?.buttonUrl, { allowSitePath: true })
  const buttonExternal = Boolean(buttonHref && !buttonHref.startsWith('/'))

  return (
    <ScrollAnimation className="relative h-[1500vh] w-full bg-black text-white">
      <div className="join-stage-inner sticky top-0 min-h-svh overflow-hidden">
        <div className="join-stage-backdrop absolute inset-0 bg-black" />

        <div className="join-curtain join-curtain-left absolute inset-y-0 left-0 z-30 w-1/2 overflow-hidden bg-black">
          <Image
            src={curtain.src}
            alt=""
            width={1600}
            height={900}
            priority
            className="h-full w-[200%] max-w-none object-cover opacity-90 grayscale"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="join-curtain join-curtain-right absolute inset-y-0 right-0 z-30 w-1/2 overflow-hidden bg-black">
          <Image
            src={curtain.src}
            alt=""
            width={1600}
            height={900}
            priority
            className="ml-[-100%] h-full w-[200%] max-w-none object-cover opacity-90 grayscale"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="join-opening-title pointer-events-none absolute inset-x-6 top-1/2 z-40 mx-auto max-w-4xl -translate-y-1/2 text-center">
          <h2 className="text-5xl font-semibold leading-none sm:text-7xl lg:text-8xl">
            {opening?.heading}
          </h2>
        </div>

        <div className="join-scenes relative z-10 flex min-h-svh w-full items-center justify-center px-5 py-12 sm:px-8 lg:px-16">
          <div className="join-photo-wrap absolute inset-0 opacity-0">
            <div className="join-photo-grid relative h-full w-full">
              {photos.map((moment, index) => {
                const image = photo(moment.image, moment.label ?? 'AYO musicians')
                return (
                  <figure
                    key={moment.id ?? index}
                    className={`join-photo-card absolute left-(--phone-left) top-(--phone-top) h-(--phone-height) w-(--phone-width) overflow-hidden bg-black shadow-[0_12px_32px_rgba(0,0,0,0.6)] md:left-(--wide-left) md:top-(--wide-top) md:h-(--wide-height) md:w-(--wide-width) ${
                      index >= PHONE_PHOTOS ? 'max-md:hidden' : ''
                    }`}
                    style={
                      {
                        '--wide-left': `${board[index].left}%`,
                        '--wide-top': `${board[index].top}%`,
                        '--wide-width': `${board[index].width}%`,
                        '--wide-height': `${board[index].height}%`,
                        ...(phoneBoard[index] && {
                          '--phone-left': `${phoneBoard[index].left}%`,
                          '--phone-top': `${phoneBoard[index].top}%`,
                          '--phone-width': `${phoneBoard[index].width}%`,
                          '--phone-height': `${phoneBoard[index].height}%`,
                        }),
                        // The CSS rotate property, so it survives GSAP's opacity tweens.
                        rotate: `${board[index].rotate}deg`,
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={480}
                      height={360}
                      className="h-full w-full object-cover grayscale"
                    />
                    {moment.label && (
                      <>
                        <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/65 to-transparent" />
                        <figcaption className="absolute left-3 right-3 top-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-white">
                          {moment.label}
                        </figcaption>
                      </>
                    )}
                  </figure>
                )
              })}
            </div>
          </div>

          <div
            className={`join-copy join-copy-one absolute left-6 top-[18vh] z-20 max-w-xl opacity-0 sm:left-12 lg:left-[10vw] ${copyScrim}`}
          >
            <h2 className="text-4xl font-semibold leading-tight sm:text-6xl">
              {collage?.firstLine?.heading}
            </h2>
          </div>

          <div
            className={`join-copy join-copy-two absolute bottom-[16vh] right-6 z-20 max-w-xl text-right opacity-0 sm:right-12 lg:right-[10vw] ${copyScrim}`}
          >
            <p className="text-2xl leading-body text-white sm:text-4xl">
              {collage?.secondLine?.text}
            </p>
          </div>

          <div className="join-score absolute inset-0 z-20 opacity-0 overflow-hidden">
            <div
              className="join-score-timeline absolute inset-y-0 left-0"
              style={{ width: `${staffWidth}px` }}
            >
              {/* Staff lines — continuous across the full timeline */}
              <div
                className="join-staff-lines absolute left-0 right-0 space-y-4"
                style={{ top: 'calc(50% - 34px)' }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-px w-full bg-white/35" />
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
                  aria-hidden="true"
                >
                  <path d={trebleClefPath} />
                </svg>
              </div>

              {/* Musical notes scattered along the staff lines */}
              {timelineNotes
                .filter((note) => note.x < staffWidth - STAFF_PADDING / 2)
                .map((note, i) => (
                  <div
                    key={i}
                    className="join-timeline-note absolute"
                    aria-hidden="true"
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
              {milestones.map((moment, i) => {
                const isAbove = i % 2 === 0
                const image = photo(moment.image, `${moment.year} ${moment.title}`)
                return (
                  <div
                    key={moment.id ?? i}
                    className="join-timeline-item absolute w-48 sm:w-60 [@media(max-height:720px)]:w-44"
                    style={{
                      left: `${STAFF_PADDING + i * MILESTONE_SPACING}px`,
                      // Anchored to the staff's edges so a card never reaches the lines,
                      // however tall its text runs: upper cards grow up, lower ones down.
                      ...(isAbove
                        ? { bottom: `calc(50% + ${STAFF_HALF_HEIGHT + CARD_GAP}px)` }
                        : { top: `calc(50% + ${STAFF_HALF_HEIGHT + CARD_GAP}px)` }),
                    }}
                  >
                    <div className="aspect-4/3 overflow-hidden bg-black/60 mb-4 border border-white/15">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover grayscale"
                      />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.32em] text-white/55">
                      {moment.year}
                    </span>
                    <h3 className="text-xl font-semibold text-white mt-1 leading-tight">
                      {moment.title}
                    </h3>
                    {moment.description && (
                      <p className="text-sm text-white/65 mt-1 leading-body [@media(max-height:720px)]:hidden">
                        {moment.description}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Fixed label, stays in viewport: bottom right on desktop; top left on phones,
                where the lower milestone cards reach the bottom corner. */}
            <div
              className={`join-timeline-label absolute left-6 top-4 md:left-auto md:top-auto md:bottom-5 md:right-8 z-30 pointer-events-none text-left md:text-right ${copyScrim}`}
            >
              {history?.eyebrow && (
                <span className="[@media(max-height:720px)]:hidden text-xs font-semibold uppercase tracking-[0.32em] text-white/55">
                  {history.eyebrow}
                </span>
              )}
              <h3 className="text-2xl font-semibold text-white mt-1 leading-tight">
                {history?.heading}
              </h3>
            </div>
          </div>

          <div className="join-sections absolute inset-x-6 inset-y-0 z-20 mx-auto my-auto grid h-fit max-w-5xl grid-cols-2 gap-x-4 gap-y-6 opacity-0 sm:grid-cols-4 sm:gap-4">
            {sectionItems.map((section, idx) => {
              const image = photo(section.image, `${section.name} section`)
              return (
                <div key={section.id ?? idx} className="join-section-family text-left">
                  <div className="mb-4 aspect-4/3 overflow-hidden bg-black/40 join-section-photo-wrap">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={300}
                      className="join-section-photo h-full w-full object-cover"
                    />
                  </div>
                  <div className="border-t border-white/35 pt-4">
                    <h3 className="text-xl font-semibold text-white sm:text-3xl">{section.name}</h3>
                    {section.description && (
                      <p className="mt-2 text-xs leading-body text-white/65 sm:text-sm">
                        {section.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <SceneBackdrop
            className="join-crescendo-backdrop"
            image={crescendo?.image}
            fadeFrom="bottom"
          />
          <div className="join-crescendo absolute inset-x-6 bottom-[18vh] z-20 mx-auto max-w-4xl text-center opacity-0">
            <h2 className="text-4xl font-semibold leading-tight sm:text-6xl">
              {crescendo?.heading}
            </h2>
          </div>

          <SceneBackdrop className="join-finale-backdrop" image={finale?.image} fadeFrom="top" />

          <div className="join-finale absolute inset-x-6 top-[15vh] z-20 mx-auto max-w-4xl text-center opacity-0">
            <h2 className="text-4xl font-semibold leading-tight sm:text-6xl">{finale?.heading}</h2>
          </div>

          <SceneBackdrop
            className="join-register-backdrop"
            image={register?.image}
            fadeFrom="bottom"
          />

          <div className="join-register absolute inset-x-6 bottom-[12vh] z-20 mx-auto max-w-3xl border-t border-white/35 pt-7 text-center opacity-0 sm:pt-9">
            <Eyebrow className="mb-5">{register?.eyebrow}</Eyebrow>
            <h2 className="text-5xl font-semibold leading-none sm:text-7xl">{register?.heading}</h2>
            {register?.body && (
              <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-lg leading-body text-white/82">
                {register.body}
              </p>
            )}
            {buttonHref && register?.buttonLabel && (
              <Button href={buttonHref} external={buttonExternal} variant="white" className="mt-8">
                {register.buttonLabel}
              </Button>
            )}
            {(register?.contactName || register?.contactEmail) && (
              <div className="mt-8 text-sm leading-body text-white/70">
                {register.contactName && (
                  <p className="font-semibold text-white">Enquiries: {register.contactName}</p>
                )}
                {register.contactEmail && (
                  <a
                    href={`mailto:${register.contactEmail}`}
                    className="underline transition-opacity hover:opacity-70"
                  >
                    {register.contactEmail}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollAnimation>
  )
}
