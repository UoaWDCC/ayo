import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { NavClient } from './NavClient'

const setNavOpen = vi.hoisted(() => vi.fn())
vi.mock('@payloadcms/ui', () => ({
  useNav: () => ({ navOpen: true, navRef: { current: null }, setNavOpen }),
  Logout: () => <button>Log out</button>,
}))
vi.mock('next/navigation', () => ({ usePathname: () => '/admin/collections/people' }))
vi.mock('next/link', () => ({
  default: ({ onClick, ...props }: React.ComponentProps<'a'>) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault()
        onClick?.(event)
      }}
    />
  ),
}))

const groups = [
  {
    label: 'People',
    items: ['people', 'roles', 'team-roles', 'partners'].map((slug) => ({
      slug,
      label: slug,
      href: `/admin/collections/${slug}`,
    })),
  },
]
const height = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')

afterEach(() => {
  cleanup()
  if (height) Object.defineProperty(HTMLElement.prototype, 'clientHeight', height)
  else Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight')
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

function renderShortNav() {
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => 100,
  })
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(private callback: () => void) {}
      observe() {
        this.callback()
      }
      disconnect() {}
    },
  )
  render(<NavClient groups={groups} />)
}

describe('compact navigation', () => {
  it('keeps every destination reachable through paging on a short screen', () => {
    renderShortNav()
    for (const slug of ['people', 'roles', 'team-roles', 'partners']) {
      expect(screen.getByRole('link', { name: slug }).getAttribute('href')).toBe(
        `/admin/collections/${slug}`,
      )
      if (slug !== 'partners')
        fireEvent.click(screen.getByRole('button', { name: 'Next navigation links' }))
    }
    expect(
      screen.getByRole('button', { name: 'Next navigation links' }).hasAttribute('disabled'),
    ).toBe(true)
  })
  it('closes mobile navigation after choosing a destination', () => {
    vi.stubGlobal('innerWidth', 390)
    renderShortNav()
    fireEvent.click(screen.getByRole('link', { name: 'people' }))
    expect(setNavOpen).toHaveBeenCalledWith(false)
  })
})
