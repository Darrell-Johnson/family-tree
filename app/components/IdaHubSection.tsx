'use client'

import { Member, formatDate } from '../../lib/supabase'
import { findMember, getChildren } from './treeUtils'
import { BranchCard, DescendantBody } from './BranchCard'
import styles from './tree.module.css'

type MemberWithAge = Member & { computedAge: number | null }

export default function IdaHubSection({ members }: { members: MemberWithAge[] }) {
  const milton = findMember(members, 'Milton', 'Benford')
  const ida = members.find(m => m.is_hub)
  const jamesPenny = findMember(members, 'James Roma', 'Penny')
  const wmJenkins = findMember(members, 'William Jenkins', 'Johnson')

  if (!ida) {
    return <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Ida B. Benford is not yet on record.</p>
  }

  const idaKids = getChildren(ida.id, members)
  const pennyKids = idaKids.filter(m => m.family_line === 'Penny')
  const johnsonKids = idaKids.filter(m => m.family_line === 'Johnson')

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* ROOT */}
      {milton && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div className="card" style={{ display: 'inline-block', minWidth: 300, padding: '14px 22px', borderColor: 'var(--gold)' }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Generation 1 — Benford Patriarch</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: 'var(--cream)' }}>{milton.first_name} {milton.last_name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                b. {formatDate(milton.birth_date)}{milton.spouse_name ? ` · m. ${milton.spouse_name}` : ''}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 2, height: 32, background: 'var(--border)' }} /></div>
        </>
      )}

      {/* IDA HERO */}
      <div className={styles.idaHero} style={{ marginBottom: 16 }}>
        <div className={styles.idaLabel}>⭐ Generation 2 — Daughter of Milton Benford</div>
        <h3 className={styles.idaName}>{ida.first_name} {ida.last_name}</h3>
        <div className={styles.idaDates}>{formatDate(ida.birth_date)} – {formatDate(ida.death_date)}</div>
        <p style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 520, margin: '0 auto' }}>
          Her full hyphenated name tells the whole story: born Benford, first married Penny, then married Johnson.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 80, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 2, height: 28, background: '#7a6ab0' }} />
          <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#9a8acf', marginTop: 4 }}>1st husband</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 2, height: 28, background: '#6a9e72' }} />
          <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#7abf82', marginTop: 4 }}>2nd husband</div>
        </div>
      </div>

      <div className={styles.linesGrid} style={{ marginBottom: 20 }}>
        <BranchCard
          icon="👨"
          title={jamesPenny ? `${jamesPenny.first_name} ${jamesPenny.last_name}` : 'James Roma Penny'}
          titleColor="#a090d0"
          meta={jamesPenny?.death_date ? `d. ${formatDate(jamesPenny.death_date)}` : undefined}
          headerBg="rgba(122,106,176,.1)"
          iconBg="rgba(122,106,176,.2)"
        >
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>{pennyKids.length} children from this marriage:</p>
          <div style={{ fontFamily: "'Inter', monospace", fontSize: 12 }}>
            {pennyKids.map(k => (
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

        <BranchCard
          icon="👨"
          title={wmJenkins ? `${wmJenkins.first_name} ${wmJenkins.last_name}` : 'William Jenkins Johnson'}
          titleColor="#8abf8a"
          meta={wmJenkins ? `${formatDate(wmJenkins.birth_date)}–${formatDate(wmJenkins.death_date)}` : undefined}
          headerBg="rgba(106,158,114,.1)"
          iconBg="rgba(106,158,114,.2)"
        >
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>{johnsonKids.length} children from this marriage:</p>
          <div style={{ fontFamily: "'Inter', monospace", fontSize: 12 }}>
            {johnsonKids.map(k => (
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
      </div>

      <div style={{ background: 'rgba(212,96,138,.07)', border: '1px solid rgba(212,96,138,.25)', borderRadius: 10, padding: '16px 20px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.8 }}>
        <strong style={{ color: 'var(--ida)' }}>Why Ida is the key:</strong> James Roma Penny died around 1913, leaving Ida a widow with three young children. She later married William Jenkins Johnson, himself the son of Richard Israel Johnson. This second union produced seven more children, all bearing the Johnson surname. Ida therefore connects the Benford, Penny, and Johnson lines into one family tree.
      </div>
    </div>
  )
}
