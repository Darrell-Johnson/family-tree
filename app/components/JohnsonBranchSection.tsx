'use client'

import { Member, formatDate } from '../../lib/supabase'
import { findMember, getChildren } from './treeUtils'
import { BranchCard, ChildList, DescendantBody } from './BranchCard'
import styles from './tree.module.css'

type MemberWithAge = Member & { computedAge: number | null }

export default function JohnsonBranchSection({ members }: { members: MemberWithAge[] }) {
  const richard = findMember(members, 'Richard Israel', 'Johnson')
  const wmJenkins = findMember(members, 'William Jenkins', 'Johnson')
  const ida = members.find(m => m.is_hub)
  const israel = findMember(members, 'Israel', 'Johnson')
  const hagar = findMember(members, 'Hagar', 'Johnson')
  const tera = findMember(members, 'Tera', 'Johnson')

  if (!richard) {
    return <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>No Johnson branch members on record.</p>
  }

  const idaJohnsonKids = ida ? getChildren(ida.id, members).filter(m => m.family_line === 'Johnson') : []
  const wmJenkinsFirstFamily = wmJenkins ? getChildren(wmJenkins.id, members) : []

  return (
    <div>
      <div style={{ background: 'rgba(106,158,114,.07)', border: '1px solid rgba(106,158,114,.25)', borderRadius: 10, padding: '14px 18px', fontSize: 12, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--johnson)' }}>Note:</strong> William Jenkins Johnson ({formatDate(wmJenkins?.birth_date ?? null)}–{formatDate(wmJenkins?.death_date ?? null)}) was himself the son of patriarch <strong style={{ color: 'var(--cream)' }}>Richard Israel Johnson</strong>. He also had a first family with Niece Abraham. His marriage to Ida B. Benford is the connection between the Benford and Johnson lines.
      </div>

      <div className={styles.linesGrid}>
        {/* RICHARD ISRAEL JOHNSON — origin */}
        <BranchCard
          icon="🌳"
          title={`${richard.first_name} ${richard.last_name}`}
          meta={`b. ${formatDate(richard.birth_date)}${richard.spouse_name ? ` · m. ${richard.spouse_name}` : ''}`}
          headerBg="rgba(106,158,114,.08)"
          iconBg="rgba(106,158,114,.15)"
        >
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>His children (Johnson siblings):</p>
          <ChildList
            parentId={richard.id}
            members={members}
            annotate={m => (m.id === wmJenkins?.id ? '→ m. Ida B. Benford ★' : null)}
          />
        </BranchCard>

        {/* WM JENKINS + IDA */}
        {wmJenkins && (
          <BranchCard
            icon="⭐"
            title={`${wmJenkins.first_name.split(' ')[0]} Jenkins + Ida B. Benford`}
            titleColor="#d090a0"
            meta={`${idaJohnsonKids.length} children — the Johnson-Benford line`}
            headerBg="rgba(154,106,122,.1)"
            iconBg="rgba(154,106,122,.2)"
          >
            <div style={{ fontFamily: "'Inter', monospace", fontSize: 12 }}>
              {idaJohnsonKids.map(k => (
                <div key={k.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, color: 'var(--cream)' }}>
                    {k.first_name} {k.last_name}
                    {k.birth_date && <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 6 }}>{formatDate(k.birth_date)}{k.death_date ? `–${formatDate(k.death_date)}` : ''}</span>}
                  </div>
                  <DescendantBody of={k.id} members={members} />
                </div>
              ))}
            </div>
          </BranchCard>
        )}

        {/* WM JENKINS + NIECE ABRAHAM */}
        {wmJenkins && (
          <BranchCard
            icon="👨"
            title={`${wmJenkins.first_name.split(' ')[0]} Jenkins + Niece Abraham`}
            titleColor="#a0c870"
            meta={`1st family · ${wmJenkinsFirstFamily.length} children`}
            headerBg="rgba(122,154,90,.08)"
            iconBg="rgba(122,154,90,.15)"
          >
            <div style={{ fontFamily: "'Inter', monospace", fontSize: 12 }}>
              {wmJenkinsFirstFamily.map(k => (
                <div key={k.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, color: 'var(--cream)' }}>
                    {k.first_name} {k.last_name}
                    {k.birth_date && <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 6 }}>{formatDate(k.birth_date)}{k.death_date ? `–${formatDate(k.death_date)}` : ''}</span>}
                  </div>
                  <DescendantBody of={k.id} members={members} />
                </div>
              ))}
            </div>
          </BranchCard>
        )}

        {/* ISRAEL */}
        {israel && (
          <BranchCard
            icon="👨"
            title={`${israel.first_name} ${israel.last_name}`}
            titleColor="#a888c8"
            meta={`${formatDate(israel.birth_date)}–${formatDate(israel.death_date)}${israel.spouse_name ? ` · m. ${israel.spouse_name}` : ''}`}
            headerBg="rgba(122,90,154,.08)"
            iconBg="rgba(122,90,154,.15)"
          >
            <DescendantBody of={israel.id} members={members} />
          </BranchCard>
        )}

        {/* HAGAR */}
        {hagar && (
          <BranchCard
            icon="👩"
            title={`${hagar.first_name} ${hagar.last_name}`}
            titleColor="#80a8c8"
            meta={`b. ${formatDate(hagar.birth_date)}${hagar.spouse_name ? ` · m. ${hagar.spouse_name}` : ''}`}
            headerBg="rgba(90,122,154,.08)"
            iconBg="rgba(90,122,154,.15)"
          >
            <DescendantBody of={hagar.id} members={members} />
          </BranchCard>
        )}

        {/* TERA */}
        {tera && (
          <BranchCard
            icon="👩"
            title={`${tera.first_name} ${tera.last_name}`}
            titleColor="#c88888"
            meta="Dates unknown"
            headerBg="rgba(154,90,90,.08)"
            iconBg="rgba(154,90,90,.15)"
          >
            <DescendantBody of={tera.id} members={members} />
          </BranchCard>
        )}
      </div>
    </div>
  )
}
