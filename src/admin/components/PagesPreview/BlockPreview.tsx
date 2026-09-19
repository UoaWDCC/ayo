'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { useMediaUrl } from './useMediaUrl'

// Live form-state richText values aren't typed further than `unknown` at this layer.
type RichTextData = Parameters<typeof RichText>[0]['data']
type AnyBlock = { blockType?: string; id?: string } & Record<string, unknown>

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function HeroPreview({ block, pageTitle }: { block: AnyBlock; pageTitle: string }) {
  const image = useMediaUrl(block.backgroundImage)
  return (
    <div className="ayo-block-preview__hero">
      {image?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.url} alt={image.alt || ''} />
      ) : (
        <div className="ayo-block-preview__hero-empty" />
      )}
      <div className="ayo-block-preview__hero-scrim" />
      <h1>{pageTitle || 'Untitled page'}</h1>
    </div>
  )
}

function RichTextPreview({ block }: { block: AnyBlock }) {
  return (
    <div className="ayo-block-preview__richtext">
      <RichText data={block.content as RichTextData} />
    </div>
  )
}

function VideoPreview({ block }: { block: AnyBlock }) {
  const embed = typeof block.videoUrl === 'string' ? youtubeEmbedUrl(block.videoUrl) : null
  return (
    <div className="ayo-block-preview__video">
      {embed ? (
        <div className="ayo-block-preview__video-frame">
          <iframe src={embed} title={(block.text as string) || 'Video'} allowFullScreen />
        </div>
      ) : (
        <div className="ayo-block-preview__video-empty">No video URL set</div>
      )}
      {block.text ? <p>{block.text as string}</p> : null}
    </div>
  )
}

function QuotePreview({ block }: { block: AnyBlock }) {
  const image = useMediaUrl(block.image)
  return (
    <div className="ayo-block-preview__quote">
      {image?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.url} alt={image.alt || ''} />
      ) : (
        <div className="ayo-block-preview__quote-empty" />
      )}
      <div className="ayo-block-preview__quote-scrim" />
      {block.caption ? (
        <p className="ayo-block-preview__quote-caption">{block.caption as string}</p>
      ) : null}
      <p className="ayo-block-preview__quote-text">&ldquo;{(block.text as string) || ''}&rdquo;</p>
    </div>
  )
}

function ImagePreview({ block }: { block: AnyBlock }) {
  const image = useMediaUrl(block.image)
  return (
    <div className="ayo-block-preview__image">
      {image?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.url} alt={image.alt || ''} />
      ) : (
        <div className="ayo-block-preview__image-empty" />
      )}
    </div>
  )
}

function TablePreview({ block }: { block: AnyBlock }) {
  const rows =
    (block.rows as { label?: string; content?: unknown; linkLabel?: string; linkUrl?: string }[]) ||
    []
  return (
    <div className="ayo-block-preview__table">
      {rows.map((row, i) => (
        <div className="ayo-block-preview__table-row" key={i}>
          <h3>{row.label || 'Untitled row'}</h3>
          <div className="ayo-block-preview__table-content">
            <RichText data={row.content as RichTextData} />
          </div>
          {row.linkLabel ? (
            <a href={row.linkUrl || '#'} onClick={(e) => e.preventDefault()}>
              {row.linkLabel}
            </a>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function FaqItemPreview({ question, answer }: { answer: unknown; question: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="ayo-block-preview__faq-item">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{question || 'Untitled question'}</span>
        <span
          className={
            open
              ? 'ayo-block-preview__faq-chevron ayo-block-preview__faq-chevron--open'
              : 'ayo-block-preview__faq-chevron'
          }
        >
          ▾
        </span>
      </button>
      {open ? (
        <div className="ayo-block-preview__faq-answer">
          <RichText data={answer as RichTextData} />
        </div>
      ) : null}
    </div>
  )
}

function FaqPreview({ block }: { block: AnyBlock }) {
  const items = (block.items as { answer?: unknown; question?: string }[]) || []
  return (
    <div className="ayo-block-preview__faq">
      {items.map((item, i) => (
        <FaqItemPreview key={i} question={item.question || ''} answer={item.answer} />
      ))}
    </div>
  )
}

export function BlockPreview({ block, pageTitle }: { block: AnyBlock; pageTitle: string }) {
  switch (block.blockType) {
    case 'hero':
      return <HeroPreview block={block} pageTitle={pageTitle} />
    case 'rich-text':
      return <RichTextPreview block={block} />
    case 'video':
      return <VideoPreview block={block} />
    case 'quote':
      return <QuotePreview block={block} />
    case 'image':
      return <ImagePreview block={block} />
    case 'table':
      return <TablePreview block={block} />
    case 'faq':
      return <FaqPreview block={block} />
    default:
      return null
  }
}

export default BlockPreview
