import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import NextImage from 'next/image'

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const uploadDoc = node.value

    if (!uploadDoc || typeof uploadDoc !== 'object') return null

    const { alt, url, width, height } = uploadDoc as {
      alt?: string
      url?: string
      width?: number
      height?: number
    }

    if (!url) return null

    return (
      <div className="my-8 flex justify-center">
        <NextImage
          src={url}
          alt={alt ?? ''}
          width={width ?? 800}
          height={height ?? 600}
          className="h-auto max-w-full rounded"
        />
      </div>
    )
  },
})

export function RichText({ data }: { data: SerializedEditorState }) {
  return <PayloadRichText data={data} converters={jsxConverters} />
}
