'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import './previewPanel.scss'

export function PreviewPanel({
  header,
  savedPage,
  children,
  className = 'ayo-preview',
  resetKey,
}: {
  header: ReactNode
  savedPage?: ReactNode
  children: ReactNode
  className?: string
  resetKey?: string
}) {
  const body = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [availableHeight, setAvailableHeight] = useState<number>()
  useEffect(() => {
    const measure = () => {
      if (panel.current)
        setAvailableHeight(
          Math.max(
            160,
            window.innerHeight - Math.max(64, panel.current.getBoundingClientRect().top) - 24,
          ),
        )
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    const observer = new ResizeObserver(measure)
    if (panel.current?.parentElement) observer.observe(panel.current.parentElement)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [])
  useEffect(() => {
    if (body.current) body.current.scrollTop = 0
  }, [resetKey])
  return (
    <div
      ref={panel}
      className={`${className} ayo-preview-panel`}
      style={
        availableHeight
          ? ({ '--ayo-preview-height': `${availableHeight}px` } as React.CSSProperties)
          : undefined
      }
    >
      <div className="ayo-preview-panel__controls">
        {header}
        {savedPage}
      </div>
      <div
        ref={body}
        className="ayo-preview-panel__body"
        role="region"
        aria-label="Preview content"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  )
}
