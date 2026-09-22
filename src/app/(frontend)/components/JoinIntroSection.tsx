'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { Page } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

type TableRow = Extract<NonNullable<Page['layout']>[number], { blockType: 'table' }>['rows'][number]

{/* Maps the original Tailwind CSS from the hardcoded values to the RichText injection */}
const introConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => (
    <h2 className="intro-fade font-semibold text-[20px] leading-[32px] md:text-[38px] md:leading-[48px]">
      {nodesToJSX({ nodes: node.children })}
    </h2>
  ),
  paragraph: ({ node, nodesToJSX }) => (
    <p className="intro-fade mt-8 text-[18px] leading-6.5 md:text-[20px] md:leading-7 text-[#2E2E2E]">
      {nodesToJSX({ nodes: node.children })}
    </p>
  ),
})

{/* Ensures the correct styling for the table rows including retaining list items in the RichText */}
const tableConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  list: ({ node, nodesToJSX }) => {
    const ListTag = node.tag

    return <ListTag className="list-disc pl-8">{nodesToJSX({ nodes: node.children })}</ListTag>
  },
})

const InfoRowCard = ({ row }: { row: TableRow }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const onEnter = () => gsap.to(el, { scale: 1.005, duration: 0.2, ease: 'power2.out' })
    const onLeave = () => gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.in' })

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="info-row grid grid-cols-1 gap-5 border-b border-[#EBEBEB] px-4 py-7 md:grid-cols-[1.4fr_2fr_0.8fr] md:gap-10 md:px-6 md:py-8 transition-colors hover:bg-gray-50"
    >
      <h3 className="font-semibold text-[24px] leading-7.75 md:text-[26px] md:leading-8.5">
        {row.label}
      </h3>

      <div className="text-[18px] leading-6.25 md:text-[20px] md:leading-7 text-[#2E2E2E]">
        <RichText data={row.content} converters={tableConverters} />
      </div>

      <div className="md:justify-self-end">
        {row.linkLabel && row.linkUrl && (
          <Link
            href={row.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[18px] leading-5.5 font-semibold underline transition-opacity hover:opacity-70"
          >
            {row.linkLabel}
            <img src="/arrow-up-right.svg" alt="" className="h-[1em] w-[1em]" />
          </Link>
        )}
      </div>
    </div>
  )
}

const JoinIntroSection = ({ introText, introRows }: { introText: SerializedEditorState; introRows: TableRow[] }) => {
  const introRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (introRef.current) {
        const introEls = introRef.current.querySelectorAll('.intro-fade')
        const firstIntroEl = introEls[0]
        if (firstIntroEl) {
          gsap.fromTo(
            introEls,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: firstIntroEl,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            },
          )
        }
      }

      if (rowsRef.current) {
        const rows = rowsRef.current.querySelectorAll('.info-row')
        const firstRow = rows[0]
        if (firstRow) {
          gsap.fromTo(
            rows,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: firstRow,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            },
          )
        }
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-white text-black w-full">
      <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 pt-20 md:pt-[92px] pb-16 md:pb-24">
        <div ref={introRef} className="max-w-[1380px]">
          <div className="intro-content">
            <RichText data={introText} converters={introConverters} />
          </div>

          <div ref={rowsRef} className="mt-14 border-t border-[#EBEBEB]">
            {introRows.map((row) => (
              <InfoRowCard key={row.id ?? row.label} row={row} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinIntroSection
