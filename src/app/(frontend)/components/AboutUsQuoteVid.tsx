'use client'

import { useRef } from 'react'

type AboutUsQuoteVideoProps = {
  quote: string
  /** still frame shows before hover. */
  posterImage?: string
  /** gif that plays on hover. goes back to a static poster if you go off */
  videoSrc?: string
  /** full performance video the block links out to after clicking */
  youtubeUrl: string
}

/**
 * Hover-to-preview quote block for the About Us page.
 * TODO: swap `posterImage` / `videoSrc` later
 * temporary dark placeholder
 */
const AboutUsQuoteVideo = ({
  quote,
  posterImage,
  videoSrc,
  youtubeUrl,
}: AboutUsQuoteVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {})
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

      <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/10" />

      <div className="relative z-10 flex h-full items-end justify-end p-6 md:p-10">
        <p className="w-full md:w-1/2 text-right text-white text-3xl md:text-5xl leading-snug">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </a>
  )
}

export default AboutUsQuoteVideo
