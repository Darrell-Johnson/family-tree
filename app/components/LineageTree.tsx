'use client'

import { Member } from '../../lib/supabase'

interface Props {
  members: (Member & { computedAge: number | null })[]
}

type MemberWithAge = Member & { computedAge: number | null }

const LINE_COLORS: Record<string, string> = {
  Benford: '#c8973a', Penny: '#7a6ab0', Johnson: '#6a9e72',
  Holley: '#b05a3a', Moland: '#3a8a9a', Bell: '#9a7a3a',
  Miles: '#7a9a5a', Dixon: '#5a7a9a', Mothershed: '#9a6a7a', Other: '#8a7a60',
}

// Style levels matching the original HTML exactly
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

function getChildren(parentId: string, all: MemberWithAge[]): MemberWithAge[] {
  return all
    .filter(m => m.parent_id === parentId)
    .sort((a, b) => {
      if (a.birth_date && b.birth_date) return a.birth_date.localeCompare(b.birth_date)
      return (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name)
    })
}

function formatYear(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}

function MemberRow({
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
        {/* Generation number */}
        <span style={{ color: '#5a5040', marginRight: 6, userSelect: 'none' }}>
          {numGen}
        </span>

        {/* Color dot */}
        <span style={{
          display: 'inline-block',
          width: 6, height: 6,
          borderRadius: '50%',
          background: member.is_hub ? '#d4608a' : color,
          marginRight: 6,
          verticalAlign: 'middle',
          marginBottom: 2,
        }} />

        {/* Hub star */}
        {member.is_hub && (
          <span style={{ color: '#d4608a', marginRight: 4 }}>★</span>
        )}

        {/* Name */}
        <span>{member.first_name} {member.last_name}</span>

        {/* Birth name */}
        {member.birth_name && (
          <span style={{ color: '#6a6050', fontSize: 11, marginLeft: 4 }}>
            (née {member.birth_name})
          </span>
        )}

        {/* Dates */}
        {dateStr && (
          <span style={{ color: '#6a6050', marginLeft: 6 }}>{dateStr}</span>
        )}

        {/* Spouse */}
        {member.spouse_name && (
          <span style={{ color: '#c8973a', marginLeft: 8 }}>
            + {member.spouse_name}
          </span>
        )}

        {/* Child count hint */}
        {children.length > 0 && (
          <span style={{ color: '#4a4030', fontSize: 10, marginLeft: 8 }}>
            · {children.length} {children.length === 1 ? 'child' : 'children'}
          </span>
        )}
      </p>

      {/* Recurse into children */}
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

export default function LineageTree({ members }: Props) {
  if (!members.length) {
    return <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
  }

  const memberIds = new Set(members.map(m => m.id))

  // Roots = no parent, or parent not in our list
  const roots = members
    .filter(m => !m.parent_id || !memberIds.has(m.parent_id))
    .sort((a, b) => {
      // Patriarchs first by birth date
      if (a.birth_date && b.birth_date) return a.birth_date.localeCompare(b.birth_date)
      return (a.last_name + a.first_name).localeCompare(b.last_name + b.first_name)
    })

  // Group roots by family line for section headers
  const sections: { label: string; color: string; roots: MemberWithAge[] }[] = []

  const benfordRoots = roots.filter(r =>
    r.family_line === 'Benford' || r.last_name === 'Benford' ||
    r.last_name === 'Norseweather-Benford'
  )
  const johnsonRoots = roots.filter(r =>
    (r.family_line === 'Johnson' || r.last_name === 'Johnson') &&
    !benfordRoots.includes(r)
  )
  const mothershedRoots = roots.filter(r => r.family_line === 'Mothershed')
  const otherRoots = roots.filter(r =>
    !benfordRoots.includes(r) &&
    !johnsonRoots.includes(r) &&
    !mothershedRoots.includes(r)
  )

  if (johnsonRoots.length) sections.push({ label: 'Johnson Paternal Line', color: '#6a9e72', roots: johnsonRoots })
  if (benfordRoots.length) sections.push({ label: 'Benford Family Line', color: '#c8973a', roots: benfordRoots })
  if (mothershedRoots.length) sections.push({ label: 'Mothershed Family', color: '#9a6a7a', roots: mothershedRoots })
  if (otherRoots.length) sections.push({ label: 'Other Branches', color: '#8a7a60', roots: otherRoots })

  return (
    <div style={{
      fontFamily: "'Inter', monospace",
      fontSize: 13,
      lineHeight: 2,
      color: 'var(--cream)',
      overflowX: 'auto',
    }}>
      {sections.map((section, si) => (
        <div key={si}>
          {/* Section header */}
          <p style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: section.color,
            borderTop: si > 0 ? '1px solid #3a3020' : 'none',
            paddingTop: si > 0 ? 20 : 0,
            marginTop: si > 0 ? 8 : 0,
            marginBottom: 8,
            fontWeight: 600,
          }}>
            {section.label}
          </p>

          {section.roots.map(root => (
            <MemberRow
              key={root.id}
              member={root}
              all={members}
              depth={0}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
