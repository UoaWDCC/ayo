'use client'

import { useRef } from 'react'

type AboutUsQuoteVideoProps = {
  quote: string
  /** Still frame shown before hover / while the video is unavailable. */
  posterImage?: string
  /** Short muted clip that plays on hover. Optional — falls back to a static poster if omitted. */
  videoSrc?: string
  /** Full performance video the block links out to on click. */
  youtubeUrl: string
}

/**
 * Hover-to-preview quote block for the About Us page.
 *
 * - Hover: plays `videoSrc` muted/looped behind the quote (if provided).
 * - Click: opens `youtubeUrl` in a new tab.
 *
 * TODO(design): swap `posterImage` / `videoSrc` for the real AYO performance
 * assets once they're available. Until then this renders a dark placeholder
 * block so the layout can be reviewed as-is.
 */
const AboutUsQuoteVideo = ({
  quote,
  posterImage,
  videoSrc,
  youtubeUrl,
}: AboutUsQuoteVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {
      // Autoplay can be blocked in some browsers — safe to ignore, poster still shows.
    })
  }

  const handleMouseLeave = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  return (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative block aspect-[16/6] w-full overflow-hidden"
      aria-label="Watch the full AYO performance video on YouTube"
    >
      {/* PLACEHOLDER */}
      {videoSrc ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterImage}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : posterImage ? (
        <img
          src={posterImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        // PLACEHOLDER
        <div className="absolute inset-0 bg-neutral-800" />
      )}

      <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />

      <div className="relative z-10 flex h-full items-end justify-end p-6 md:p-10">
        <p className="w-full md:w-1/3 text-right text-white text-2xl md:text-3xl leading-snug">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </a>
  )
}

export default AboutUsQuoteVideo
