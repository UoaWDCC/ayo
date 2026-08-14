import type { Block } from 'payload'

/**
 * Video block:
 *
 * Used to embed a video from an external source (e.g., YouTube, Vimeo).
 * * - text: Taken from YouTube, no manual entry
 * - videoUrl: YouTube URL of the video to embed
 
 */

export const VideoBlock: Block = {
  slug: 'video',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: false,
    },
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
    },
  ],
}
