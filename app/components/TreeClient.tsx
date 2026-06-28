'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, Member, calculateAge, formatDate, FAMILY_LINES } from '../../lib/supabase'
import styles from './tree.module.css'

const TABS = [
  { id: 'overview',   label: '🌳 Overview' },
  { id: 'search',     label: '🔍 Search' },
  { id: 'directory',  label: '📋 Directory' },
  { id: 'longevity',  label: '⏳ Longevity' },
  { id: 'add',        label: '✦ Add Member' },
]

const LINE_COLORS: Record<string, string> = {
  Benford:    '#c8973a',
  Penny:      '#7a6ab0',
  Johnson:    '#6a9e72',
  Holley:     '#b05a3a',
  Moland:     '#3a8a9a',
  Bell:       '#9a7a3a',
  Miles:      '#7a9a5a',
  Dixon:      '#5a7a9a',
  Mothershed: '#9a6a7a',
  Other:      '#8a7a60',
}

// Banner shown when .env.local has not been filled in yet
function NotConfiguredBanner() {
  return (
    <div style={{
      background: 'rgba(200,151,58,.08)',
      border: '1px solid rgba(200,151,58,.35)',
      borderRadius: 10,
      padding: '16px 20px',
      marginBottom: 24,
      fontSize: 13,
      lineHeight: 1.7,
      color: 'var(--cream)',
    }}>
      <strong style={{ color: 'var(--gold)' }}>⚠ Supabase not connected yet.</strong>
      {' '}Open <code style={{ background: 'rgba(255,255,255,.08)', padding: '1px 6px', borderRadius: 4 }}>.env.local</code> and paste your Supabase URL and anon key.
      See the <strong>README.md</strong> → Step 1 for instructions.
    </div>
  )
}

export default function TreeClient() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLine, setFilterLine] = useState('All')
  const [sortField, setSortField] = useState<'name' | 'birth_date' | 'death_date' | 'age'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setDbError(false)
    try {
      const { data, error } = await supabase.from('members').select('*').order('last_name', { ascending: true })
      if (error) { setDbError(true) } else if (data) { setMembers(data as Member[]) }
    } catch {
      setDbError(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const [form, setForm] = useState({
    first_name: '', last_name: '', birth_name: '',
    birth_date: '', death_date: '',
    family_line: 'Benford', spouse_name: '', notes: '', is_hub: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setSubmitMsg({ type: 'error', text: 'First name and last name are required.' })
      return
    }
    setSubmitting(true)
    setSubmitMsg(null)
    try {
      const payload = {
        first_name:  form.first_name.trim(),
        last_name:   form.last_name.trim(),
        birth_name:  form.birth_name.trim() || null,
        birth_date:  form.birth_date || null,
        death_date:  form.death_date || null,
        family_line: form.family_line,
        parent_id:   null,
        spouse_name: form.spouse_name.trim() || null,
        notes:       form.notes.trim() || null,
        is_hub:      form.is_hub,
      }
      const { error } = await supabase.from('members').insert([payload])
      if (error) {
        setSubmitMsg({ type: 'error', text: 'Could not save. Make sure Supabase is connected and the schema has been run.' })
      } else {
        setSubmitMsg({ type: 'success', text: `${form.first_name} ${form.last_name} has been added to the family tree.` })
        setForm({ first_name: '', last_name: '', birth_name: '', birth_date: '', death_date: '', family_line: 'Benford', spouse_name: '', notes: '', is_hub: false })
        fetchMembers()
      }
    } catch {
      setSubmitMsg({ type: 'error', text: 'Supabase is not connected. Add your credentials to .env.local first.' })
    }
    setSubmitting(false)
  }

  // Derived data
  const membersWithAge = members.map(m => ({
    ...m,
    computedAge: calculateAge(m.birth_date, m.death_date),
  }))

  const searchFiltered = membersWithAge.filter(m => {
    const q = searchQuery.toLowerCase()
    if (!q) return true
    return (
      m.first_name.toLowerCase().includes(q) ||
      m.last_name.toLowerCase().includes(q) ||
      (m.birth_name || '').toLowerCase().includes(q) ||
      (m.family_line || '').toLowerCase().includes(q) ||
      (m.spouse_name || '').toLowerCase().includes(q)
    )
  })

  const directoryFiltered = membersWithAge
    .filter(m => filterLine === 'All' || m.family_line === filterLine)
    .sort((a, b) => {
      let va: string | number = '', vb: string | number = ''
      if (sortField === 'name')       { va = a.last_name + a.first_name; vb = b.last_name + b.first_name }
      else if (sortField === 'birth_date') { va = a.birth_date || ''; vb = b.birth_date || '' }
      else if (sortField === 'death_date') { va = a.death_date || ''; vb = b.death_date || '' }
      else if (sortField === 'age')   { va = a.computedAge ?? -1; vb = b.computedAge ?? -1 }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const longevityData = membersWithAge
    .filter(m => m.computedAge !== null)
    .sort((a, b) => (b.computedAge ?? 0) - (a.computedAge ?? 0))
    .slice(0, 20)

  const maxAge = longevityData[0]?.computedAge ?? 1

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortArrow = ({ field }: { field: typeof sortField }) =>
    sortField === field ? <span style={{ color: 'var(--gold)' }}>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span> : null

  const lineGroups = FAMILY_LINES.map(line => ({
    line,
    count: members.filter(m => m.family_line === line).length,
  })).filter(g => g.count > 0)

  return (
    <div className={styles.page}>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.backLink}>← Home</Link>
          <div className={styles.headerTitle}>
            <h1>
              <span style={{ color: 'var(--gold)' }}>Benford</span>
              {' · '}
              <span style={{ color: '#9a8acf' }}>Penny</span>
              {' · '}
              <span style={{ color: '#7abf82' }}>Johnson</span>
            </h1>
            <p className={styles.headerSub}>Family Tree — {members.length} members on record</p>
          </div>
        </div>
      </header>

      {/* ── TABS ── */}
      <nav className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── CONTENT ── */}
      <main className={styles.main}>

        {/* ════ OVERVIEW ════ */}
        {activeTab === 'overview' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background: 'var(--gold)' }} />
              <h2>Family Overview</h2>
              <span className={styles.sectionMeta}>Three lines, one shared story</span>
            </div>

            {dbError && <NotConfiguredBanner />}

            {/* Stats */}
            <div className={styles.statsGrid}>
              {dbError ? (
                FAMILY_LINES.slice(0,3).map(l => (
                  <div className="card" key={l} style={{ padding: '18px', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", color: LINE_COLORS[l], fontWeight: 700 }}>—</div>
                    <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>{l}</div>
                  </div>
                ))
              ) : lineGroups.map(g => (
                <div className="card" key={g.line} style={{ padding: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", color: LINE_COLORS[g.line] || 'var(--gold)', fontWeight: 700 }}>{g.count}</div>
                  <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>{g.line}</div>
                </div>
              ))}
            </div>

            {/* Ida Hub */}
            <div className={styles.idaHero}>
              <div className={styles.idaLabel}>⭐ The Family Hub</div>
              <h3 className={styles.idaName}>Ida B. Benford · Penny · Johnson</h3>
              <div className={styles.idaDates}>1887 – 1961</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
                Born Benford, first married Penny, then married Johnson. Her full hyphenated name tells
                the whole story — she is the single person who connects all three family lines.
              </p>
              <div className={styles.idaMarriages}>
                <div className={styles.marriagePill} style={{ borderColor: 'rgba(122,106,176,.4)' }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#9a8acf', marginBottom: 3 }}>1st Marriage</div>
                  <div style={{ fontWeight: 600 }}>James Roma Penny</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>3 children · d. ~1913</div>
                </div>
                <div className={styles.marriagePill} style={{ borderColor: 'rgba(106,158,114,.4)' }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#7abf82', marginBottom: 3 }}>2nd Marriage</div>
                  <div style={{ fontWeight: 600 }}>William Jenkins Johnson</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>7 children · 1883–1942</div>
                </div>
              </div>
            </div>

            {/* Family lines summary */}
            {!dbError && (
              <div className={styles.linesGrid}>
                {['Benford', 'Penny', 'Johnson'].map(line => {
                  const lineMembers = members.filter(m => m.family_line === line).slice(0, 8)
                  return (
                    <div className="card" key={line}>
                      <div className={styles.cardHeader} style={{ background: `${LINE_COLORS[line]}12` }}>
                        <div className={styles.cardIcon} style={{ background: `${LINE_COLORS[line]}22` }}>
                          {line === 'Benford' ? '🏛' : line === 'Penny' ? '💜' : '🌿'}
                        </div>
                        <div>
                          <div className={styles.cardTitle} style={{ color: LINE_COLORS[line] }}>{line} Branch</div>
                          <div className={styles.cardMeta}>{members.filter(m => m.family_line === line).length} members</div>
                        </div>
                      </div>
                      <div style={{ padding: '12px 16px' }}>
                        <ul style={{ listStyle: 'none' }}>
                          {lineMembers.map(m => (
                            <li key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid rgba(58,48,32,.35)', fontSize: 12 }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: LINE_COLORS[line], flexShrink: 0 }} />
                              <span style={{ flex: 1 }}>{m.first_name} {m.last_name}</span>
                              {m.birth_date && <span style={{ color: 'var(--muted)', fontSize: 10 }}>{new Date(m.birth_date).getFullYear()}</span>}
                            </li>
                          ))}
                        </ul>
                        {members.filter(m => m.family_line === line).length > 8 && (
                          <button onClick={() => { setFilterLine(line); setActiveTab('directory') }} style={{ marginTop: 10, background: 'none', border: 'none', color: 'var(--gold)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                            View all →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ════ SEARCH ════ */}
        {activeTab === 'search' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background: '#5a7a9a' }} />
              <h2>Search Members</h2>
              <span className={styles.sectionMeta}>Search by first name, last name, or birth surname</span>
            </div>

            {dbError && <NotConfiguredBanner />}

            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="e.g. Johnson, Annie, Benford, Moland…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                style={{ fontSize: 16, padding: '14px 18px' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className={styles.clearBtn}>✕</button>
              )}
            </div>

            {loading && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>}

            {!loading && searchQuery.length < 2 && (
              <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 32 }}>
                Type at least 2 characters to search
              </p>
            )}

            {!loading && searchQuery.length >= 2 && searchFiltered.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 32 }}>
                No results found for &ldquo;{searchQuery}&rdquo;
              </p>
            )}

            {!loading && searchQuery.length >= 2 && searchFiltered.length > 0 && (
              <div className={styles.searchResults}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                  {searchFiltered.length} result{searchFiltered.length !== 1 ? 's' : ''}
                </div>
                {searchFiltered.map(m => (
                  <div key={m.id} className={styles.resultItem}>
                    <div className={styles.resultMain}>
                      <span className={styles.resultName}>{m.first_name} {m.last_name}</span>
                      {m.birth_name && <span className={styles.resultBirthName}>née {m.birth_name}</span>}
                      {m.is_hub && <span className={styles.hubBadge}>★ Hub</span>}
                    </div>
                    <div className={styles.resultMeta}>
                      <span className="badge" style={{ background: `${LINE_COLORS[m.family_line]}22`, color: LINE_COLORS[m.family_line] }}>
                        {m.family_line}
                      </span>
                      {m.birth_date && <span style={{ color: 'var(--muted)', fontSize: 11 }}>b. {formatDate(m.birth_date)}</span>}
                      {m.death_date && <span style={{ color: 'var(--muted)', fontSize: 11 }}>d. {formatDate(m.death_date)}</span>}
                      {m.computedAge !== null && <span style={{ color: 'var(--muted)', fontSize: 11 }}>{m.computedAge} yrs</span>}
                    </div>
                    {m.notes && <div className={styles.resultNotes}>{m.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ DIRECTORY ════ */}
        {activeTab === 'directory' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background: 'var(--johnson)' }} />
              <h2>Full Directory</h2>
              <span className={styles.sectionMeta}>{directoryFiltered.length} members shown</span>
            </div>

            {dbError && <NotConfiguredBanner />}

            <div className={styles.filterBar}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['All', ...FAMILY_LINES].map(line => (
                  <button
                    key={line}
                    onClick={() => setFilterLine(line)}
                    className={`${styles.filterChip} ${filterLine === line ? styles.filterChipActive : ''}`}
                    style={filterLine === line && line !== 'All' ? { borderColor: LINE_COLORS[line], color: LINE_COLORS[line], background: `${LINE_COLORS[line]}18` } : {}}
                  >
                    {line}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
            ) : (
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>Name <SortArrow field="name" /></th>
                      <th>Birth Name</th>
                      <th>Family Line</th>
                      <th onClick={() => toggleSort('birth_date')} style={{ cursor: 'pointer' }}>Born <SortArrow field="birth_date" /></th>
                      <th onClick={() => toggleSort('death_date')} style={{ cursor: 'pointer' }}>Died <SortArrow field="death_date" /></th>
                      <th onClick={() => toggleSort('age')} style={{ cursor: 'pointer' }}>Age <SortArrow field="age" /></th>
                      <th>Spouse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {directoryFiltered.map(m => (
                      <tr key={m.id}>
                        <td>
                          <span style={{ fontWeight: 500 }}>{m.first_name} {m.last_name}</span>
                          {m.is_hub && <span style={{ marginLeft: 6, color: 'var(--ida)', fontSize: 11 }}>★</span>}
                        </td>
                        <td style={{ color: 'var(--muted)' }}>{m.birth_name || '—'}</td>
                        <td>
                          <span className="badge" style={{ background: `${LINE_COLORS[m.family_line]}18`, color: LINE_COLORS[m.family_line] }}>
                            {m.family_line}
                          </span>
                        </td>
                        <td style={{ color: 'var(--muted)' }}>{formatDate(m.birth_date)}</td>
                        <td style={{ color: 'var(--muted)' }}>{formatDate(m.death_date)}</td>
                        <td style={{ color: m.computedAge && m.computedAge > 99 ? 'var(--gold)' : 'var(--cream)', fontWeight: m.computedAge && m.computedAge > 99 ? 700 : 400 }}>
                          {m.computedAge !== null ? `${m.computedAge} yrs` : '—'}
                        </td>
                        <td style={{ color: 'var(--muted)' }}>{m.spouse_name || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {directoryFiltered.length === 0 && !dbError && (
                  <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No members found.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ LONGEVITY ════ */}
        {activeTab === 'longevity' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background: '#9a6a7a' }} />
              <h2>Longevity Record</h2>
              <span className={styles.sectionMeta}>Top 20 longest-lived members</span>
            </div>

            {dbError && <NotConfiguredBanner />}

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Family Line</th>
                    <th>Born</th>
                    <th>Died</th>
                    <th>Age</th>
                    <th>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {longevityData.map((m, i) => (
                    <tr key={m.id}>
                      <td style={{ color: 'var(--muted)', width: 40 }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{m.first_name} {m.last_name}</td>
                      <td>
                        <span className="badge" style={{ background: `${LINE_COLORS[m.family_line]}18`, color: LINE_COLORS[m.family_line] }}>
                          {m.family_line}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{formatDate(m.birth_date)}</td>
                      <td style={{ color: 'var(--muted)' }}>
                        {m.death_date ? formatDate(m.death_date) : <span style={{ color: 'var(--johnson)' }}>Living</span>}
                      </td>
                      <td style={{ color: m.computedAge && m.computedAge > 99 ? 'var(--gold)' : 'var(--cream)', fontWeight: m.computedAge && m.computedAge > 99 ? 700 : 400 }}>
                        {m.computedAge} yrs
                      </td>
                      <td>
                        <span className="age-bar" style={{ width: Math.round(((m.computedAge ?? 0) / maxAge) * 120) }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ ADD MEMBER ════ */}
        {activeTab === 'add' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background: 'var(--ida)' }} />
              <h2>Add a Family Member</h2>
              <span className={styles.sectionMeta}>Help the record grow</span>
            </div>

            {dbError && <NotConfiguredBanner />}

            <div className={styles.formWrap}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formNote}>
                  All submissions are public and immediately added to the family record. Please double-check names and dates before submitting.
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>First Name <span style={{ color: 'var(--ida)' }}>*</span></label>
                    <input type="text" placeholder="e.g. Annie Mae" value={form.first_name}
                      onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Last Name <span style={{ color: 'var(--ida)' }}>*</span></label>
                    <input type="text" placeholder="e.g. Penny-Bell" value={form.last_name}
                      onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Birth / Maiden Name</label>
                    <input type="text" placeholder="Surname at birth (if different)" value={form.birth_name}
                      onChange={e => setForm(f => ({ ...f, birth_name: e.target.value }))} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Family Line <span style={{ color: 'var(--ida)' }}>*</span></label>
                    <select value={form.family_line} onChange={e => setForm(f => ({ ...f, family_line: e.target.value }))}>
                      {FAMILY_LINES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Date of Birth</label>
                    <input type="date" value={form.birth_date}
                      onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))} />
                    <span className={styles.fieldHint}>Age is calculated automatically from this date.</span>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Date of Death</label>
                    <input type="date" value={form.death_date}
                      onChange={e => setForm(f => ({ ...f, death_date: e.target.value }))} />
                    <span className={styles.fieldHint}>Leave blank if the person is still living.</span>
                  </div>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label}>Spouse / Partner Name</label>
                    <input type="text" placeholder="Full name of spouse or partner" value={form.spouse_name}
                      onChange={e => setForm(f => ({ ...f, spouse_name: e.target.value }))} />
                  </div>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label}>Notes</label>
                    <textarea rows={3}
                      placeholder="Any additional context — children, relationships, location, occupation, etc."
                      value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>

                  {form.birth_date && (
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <div className={styles.agePreview}>
                        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Age preview:</span>
                        <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display', serif" }}>
                          {calculateAge(form.birth_date, form.death_date || null)} years
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                          {form.death_date ? '(at time of death)' : '(current age)'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {submitMsg && (
                  <div className={`${styles.alert} ${submitMsg.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
                    {submitMsg.type === 'success' ? '✓ ' : '✕ '}{submitMsg.text}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" className="btn btn-gold" disabled={submitting}>
                    {submitting ? 'Saving…' : 'Add to Family Tree'}
                  </button>
                  <button type="button" className="btn btn-outline"
                    onClick={() => setForm({ first_name: '', last_name: '', birth_name: '', birth_date: '', death_date: '', family_line: 'Benford', spouse_name: '', notes: '', is_hub: false })}>
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
