import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'

const BODY = 'text-[18px] leading-6.5 md:text-[20px] md:leading-7 text-[#2E2E2E]'

/**
 * Maps a page section's RichText nodes onto the site's heading/body scale, so copy
 * typed in Payload lands with the same typography as the hardcoded sections.
 *
 * Headings always render as `h2` at the section scale: the page's only `h1` is the
 * Hero's, and an editor choosing `h3` in the CMS shouldn't change the visual size.
 *
 * `fadeClass` is the hook the section's reveal animates (each section uses its own,
 * e.g. `intro-fade` on Join AYO and `concerts-lead-fade` on Concerts & Events).
 */
export const createIntroConverters =
  (fadeClass: string): JSXConvertersFunction<DefaultNodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => (
      <h2
        className={`${fadeClass} font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]`}
      >
        {nodesToJSX({ nodes: node.children })}
      </h2>
    ),
    paragraph: ({ node, nodesToJSX }) => (
      <p className={`${fadeClass} mt-8 first:mt-0 ${BODY}`}>{nodesToJSX({ nodes: node.children })}</p>
    ),
    list: ({ node, nodesToJSX }) => {
      const ListTag = node.tag

      return (
        <ListTag className={`${fadeClass} mt-8 first:mt-0 list-disc pl-8 ${BODY}`}>
          {nodesToJSX({ nodes: node.children })}
        </ListTag>
      )
    },
  })

/**
 * Like `createIntroConverters`, but for a rich-text block nested *inside* a
 * section that already has its own `h2` — the Team section's "Artistic
 * Leadership" / "Executive Committee" blocks, say. Headings render as `h3` at
 * the sub-heading scale, so an editor's choice of level changes neither the
 * visual size nor the page's heading order (the only `h1` is the Hero's).
 */
export const createSubsectionConverters =
  (fadeClass: string): JSXConvertersFunction<DefaultNodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => (
      <h3
        className={`${fadeClass} font-semibold text-[20px] leading-6.5 md:text-[22px] md:leading-7.5`}
      >
        {nodesToJSX({ nodes: node.children })}
      </h3>
    ),
    paragraph: ({ node, nodesToJSX }) => (
      <p className={`${fadeClass} mt-4 first:mt-0 ${BODY}`}>{nodesToJSX({ nodes: node.children })}</p>
    ),
    list: ({ node, nodesToJSX }) => {
      const ListTag = node.tag

      return (
        <ListTag className={`${fadeClass} mt-4 first:mt-0 list-disc pl-8 ${BODY}`}>
          {nodesToJSX({ nodes: node.children })}
        </ListTag>
      )
    },
  })

/**
 * Converters for the rich text inside a table row's content cell. The cell itself
 * carries the body type, so only the list needs its bullets and indent back.
 */
export const tableRowConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className="mb-4 last:mb-0">{nodesToJSX({ nodes: node.children })}</p>
  ),
  list: ({ node, nodesToJSX }) => {
    const ListTag = node.tag

    return <ListTag className="list-disc pl-8">{nodesToJSX({ nodes: node.children })}</ListTag>
  },
})
