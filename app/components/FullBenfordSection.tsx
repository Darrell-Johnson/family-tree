'use client'

import { Member, formatDate } from '../../lib/supabase'
import { findMember } from './treeUtils'
import { BranchCard, ChildList, DescendantBody } from './BranchCard'
import styles from './tree.module.css'

type MemberWithAge = Member & { computedAge: number | null }

export default function FullBenfordSection({ members }: { members: MemberWithAge[] }) {
  const milton = findMember(members, 'Milton', 'Benford')
  const luvenia = findMember(members, 'Luvenia', 'Benford-Holley')
  const burlie = findMember(members, 'Burlie', 'Benford')
  const wmMoses = findMember(members, 'William Moses', 'Benford')

  if (!milton) {
    return <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>No Benford family members on record.</p>
  }

  return (
    <div className={styles.linesGrid}>
      <BranchCard
        icon="🌳"
        title={`${milton.first_name} ${milton.last_name}`}
        meta={`b. ${formatDate(milton.birth_date)}${milton.spouse_name ? ` · m. ${milton.spouse_name}` : ''}`}
        headerBg="rgba(200,151,58,.08)"
        iconBg="rgba(200,151,58,.15)"
      >
        <ChildList
          parentId={milton.id}
          members={members}
          annotate={m => (m.is_hub ? '★ see Ida Hub, Penny & Johnson tabs' : null)}
        />
      </BranchCard>

      {luvenia && (
        <BranchCard
          icon="👩"
          title={`${luvenia.first_name} ${luvenia.last_name}`}
          titleColor="#e07a5a"
          meta={`b. ${formatDate(luvenia.birth_date)}${luvenia.spouse_name ? ` · m. ${luvenia.spouse_name}` : ''}`}
          headerBg="rgba(176,90,58,.1)"
          iconBg="rgba(176,90,58,.2)"
        >
          <DescendantBody of={luvenia.id} members={members} />
        </BranchCard>
      )}

      {burlie && (
        <BranchCard
          icon="👨"
          title={`${burlie.first_name} ${burlie.last_name}`}
          titleColor="#5ab0c0"
          meta={`b. ${formatDate(burlie.birth_date)}${burlie.spouse_name ? ` · m. ${burlie.spouse_name}` : ''}`}
          headerBg="rgba(58,138,154,.1)"
          iconBg="rgba(58,138,154,.2)"
        >
          <DescendantBody of={burlie.id} members={members} />
        </BranchCard>
      )}

      {wmMoses && (
        <BranchCard
          icon="👨"
          title={`${wmMoses.first_name} ${wmMoses.last_name}`}
          titleColor="#c0a05a"
          meta="No marriage record on file"
          headerBg="rgba(154,122,58,.1)"
          iconBg="rgba(154,122,58,.2)"
        >
          <DescendantBody of={wmMoses.id} members={members} />
        </BranchCard>
      )}
    </div>
  )
}
