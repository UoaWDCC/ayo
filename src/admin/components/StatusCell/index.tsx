import type { DefaultCellComponentProps } from 'payload'
import './index.scss'

export function StatusCell({ cellData }: DefaultCellComponentProps) {
  return <StatusBadge active={cellData === true} />
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`ayo-status${active ? ' ayo-status--active' : ''}`}>
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}
