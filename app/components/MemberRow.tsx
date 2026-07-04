'use client'

import { Member } from '../../lib/supabase'
import { getChildren } from './treeUtils'

type MemberWithAge = Member & { computedAge: number | null }

export const LINE_COLORS: Record<string, string> = {
  Benford: '#c8973a', Penny: '#7a6ab0', Johnson: '#6a9e72',
  Holley: '#b05a3a', Moland: '#3a8a9a', Bell: '#9a7a3a',
  Miles: '#7a9a5a', Dixon: '#5a7a9a', Mothershed: '#9a6a7a', Other: '#8a7a60',
}

const LEVEL_STYLES: Record<number, React.CSSProperties> = {
  0: { color: '#e8b85a', fontWeight: 700, fontSize: 14, paddingLeft: 0 },
  1: { color: '#f0e8d8', fontWeight: 600, fontSize: 13, paddingLeft: 24 },
  2: { color: '#b0a888', fontWeight: 400, fontSize: 12, paddingLeft: 48 },
  3: { color: '#807860', fontWeight: 400, fontSize: 12, paddingLeft: 72 },
  4: { color: '#604848', fontWeight: 400, fontSize: 11, paddingLeft: 96 },
  5: { color: '#4a3838', fontWeight: 400, fontSize: 11, paddingLeft: 120 },
}

function getLevel(depth: number): React.CSSProperties {
  return LEVEL_STYLES[Math.min(depth, 5)]
}

function formatYear(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}

export function MemberRow({
  member,
  all,
  depth,
}: {
  member: MemberWithAge
  all: MemberWithAge[]
  depth: number
}) {
  const children = getChildren(member.id, all)
  const style = getLevel(depth)
  const color = LINE_COLORS[member.family_line] || '#8a7a60'

  const birthYear = formatYear(member.birth_date)
  const deathYear = formatYear(member.death_date)
  const dateStr = birthYear
    ? deathYear
      ? `${birthYear}–${deathYear}`
      : `b. ${birthYear}`
    : ''

  const numGen = depth + 1

  return (
    <>
      <p style={{
        ...style,
        display: 'block',
        lineHeight: 2,
        margin: 0,
        padding: `0 0 0 ${style.paddingLeft}px`,
      }}>
        <span style={{ color: '#5a5040', marginRight: 6, userSelect: 'none' }}>
          {numGen}
        </span>

        <span style={{
          display: 'inline-block',
          width: 6, height: 6,
          borderRadius: '50%',
          background: member.is_hub ? '#d4608a' : color,
          marginRight: 6,
          verticalAlign: 'middle',
          marginBottom: 2,
        }} />

        {member.is_hub && (
          <span style={{ color: '#d4608a', marginRight: 4 }}>★</span>
        )}

        <span>{member.first_name} {member.last_name}</span>

        {member.birth_name && (
          <span style={{ color: '#6a6050', fontSize: 11, marginLeft: 4 }}>
            (née {member.birth_name})
          </span>
        )}

        {dateStr && (
          <span style={{ color: '#6a6050', marginLeft: 6 }}>{dateStr}</span>
        )}

        {member.spouse_name && (
          <span style={{ color: '#c8973a', marginLeft: 8 }}>
            + {member.spouse_name}
          </span>
        )}

        {children.length > 0 && (
          <span style={{ color: '#4a4030', fontSize: 10, marginLeft: 8 }}>
            · {children.length} {children.length === 1 ? 'child' : 'children'}
          </span>
        )}
      </p>

      {children.map(child => (
        <MemberRow
          key={child.id}
          member={child}
          all={all}
          depth={depth + 1}
        />
      ))}
    </>
  )
}
