'use client'

import { Logout, useNav } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import './index.scss'

type NavItem = {
  /** Collections show a document count; globals are a single document and show none. */
  count?: number
  href: string
  label: string
  slug: string
}
type NavGroup = { label: string; items: NavItem[] }

export const NavClient: React.FC<{ groups: NavGroup[] }> = ({ groups }) => {
  const { navOpen, navRef, setNavOpen } = useNav()
  const pathname = usePathname()
  const [compact, setCompact] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(4)
  const wrapRef = useRef<HTMLDivElement>(null)
  const compactRef = useRef<HTMLDivElement>(null)
  const activeGroup = groups.find((group) =>
    group.items.some((item) => pathname?.startsWith(item.href)),
  )
  const group = groups.find((group) => group.label === selectedGroup) ?? activeGroup ?? groups[0]
  const pageCount = Math.max(1, Math.ceil((group?.items.length ?? 0) / pageSize))
  const currentPage = Math.min(page, pageCount - 1)

  useEffect(() => {
    setSelectedGroup('')
    setPage(0)
  }, [pathname])

  useEffect(() => {
    const element = wrapRef.current
    if (!element) return
    const measure = () => {
      const fullHeight = groups.reduce(
        // Reserve space for each heading and the fixed gap between groups.
        (height, group) => height + 34 + group.items.length * 30,
        140,
      )
      setCompact(element.clientHeight < fullHeight || window.innerWidth < 768)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [groups])

  useEffect(() => {
    const element = compactRef.current
    if (!element) return
    const measure = () => {
      const rowHeight =
        Number.parseFloat(getComputedStyle(element).getPropertyValue('--ayo-compact-row-height')) ||
        44
      setPageSize(Math.max(1, Math.floor((element.clientHeight - 40) / rowHeight)))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    measure()
    return () => observer.disconnect()
  }, [compact])

  function closeOnMobile() {
    if (window.innerWidth < 768) setNavOpen(false)
  }

  function renderLink(item: NavItem) {
    const active = pathname?.startsWith(item.href)
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={closeOnMobile}
        aria-current={active ? 'page' : undefined}
        className={`ayo-nav__link${active ? ' ayo-nav__link--active' : ''}`}
      >
        <span>{item.label}</span>
        {item.count !== undefined && <span className="ayo-nav__count">{item.count}</span>}
      </Link>
    )
  }

  return (
    <div
      className={['nav', 'ayo-nav', navOpen ? 'nav--nav-open' : ''].filter(Boolean).join(' ')}
      ref={navRef}
      role="navigation"
      aria-label="Admin navigation"
      inert={!navOpen}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setNavOpen(false)
      }}
    >
      <button
        type="button"
        className="ayo-nav__mobile-close"
        aria-label="Close navigation"
        onClick={() => setNavOpen(false)}
      >
        ×
      </button>
      <div className={`ayo-nav__wrap${compact ? ' ayo-nav__wrap--compact' : ''}`} ref={wrapRef}>
        <Link href="/admin" className="ayo-nav__logo" onClick={closeOnMobile}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ayo-logo-white.png" alt="AYO" />
        </Link>

        <Link
          href="/admin"
          onClick={closeOnMobile}
          className={`ayo-nav__dashboard${pathname === '/admin' ? ' ayo-nav__dashboard--active' : ''}`}
        >
          Dashboard
        </Link>

        {compact ? (
          <>
            <label className="ayo-nav__section-picker">
              Section
              <select
                value={group?.label ?? ''}
                onChange={(event) => {
                  setSelectedGroup(event.target.value)
                  setPage(0)
                }}
              >
                {groups.map((group) => (
                  <option key={group.label}>{group.label}</option>
                ))}
              </select>
            </label>
            <div className="ayo-nav__compact-links" ref={compactRef}>
              <div>
                {group?.items
                  .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                  .map(renderLink)}
              </div>
              {pageCount > 1 && (
                <div className="ayo-nav__paging" aria-label="Section pages">
                  <button
                    type="button"
                    disabled={currentPage === 0}
                    onClick={() => setPage(currentPage - 1)}
                    aria-label="Previous navigation links"
                  >
                    ↑
                  </button>
                  <span>
                    {currentPage + 1} of {pageCount}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === pageCount - 1}
                    onClick={() => setPage(currentPage + 1)}
                    aria-label="Next navigation links"
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="ayo-nav__groups">
            {groups.map((group) => (
              <div key={group.label} className="ayo-nav__group">
                <span className="ayo-nav__group-label">{group.label}</span>
                {group.items.map(renderLink)}
              </div>
            ))}
          </div>
        )}

        <div className="ayo-nav__controls">
          <Logout />
        </div>
      </div>
    </div>
  )
}

export default NavClient
