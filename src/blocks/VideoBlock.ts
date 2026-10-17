import type { Block } from 'payload'

/**
 * Video block:
 *
 * Used to embed a video from an external source (e.g., YouTube, Vimeo).
 * - text: Optional manual override for the video title.
 *   NOTE: Ideally this should be "no manual entry" and auto-populate from
 *   YouTube (per original schema), but left as optional manual entry for now
 *   since the auto-populate method (Payload hook vs frontend fetch) hasn't
 *   been decided yet. Frontend should fall back to fetching the title from
 *   YouTube's oEmbed data if this field is empty. To be revisited.
 * - videoUrl: YouTube URL of the video to embed
 
 */

export const VideoBlock: Block = {
  slug: 'video',
  fields: [
    {
      name: 'text',
      label: 'Video caption',
      type: 'text',
      required: false,
    },
    {
      name: 'videoUrl',
      label: 'Video URL',
      type: 'text',
      required: true,
      admin: { description: 'Paste the full YouTube link for the video.' },
    },
  ],
}
