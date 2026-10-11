'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import type { Page } from '@/payload-types'
import { tableRowConverters } from './richTextConverters'

gsap.registerPlugin(ScrollTrigger)

export type TableRow = Extract<
  NonNullable<Page['layout']>[number],
  { blockType: 'table' }
>['rows'][number]

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
      className="info-row grid grid-cols-1 gap-4 border-b border-[#EBEBEB] px-4 py-5 md:grid-cols-[1fr_2.8fr_0.9fr] md:gap-8 md:px-6 md:py-6 transition-colors hover:bg-gray-50"
    >
      <h3 className="font-semibold text-[20px] leading-6.5 md:text-[22px] md:leading-7.5">
        {row.label}
      </h3>

      <div className="text-[16px] leading-5.5 md:text-[18px] md:leading-6.5 text-[#2E2E2E]">
        <RichText data={row.content} converters={tableRowConverters} />
      </div>

      <div className="md:justify-self-end">
        {row.linkLabel && row.linkUrl && (
          <Link
            href={row.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[16px] leading-5 font-semibold underline transition-opacity hover:opacity-70"
          >
            {row.linkLabel}
            <Image
              src="/arrow-up-right.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="h-[1em] w-[1em]"
            />
          </Link>
        )}
      </div>
    </div>
  )
}

/**
 * The site's table-block presentation: a bordered list of label / content / link
 * rows that stagger in on scroll. Shared by every page rendering a Payload
 * `table` block, so the rows stay identical across them.
 */
const InfoRowList = ({ rows, className }: { rows: TableRow[]; className?: string }) => {
  const rowsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rowsRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('.info-row')
      const firstRow = items[0]
      if (!firstRow) return

      gsap.fromTo(
        items,
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
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rowsRef} className={`border-t border-[#EBEBEB] ${className ?? ''}`}>
      {rows.map((row) => (
        <InfoRowCard key={row.id ?? row.label} row={row} />
      ))}
    </div>
  )
}

export default InfoRowList
