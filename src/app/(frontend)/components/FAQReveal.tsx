import type { ReactNode } from 'react'
import StaggerReveal from './StaggerReveal'

/**
 * Staggers the FAQ heading and each question into view as the section is reached.
 * Same timing and trigger point as the Concerts / Previous Events lead reveals.
 */
export default function FAQReveal({ children }: { children: ReactNode }) {
  return <StaggerReveal fadeClass="faq-fade">{children}</StaggerReveal>
}
