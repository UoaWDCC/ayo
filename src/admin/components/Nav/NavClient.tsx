'use client'

import { Logout, useNav } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import './index.scss'

type NavGroup = { label: string; items: { count: number; label: string; slug: string }[] }

export const NavClient: React.FC<{ groups: NavGroup[] }> = ({ groups }) => {
  const { navOpen, navRef } = useNav()
  const pathname = usePathname()

  return (
    <div className={['nav', 'ayo-nav', navOpen ? 'nav--nav-open' : ''].filter(Boolean).join(' ')} ref={navRef}>
      <div className="ayo-nav__wrap">
        <Link href="/admin" className="ayo-nav__logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ayo-logo-black-bgwhite.png" alt="AYO" />
        </Link>

        <Link href="/admin" className={`ayo-nav__dashboard${pathname === '/admin' ? ' ayo-nav__dashboard--active' : ''}`}>
          Dashboard
        </Link>

        <div className="ayo-nav__groups">
          {groups.map((group) => (
            <div key={group.label} className="ayo-nav__group">
              <span className="ayo-nav__group-label">{group.label}</span>
              {group.items.map((item) => {
                const href = `/admin/collections/${item.slug}`
                const active = pathname?.startsWith(href)
                return (
                  <Link key={item.slug} href={href} className={`ayo-nav__link${active ? ' ayo-nav__link--active' : ''}`}>
                    <span>{item.label}</span>
                    <span className="ayo-nav__count">{item.count}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        <div className="ayo-nav__controls">
          <Logout />
        </div>
      </div>
    </div>
  )
}

export default NavClient
