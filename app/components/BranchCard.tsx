'use client'

import { Member } from '../../lib/supabase'
import { getChildren } from './treeUtils'
import { LINE_COLORS, MemberRow } from './MemberRow'
import styles from './tree.module.css'

type MemberWithAge = Member & { computedAge: number | null }

function formatYear(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}

/** Flat (non-recursive) list of a member's direct children — used for "origin" cards
 *  whose descendants are already expanded in other dedicated cards. */
export function ChildList({
  parentId,
  members,
  annotate,
}: {
  parentId: string
  members: MemberWithAge[]
  annotate?: (m: MemberWithAge) => string | null
}) {
  const kids = getChildren(parentId, members)
  if (!kids.length) {
    return <p style={{ color: 'var(--muted)', fontSize: 12 }}>No children on record.</p>
  }
  return (
    <ul style={{ listStyle: 'none' }}>
      {kids.map(m => {
        const color = LINE_COLORS[m.family_line] || '#8a7a60'
        const birthYear = formatYear(m.birth_date)
        const deathYear = formatYear(m.death_date)
        const note = annotate?.(m)
        return (
          <li key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid rgba(58,48,32,.35)', fontSize: 12, flexWrap: 'wrap' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.is_hub ? '#d4608a' : color, flexShrink: 0 }} />
            {m.is_hub && <span style={{ color: '#d4608a' }}>★</span>}
            <span style={{ flex: 1 }}>{m.first_name} {m.last_name}</span>
            {birthYear && <span style={{ color: 'var(--muted)', fontSize: 10 }}>{birthYear}{deathYear ? `–${deathYear}` : ''}</span>}
            {note && <span style={{ color: 'var(--gold)', fontSize: 10 }}>{note}</span>}
          </li>
        )
      })}
    </ul>
  )
}

/** Recursive descendant listing for a set of members already fetched via getChildren — used
 *  inside "deep dive" cards where the full nested lineage below the root should be shown. */
export function DescendantBody({ of: rootId, members }: { of: string; members: MemberWithAge[] }) {
  const kids = getChildren(rootId, members)
  if (!kids.length) {
    return <p style={{ color: 'var(--muted)', fontSize: 12 }}>No descendants on record.</p>
  }
  return (
    <div style={{ fontFamily: "'Inter', monospace", fontSize: 12 }}>
      {kids.map(k => <MemberRow key={k.id} member={k} all={members} depth={1} />)}
    </div>
  )
}

export function BranchCard({
  icon,
  title,
  titleColor,
  meta,
  headerBg,
  iconBg,
  children,
}: {
  icon: string
  title: string
  titleColor?: string
  meta?: string
  headerBg: string
  iconBg: string
  children: React.ReactNode
}) {
  return (
    <div className="card">
      <div className={styles.cardHeader} style={{ background: headerBg }}>
        <div className={styles.cardIcon} style={{ background: iconBg }}>{icon}</div>
        <div>
          <div className={styles.cardTitle} style={{ color: titleColor }}>{title}</div>
          {meta && <div className={styles.cardMeta}>{meta}</div>}
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        {children}
      </div>
    </div>
  )
}
