'use client'

import React from 'react'

import './index.scss'

// A2's SectionA2 chapter-break: a 24px semibold heading with an optional plain-language note,
// separated from the previous section by a rule. A `ui` field (carries no data of its own) for
// any document whose fields benefit from named grouping — currently only Posts, since A2 shows
// no equivalent grouping on People/Partners/Roles/Links.
type Props = {
  field?: { label?: unknown; admin?: { custom?: { note?: unknown } } }
}

export const SectionDivider: React.FC<Props> = ({ field }) => {
  const label = typeof field?.label === 'string' ? field.label : ''
  const note = typeof field?.admin?.custom?.note === 'string' ? field.admin.custom.note : undefined

  return (
    <div className="ayo-section-divider">
      {label ? <h2 className="ayo-section-divider__title">{label}</h2> : null}
      {note ? <p className="ayo-section-divider__note">{note}</p> : null}
    </div>
  )
}

export default SectionDivider
