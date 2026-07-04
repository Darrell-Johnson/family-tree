'use client'

import { Member, formatDate } from '../../lib/supabase'
import { getChildren } from './treeUtils'
import { BranchCard, DescendantBody } from './BranchCard'
import styles from './tree.module.css'

type MemberWithAge = Member & { computedAge: number | null }

export default function PennyBranchSection({ members }: { members: MemberWithAge[] }) {
  const ida = members.find(m => m.is_hub)
  const pennyKids = ida ? getChildren(ida.id, members).filter(m => m.family_line === 'Penny') : []

  if (!pennyKids.length) {
    return <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>No Penny branch members on record.</p>
  }

  return (
    <div className={styles.linesGrid}>
      {pennyKids.map(k => (
        <BranchCard
          key={k.id}
          icon={k.family_line === 'Penny' ? '👩' : '👨'}
          title={`${k.first_name} ${k.last_name}`}
          titleColor="#a090d0"
          meta={`${formatDate(k.birth_date)}${k.death_date ? `–${formatDate(k.death_date)}` : ''}${k.spouse_name ? ` · m. ${k.spouse_name}` : ''}`}
          headerBg="rgba(122,106,176,.1)"
          iconBg="rgba(122,106,176,.2)"
        >
          <DescendantBody of={k.id} members={members} />
        </BranchCard>
      ))}
    </div>
  )
}
