'use client'

import { useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Phones resize the viewport as the address bar shows and hides while scrolling; a
// refresh on each of those would make the scrubbed stage jump.
ScrollTrigger.config({ ignoreMobileResize: true })

// Scroll distance given to one unit of the timeline below. The stage's height is
// derived from this, so a longer history adds scroll rather than speeding up the rest.
const VH_PER_UNIT = 87
// How fast the history staff slides past, in pixels per timeline unit.
const SCORE_PX_PER_UNIT = 1100
// Where the history scene starts. Scenes after it were laid out for a staff lasting
// SCORE_BASE_DURATION, and are pushed back by however much longer the real one runs.
const SCORE_START = 7.5
const SCORE_BASE_DURATION = 1.85
// Rise for text entering, matching the site-wide section reveal.
const TEXT_RISE = 40
// How far the view zooms in on the photo board, from its first photo to the moment
// it has faded out (its fade-out at 7.1 lasts 0.8).
const BOARD_ZOOM = 1.3
const BOARD_FADE_END = 7.9

/**
 * The Join AYO stage: renders the tall section and drives every scene inside it
 * from one scroll-scrubbed timeline, on phones as well as desktop (the markup lays
 * itself out for portrait below md). Under reduced motion we hand off to the static
 * layout in styles.css (`.join-static`) instead.
 */
export default function ScrollAnimation({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const stageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    let context: gsap.Context | undefined
    const staticQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    // Phones and desktop show different numbers of collage photos, so the photo
    // stagger is rebuilt when the screen crosses the md breakpoint.
    const wideQuery = window.matchMedia('(min-width: 768px)')

    const buildAnimation = () => {
      context?.revert()
      context = undefined

      if (staticQuery.matches) {
        stage.classList.add('join-static')
        ScrollTrigger.refresh()
        return
      }

      stage.classList.remove('join-static')

      context = gsap.context(() => {
        const q = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, stage)

        const scoreTimeline = q('.join-score-timeline')[0]
        const scoreWidth = scoreTimeline?.offsetWidth ?? 0
        const scoreDuration = Math.max(1.5, scoreWidth / SCORE_PX_PER_UNIT)
        const at = (position: number) => position + scoreDuration - SCORE_BASE_DURATION
        // Each milestone and note appears as the staff carries it into view, rather
        // than all at once while most of them are still off screen.
        const scoreTime = (el: HTMLElement) =>
          SCORE_START + scoreDuration * (scoreWidth ? el.offsetLeft / scoreWidth : 0)

        // One move per kind of thing. Text rises in like the site's section reveal
        // (StaggerReveal: y 40, power2.out) and leaves by fading only; everything
        // else just fades. The curtains and the staff are the only things that travel.
        const textIn = (targets: HTMLElement[], position: number) =>
          timeline.to(targets, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, position)
        const fadeIn = (targets: HTMLElement[], position: number, stagger = 0) =>
          timeline.to(targets, { autoAlpha: 1, duration: 1, stagger, ease: 'power2.out' }, position)
        const fadeOut = (targets: HTMLElement[], position: number) =>
          timeline.to(targets, { autoAlpha: 0, duration: 0.8, ease: 'power1.in' }, position)

        const text = [
          '.join-copy-one',
          '.join-copy-two',
          '.join-timeline-label',
          '.join-crescendo',
          '.join-finale',
          '.join-register',
        ]
        const faded = [
          '.join-photo-wrap',
          '.join-photo-card',
          '.join-score',
          '.join-timeline-item',
          '.join-timeline-note',
          '.join-timeline-clef',
          '.join-sections',
          '.join-section-family',
          '.join-scene-backdrop',
        ]
        gsap.set(q('.join-curtain-left, .join-curtain-right'), { xPercent: 0 })
        gsap.set(q('.join-opening-title'), { autoAlpha: 1 })
        gsap.set(q(text.join(', ')), { autoAlpha: 0, y: TEXT_RISE })
        gsap.set(q(faded.join(', ')), { autoAlpha: 0 })
        gsap.set(scoreTimeline ?? [], { x: () => window.innerWidth / 2 - 16 })

        const timeline = gsap.timeline({ defaults: { ease: 'none' }, paused: true })

        // Opening: the title goes, then the curtains part on the collage.
        fadeOut(q('.join-opening-title'), 0.45)
        timeline
          .to(
            q('.join-curtain-left'),
            { xPercent: -100, duration: 2.2, ease: 'power2.inOut' },
            0.95,
          )
          .to(
            q('.join-curtain-right'),
            { xPercent: 100, duration: 2.2, ease: 'power2.inOut' },
            0.95,
          )

        // Collage: photos arrive one after another and hold still under the copy.
        fadeIn(q('.join-photo-wrap'), 1.5)
        // However many photos there are, the board finishes filling in the same stretch.
        // The view zooms in on it from the first photo until the board has faded out,
        // easing off as it goes: quick while the photos arrive, then slower and slower
        // under the copy, never stopping while the board is visible.
        // Only the photos this screen shows (phones hide the later ones).
        const photoCards = q('.join-photo-card').filter((card) => card.offsetParent !== null)
        fadeIn(photoCards, 1.9, Math.min(0.18, 1.4 / Math.max(photoCards.length, 1)))
        timeline.fromTo(
          q('.join-photo-grid'),
          { scale: 1, transformOrigin: '50% 50%' },
          { scale: BOARD_ZOOM, duration: BOARD_FADE_END - 1.9, ease: 'power1.out' },
          1.9,
        )
        textIn(q('.join-copy-one'), 3.35)
        fadeOut(q('.join-copy-one'), 5)
        textIn(q('.join-copy-two'), 5.9)
        fadeOut(q('.join-copy-two'), 7.05)
        fadeOut(q('.join-photo-wrap'), 7.1)

        // History: the staff slides past and its milestones fade in on arrival.
        fadeIn(q('.join-score'), 7.35)
        textIn(q('.join-timeline-label'), SCORE_START)
        fadeIn(q('.join-timeline-clef'), SCORE_START)
        timeline.fromTo(
          scoreTimeline ?? [],
          { x: () => window.innerWidth / 2 - 16 },
          { x: () => -(scoreWidth - window.innerWidth), duration: scoreDuration, ease: 'none' },
          SCORE_START,
        )
        q('.join-timeline-item, .join-timeline-note').forEach((el) => fadeIn([el], scoreTime(el)))
        fadeOut(q('.join-score, .join-timeline-label'), at(9.35))

        // Sections, then the closing lines and the call to action.
        fadeIn(q('.join-sections'), at(9.85))
        fadeIn(q('.join-section-family'), at(10.1), 0.12)
        fadeOut(q('.join-sections'), at(11.55))
        // Each closing line sits on its own full-screen photo, which arrives just
        // ahead of the line and leaves with it.
        fadeIn(q('.join-crescendo-backdrop'), at(11.55))
        textIn(q('.join-crescendo'), at(11.85))
        fadeOut(q('.join-crescendo, .join-crescendo-backdrop'), at(13.25))
        fadeIn(q('.join-finale-backdrop'), at(13.65))
        textIn(q('.join-finale'), at(14.25))
        fadeOut(q('.join-finale, .join-finale-backdrop'), at(15.5))
        fadeIn(q('.join-register-backdrop'), at(15.65))
        textIn(q('.join-register'), at(16.05))

        // Size the stage to the timeline before the trigger measures it.
        gsap.set(stage, { height: `${Math.round(timeline.duration() * VH_PER_UNIT)}vh` })

        ScrollTrigger.create({
          animation: timeline,
          trigger: stage,
          start: 'top top',
          end: 'bottom bottom',
          // SmoothScroll already eases the scroll position, so follow it directly;
          // a numeric scrub here would add a second lag on top.
          scrub: true,
          // Re-run the window-width based staff positions after a resize.
          invalidateOnRefresh: true,
        })
      }, stage)

      ScrollTrigger.refresh()
    }

    buildAnimation()
    staticQuery.addEventListener('change', buildAnimation)
    wideQuery.addEventListener('change', buildAnimation)

    return () => {
      staticQuery.removeEventListener('change', buildAnimation)
      wideQuery.removeEventListener('change', buildAnimation)
      context?.revert()
      stage.classList.remove('join-static')
    }
  }, [])

  return (
    <section ref={stageRef} className={`join-ayo-stage ${className}`.trim()}>
      {children}
    </section>
  )
}
