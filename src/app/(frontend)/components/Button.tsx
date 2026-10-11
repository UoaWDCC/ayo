import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const baseClass =
  'inline-flex items-center justify-center px-8 py-3 text-[15px] font-semibold cursor-pointer transition-colors'

const variantClass = {
  black: 'bg-black text-white hover:bg-black/80',
  // For dark grounds (photo overlays, footer).
  white: 'bg-white text-black hover:bg-white/80',
}

type ButtonProps = {
  children: ReactNode
  className?: string
  variant?: keyof typeof variantClass
} & (
  | ({ href: string; external?: boolean } & { type?: never })
  | ({ href?: undefined; external?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
)

export default function Button({
  children,
  className = '',
  variant = 'black',
  ...props
}: ButtonProps) {
  const classes = `${baseClass} ${variantClass[variant]} ${className}`.trim()

  if (props.href !== undefined) {
    const { href, external } = props
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </Link>
    )
  }

  const { href: _href, external: _external, ...buttonProps } = props
  return (
    <button type="button" {...buttonProps} className={classes}>
      {children}
    </button>
  )
}
