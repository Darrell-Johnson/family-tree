'use client'

import { Member } from '../../lib/supabase'
import { MemberRow } from './MemberRow'

interface Props {
  members: (Member & { computedAge: number | null })[]
}

type MemberWithAge = Member & { computedAge: number | null }

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
