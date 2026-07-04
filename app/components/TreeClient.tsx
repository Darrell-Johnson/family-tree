'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { supabase, Member, calculateAge, formatDate, FAMILY_LINES } from '../../lib/supabase'
import { LINE_COLORS_MAP, getDescendants, getAncestryPath, GENERATION_SUFFIXES } from './treeUtils'
import styles from './tree.module.css'

const LineageTree = dynamic(() => import('./LineageTree'), { ssr: false })

const TABS = [
  { id: 'overview',  label: '🌳 Overview' },
  { id: 'lineage',   label: '🌿 Full Lineage' },
  { id: 'search',    label: '🔍 Search' },
  { id: 'directory', label: '📋 Directory' },
  { id: 'longevity', label: '⏳ Longevity' },
  { id: 'add',       label: '✦ Add Member' },
]

function NotConfiguredBanner() {
  return (
    <div style={{ background:'rgba(200,151,58,.08)', border:'1px solid rgba(200,151,58,.35)', borderRadius:10, padding:'16px 20px', marginBottom:24, fontSize:13, lineHeight:1.7, color:'var(--cream)' }}>
      <strong style={{ color:'var(--gold)' }}>⚠ Supabase not connected yet.</strong>
      {' '}Open <code style={{ background:'rgba(255,255,255,.08)', padding:'1px 6px', borderRadius:4 }}>.env.local</code> and paste your Supabase URL and anon key, then restart the server.
    </div>
  )
}

type MemberWithAge = Member & { computedAge: number | null }

export default function TreeClient() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [members, setMembers] = useState<MemberWithAge[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)

  // ── Search state ──
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSearch, setExpandedSearch] = useState<string | null>(null)

  // ── Directory state ──
  const [filterLine, setFilterLine] = useState('All')
  const [sortField, setSortField] = useState<'name'|'birth_date'|'death_date'|'age'>('name')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')

  // ── Add Member form state ──
  const [form, setForm] = useState({
    first_name: '', last_name: '', birth_name: '',
    birth_date: '', death_date: '',
    family_line: 'Benford', parent_id: '', spouse_name: '', notes: '', is_hub: false,
  })
  const [parentSearch, setParentSearch] = useState('')
  const [parentDropdownOpen, setParentDropdownOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<MemberWithAge | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ type:'success'|'error'; text:string }|null>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true); setDbError(false)
    try {
      const { data, error } = await supabase.from('members').select('*').order('birth_date', { ascending: true })
      if (error) { setDbError(true) }
      else if (data) {
        setMembers((data as Member[]).map(m => ({ ...m, computedAge: calculateAge(m.birth_date, m.death_date) })))
      }
    } catch { setDbError(true) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  // Close parent dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (parentRef.current && !parentRef.current.contains(e.target as Node)) {
        setParentDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Parent search filtered list ──
  const parentSuggestions = members.filter(m => {
    if (!parentSearch.trim()) return false
    const q = parentSearch.toLowerCase()
    return (
      m.first_name.toLowerCase().includes(q) ||
      m.last_name.toLowerCase().includes(q) ||
      (m.birth_name || '').toLowerCase().includes(q)
    )
  }).slice(0, 8)

  // ── When parent is selected, auto-fill family line ──
  function selectParent(m: MemberWithAge) {
    setSelectedParent(m)
    setForm(f => ({ ...f, parent_id: m.id, family_line: m.family_line }))
    setParentSearch(`${m.first_name} ${m.last_name}`)
    setParentDropdownOpen(false)
  }

  // ── Get ancestry path display for selected parent ──
  function getParentPath(parent: MemberWithAge): string {
    const path = getAncestryPath(parent.id, members)
    return path.map(p => `${p.first_name} ${p.last_name}`).join(' → ')
  }

  // ── Submit new member ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setSubmitMsg({ type:'error', text:'First name and last name are required.' }); return
    }
    setSubmitting(true); setSubmitMsg(null)
    try {
      const payload = {
        first_name:  form.first_name.trim(),
        last_name:   form.last_name.trim(),
        birth_name:  form.birth_name.trim() || null,
        birth_date:  form.birth_date || null,
        death_date:  form.death_date || null,
        family_line: form.family_line,
        parent_id:   form.parent_id || null,
        spouse_name: form.spouse_name.trim() || null,
        notes:       form.notes.trim() || null,
        is_hub:      form.is_hub,
      }
      const { error } = await supabase.from('members').insert([payload])
      if (error) {
        setSubmitMsg({ type:'error', text:'Could not save. Make sure Supabase is connected.' })
      } else {
        setSubmitMsg({ type:'success', text:`${form.first_name} ${form.last_name} has been added to the family tree.` })
        setForm({ first_name:'', last_name:'', birth_name:'', birth_date:'', death_date:'', family_line:'Benford', parent_id:'', spouse_name:'', notes:'', is_hub:false })
        setSelectedParent(null); setParentSearch('')
        fetchMembers()
      }
    } catch {
      setSubmitMsg({ type:'error', text:'Supabase is not connected. Add your credentials to .env.local first.' })
    }
    setSubmitting(false)
  }

  // ── Search: find member + all descendants ──
  const searchFiltered = members.filter(m => {
    const q = searchQuery.toLowerCase()
    if (!q || q.length < 2) return false
    return (
      m.first_name.toLowerCase().includes(q) ||
      m.last_name.toLowerCase().includes(q) ||
      (m.birth_name || '').toLowerCase().includes(q) ||
      (m.spouse_name || '').toLowerCase().includes(q)
    )
  })

  function getDescendantsWithDepth(memberId: string): { member: MemberWithAge; depth: number; relation: string }[] {
    const result: { member: MemberWithAge; depth: number; relation: string }[] = []
    function walk(id: string, depth: number) {
      const children = members.filter(m => m.parent_id === id)
      for (const child of children) {
        const relation = depth === 1 ? 'Child' : depth === 2 ? 'Grandchild' : depth === 3 ? 'Great-grandchild' : `Great×${depth-2}-grandchild`
        result.push({ member: child, depth, relation })
        walk(child.id, depth + 1)
      }
    }
    walk(memberId, 1)
    return result
  }

  // ── Directory ──
  const directoryFiltered = members
    .filter(m => filterLine === 'All' || m.family_line === filterLine)
    .sort((a, b) => {
      let va: string|number = '', vb: string|number = ''
      if (sortField === 'name')       { va = a.last_name+a.first_name; vb = b.last_name+b.first_name }
      else if (sortField === 'birth_date') { va = a.birth_date||''; vb = b.birth_date||'' }
      else if (sortField === 'death_date') { va = a.death_date||''; vb = b.death_date||'' }
      else if (sortField === 'age')   { va = a.computedAge??-1; vb = b.computedAge??-1 }
      if (va < vb) return sortDir==='asc'?-1:1
      if (va > vb) return sortDir==='asc'?1:-1
      return 0
    })

  // ── Longevity ──
  const longevityData = [...members].filter(m => m.computedAge !== null).sort((a,b)=>(b.computedAge??0)-(a.computedAge??0)).slice(0,20)
  const maxAge = longevityData[0]?.computedAge ?? 1

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d==='asc'?'desc':'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortArrow = ({ field }: { field: typeof sortField }) =>
    sortField === field ? <span style={{ color:'var(--gold)' }}>{sortDir==='asc'?' ↑':' ↓'}</span> : null

  const lineGroups = FAMILY_LINES.map(line => ({ line, count: members.filter(m=>m.family_line===line).length })).filter(g=>g.count>0)

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.backLink}>← Home</Link>
          <div className={styles.headerTitle}>
            <h1>
              <span style={{ color:'var(--gold)' }}>Benford</span>{' · '}
              <span style={{ color:'#9a8acf' }}>Penny</span>{' · '}
              <span style={{ color:'#7abf82' }}>Johnson</span>
            </h1>
            <p className={styles.headerSub}>Family Tree — {members.length} members on record</p>
          </div>
        </div>
      </header>

      {/* TABS */}
      <nav className={styles.tabs}>
        {TABS.map(t => (
          <button key={t.id} className={`${styles.tab} ${activeTab===t.id?styles.tabActive:''}`} onClick={()=>setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main className={styles.main}>

        {/* ══════════ OVERVIEW ══════════ */}
        {activeTab==='overview' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background:'var(--gold)' }} />
              <h2>Family Overview</h2>
              <span className={styles.sectionMeta}>Three lines, one shared story</span>
            </div>
            {dbError && <NotConfiguredBanner />}

            <div className={styles.statsGrid}>
              {lineGroups.map(g => (
                <div className="card" key={g.line} style={{ padding:'18px', textAlign:'center' }}>
                  <div style={{ fontSize:28, fontFamily:"'Playfair Display',serif", color:LINE_COLORS_MAP[g.line]||'var(--gold)', fontWeight:700 }}>{g.count}</div>
                  <div style={{ fontSize:11, letterSpacing:1, textTransform:'uppercase', color:'var(--muted)', marginTop:4 }}>{g.line}</div>
                </div>
              ))}
            </div>

            <div className={styles.idaHero}>
              <div className={styles.idaLabel}>⭐ The Family Hub</div>
              <h3 className={styles.idaName}>Ida B. Benford · Penny · Johnson</h3>
              <div className={styles.idaDates}>1887 – 1961</div>
              <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, maxWidth:520, margin:'0 auto' }}>
                Born Benford, first married Penny, then married Johnson. She is the single person who connects all three family lines.
              </p>
              <div className={styles.idaMarriages}>
                <div className={styles.marriagePill} style={{ borderColor:'rgba(122,106,176,.4)' }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#9a8acf', marginBottom:3 }}>1st Marriage</div>
                  <div style={{ fontWeight:600 }}>James Roma Penny</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>3 children · d. ~1913</div>
                </div>
                <div className={styles.marriagePill} style={{ borderColor:'rgba(106,158,114,.4)' }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#7abf82', marginBottom:3 }}>2nd Marriage</div>
                  <div style={{ fontWeight:600 }}>William Jenkins Johnson</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>7 children · 1883–1942</div>
                </div>
              </div>
            </div>

            {!dbError && (
              <div className={styles.linesGrid}>
                {['Benford','Penny','Johnson'].map(line => {
                  const lineMembers = members.filter(m=>m.family_line===line).slice(0,8)
                  return (
                    <div className="card" key={line}>
                      <div className={styles.cardHeader} style={{ background:`${LINE_COLORS_MAP[line]}12` }}>
                        <div className={styles.cardIcon} style={{ background:`${LINE_COLORS_MAP[line]}22` }}>
                          {line==='Benford'?'🏛':line==='Penny'?'💜':'🌿'}
                        </div>
                        <div>
                          <div className={styles.cardTitle} style={{ color:LINE_COLORS_MAP[line] }}>{line} Branch</div>
                          <div className={styles.cardMeta}>{members.filter(m=>m.family_line===line).length} members</div>
                        </div>
                      </div>
                      <div style={{ padding:'12px 16px' }}>
                        <ul style={{ listStyle:'none' }}>
                          {lineMembers.map(m => (
                            <li key={m.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0', borderBottom:'1px solid rgba(58,48,32,.35)', fontSize:12 }}>
                              <span style={{ width:6, height:6, borderRadius:'50%', background:LINE_COLORS_MAP[line], flexShrink:0 }} />
                              <span style={{ flex:1 }}>{m.first_name} {m.last_name}</span>
                              {m.birth_date && <span style={{ color:'var(--muted)', fontSize:10 }}>{new Date(m.birth_date).getFullYear()}</span>}
                            </li>
                          ))}
                        </ul>
                        {members.filter(m=>m.family_line===line).length > 8 && (
                          <button onClick={()=>{setFilterLine(line);setActiveTab('directory')}} style={{ marginTop:10, background:'none', border:'none', color:'var(--gold)', fontSize:12, cursor:'pointer', padding:0 }}>
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

        {/* ══════════ FULL LINEAGE ══════════ */}
        {activeTab==='lineage' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background:'var(--gold-lt)' }} />
              <h2>Full Lineage — All Lines</h2>
              <span className={styles.sectionMeta}>Complete family tree by descent</span>
            </div>
            {dbError && <NotConfiguredBanner />}

            {/* Legend */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
              {Object.entries(LINE_COLORS_MAP).map(([line, color]) => (
                <span key={line} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, color:'var(--muted)', background:'var(--card)', border:'1px solid var(--border)', borderRadius:6, padding:'3px 10px' }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:color, display:'inline-block' }} />
                  {line}
                </span>
              ))}
              <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, color:'var(--ida)', background:'rgba(212,96,138,.08)', border:'1px solid rgba(212,96,138,.3)', borderRadius:6, padding:'3px 10px' }}>
                ★ Hub / Key person
              </span>
            </div>

            <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 16px' }}>
              {loading
                ? <p style={{ color:'var(--muted)', textAlign:'center', padding:40 }}>Loading tree…</p>
                : <LineageTree members={members} />
              }
            </div>
          </div>
        )}

        {/* ══════════ SEARCH ══════════ */}
        {activeTab==='search' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background:'#5a7a9a' }} />
              <h2>Search Members</h2>
              <span className={styles.sectionMeta}>Shows the person + all their descendants</span>
            </div>
            {dbError && <NotConfiguredBanner />}

            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search by name — e.g. Leo Johnson, Benford, Annie…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setExpandedSearch(null) }}
                autoFocus
                style={{ fontSize:15, padding:'14px 18px' }}
              />
              {searchQuery && <button onClick={()=>setSearchQuery('')} className={styles.clearBtn}>✕</button>}
            </div>

            {!loading && searchQuery.length >= 2 && searchFiltered.length === 0 && (
              <p style={{ color:'var(--muted)', fontSize:13, textAlign:'center', padding:32 }}>No results for &ldquo;{searchQuery}&rdquo;</p>
            )}

            {!loading && searchQuery.length >= 2 && searchFiltered.length > 0 && (
              <div className={styles.searchResults}>
                <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12 }}>
                  {searchFiltered.length} member{searchFiltered.length!==1?'s':''} found — click to expand descendants
                </div>
                {searchFiltered.map(m => {
                  const descendants = getDescendantsWithDepth(m.id)
                  const isExpanded = expandedSearch === m.id
                  const color = LINE_COLORS_MAP[m.family_line] || '#8a7a60'
                  const path = getAncestryPath(m.id, members)

                  return (
                    <div key={m.id} className={styles.resultItem} style={{ borderColor: isExpanded ? 'var(--gold)' : undefined }}>
                      {/* Member row */}
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <span style={{ width:8, height:8, borderRadius:'50%', background:m.is_hub?'#d4608a':color, flexShrink:0 }} />
                        <span className={styles.resultName}>{m.first_name} {m.last_name}</span>
                        {m.birth_name && <span className={styles.resultBirthName}>née {m.birth_name}</span>}
                        {m.is_hub && <span className={styles.hubBadge}>★ Hub</span>}
                        <span className="badge" style={{ background:`${color}22`, color }}>{m.family_line}</span>
                        {m.birth_date && <span style={{ color:'var(--muted)', fontSize:11 }}>b. {formatDate(m.birth_date)}</span>}
                        {m.death_date && <span style={{ color:'var(--muted)', fontSize:11 }}>d. {formatDate(m.death_date)}</span>}
                        {m.computedAge !== null && <span style={{ color:'var(--muted)', fontSize:11 }}>{m.computedAge} yrs</span>}
                        {descendants.length > 0 && (
                          <button
                            onClick={() => setExpandedSearch(isExpanded ? null : m.id)}
                            style={{ marginLeft:'auto', background:'none', border:`1px solid ${isExpanded?'var(--gold)':'var(--border)'}`, borderRadius:6, color:isExpanded?'var(--gold)':'var(--muted)', fontSize:11, cursor:'pointer', padding:'3px 10px', fontFamily:'inherit' }}
                          >
                            {isExpanded ? '▲ Hide' : `▼ ${descendants.length} descendant${descendants.length!==1?'s':''}`}
                          </button>
                        )}
                        {descendants.length === 0 && (
                          <span style={{ marginLeft:'auto', fontSize:11, color:'var(--muted)' }}>No descendants on record</span>
                        )}
                      </div>

                      {/* Ancestry path */}
                      {path.length > 1 && (
                        <div style={{ fontSize:11, color:'var(--muted)', marginTop:4, paddingLeft:16 }}>
                          📍 {path.map(p=>`${p.first_name} ${p.last_name}`).join(' → ')}
                        </div>
                      )}

                      {/* Spouse */}
                      {m.spouse_name && (
                        <div style={{ fontSize:11, color:'var(--muted)', paddingLeft:16 }}>
                          m. {m.spouse_name}
                        </div>
                      )}

                      {/* Descendants list */}
                      {isExpanded && descendants.length > 0 && (
                        <div style={{ marginTop:12, borderTop:'1px solid var(--border)', paddingTop:12 }}>
                          <div style={{ fontSize:11, color:'var(--gold)', marginBottom:8, letterSpacing:1, textTransform:'uppercase' }}>
                            Descendants of {m.first_name} {m.last_name}
                          </div>
                          {descendants.map(({ member: d, depth, relation }) => (
                            <div key={d.id} style={{
                              display:'flex', alignItems:'center', gap:8, flexWrap:'wrap',
                              paddingLeft: depth * 20,
                              paddingTop:4, paddingBottom:4,
                              borderBottom:'1px solid rgba(58,48,32,.3)',
                              fontSize:12,
                            }}>
                              <span style={{ color:'var(--muted)', fontSize:10, minWidth:130, flexShrink:0 }}>
                                {'└─'.padStart(depth*2,'  ')} {relation}
                              </span>
                              <span style={{ width:6, height:6, borderRadius:'50%', background:LINE_COLORS_MAP[d.family_line]||'#8a7a60', flexShrink:0 }} />
                              <span style={{ fontWeight: depth===1?600:400 }}>{d.first_name} {d.last_name}</span>
                              {d.birth_name && <span style={{ color:'var(--muted)', fontSize:10, fontStyle:'italic' }}>née {d.birth_name}</span>}
                              <span style={{ fontSize:10, padding:'1px 6px', borderRadius:3, background:`${LINE_COLORS_MAP[d.family_line]||'#8a7a60'}18`, color:LINE_COLORS_MAP[d.family_line]||'#8a7a60' }}>{d.family_line}</span>
                              {d.birth_date && <span style={{ color:'var(--muted)', fontSize:10 }}>b. {new Date(d.birth_date).getFullYear()}</span>}
                              {d.death_date && <span style={{ color:'var(--muted)', fontSize:10 }}>d. {new Date(d.death_date).getFullYear()}</span>}
                              {d.computedAge!==null && <span style={{ color:'var(--muted)', fontSize:10 }}>{d.computedAge}y</span>}
                              {d.spouse_name && <span style={{ color:'var(--muted)', fontSize:10 }}>m. {d.spouse_name}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {searchQuery.length < 2 && (
              <p style={{ color:'var(--muted)', fontSize:13, textAlign:'center', padding:32 }}>
                Type at least 2 characters to search
              </p>
            )}
          </div>
        )}

        {/* ══════════ DIRECTORY ══════════ */}
        {activeTab==='directory' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background:'var(--johnson)' }} />
              <h2>Full Directory</h2>
              <span className={styles.sectionMeta}>{directoryFiltered.length} members shown</span>
            </div>
            {dbError && <NotConfiguredBanner />}

            <div className={styles.filterBar}>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {['All',...FAMILY_LINES].map(line => (
                  <button key={line} onClick={()=>setFilterLine(line)}
                    className={`${styles.filterChip} ${filterLine===line?styles.filterChipActive:''}`}
                    style={filterLine===line&&line!=='All'?{ borderColor:LINE_COLORS_MAP[line], color:LINE_COLORS_MAP[line], background:`${LINE_COLORS_MAP[line]}18` }:{}}>
                    {line}
                  </button>
                ))}
              </div>
            </div>

            {loading ? <p style={{ color:'var(--muted)', textAlign:'center', padding:40 }}>Loading…</p> : (
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th onClick={()=>toggleSort('name')} style={{ cursor:'pointer' }}>Name <SortArrow field="name" /></th>
                      <th>Birth Name</th>
                      <th>Line</th>
                      <th onClick={()=>toggleSort('birth_date')} style={{ cursor:'pointer' }}>Born <SortArrow field="birth_date" /></th>
                      <th onClick={()=>toggleSort('death_date')} style={{ cursor:'pointer' }}>Died <SortArrow field="death_date" /></th>
                      <th onClick={()=>toggleSort('age')} style={{ cursor:'pointer' }}>Age <SortArrow field="age" /></th>
                      <th>Parent</th>
                      <th>Spouse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {directoryFiltered.map(m => {
                      const parent = m.parent_id ? members.find(p=>p.id===m.parent_id) : null
                      return (
                        <tr key={m.id}>
                          <td>
                            <span style={{ fontWeight:500 }}>{m.first_name} {m.last_name}</span>
                            {m.is_hub && <span style={{ marginLeft:6, color:'var(--ida)', fontSize:11 }}>★</span>}
                          </td>
                          <td style={{ color:'var(--muted)' }}>{m.birth_name||'—'}</td>
                          <td><span className="badge" style={{ background:`${LINE_COLORS_MAP[m.family_line]}18`, color:LINE_COLORS_MAP[m.family_line] }}>{m.family_line}</span></td>
                          <td style={{ color:'var(--muted)' }}>{formatDate(m.birth_date)}</td>
                          <td style={{ color:'var(--muted)' }}>{formatDate(m.death_date)}</td>
                          <td style={{ color:m.computedAge&&m.computedAge>99?'var(--gold)':'var(--cream)', fontWeight:m.computedAge&&m.computedAge>99?700:400 }}>
                            {m.computedAge!==null?`${m.computedAge} yrs`:'—'}
                          </td>
                          <td style={{ color:'var(--muted)', fontSize:12 }}>
                            {parent ? `${parent.first_name} ${parent.last_name}` : '—'}
                          </td>
                          <td style={{ color:'var(--muted)' }}>{m.spouse_name||'—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════ LONGEVITY ══════════ */}
        {activeTab==='longevity' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background:'#9a6a7a' }} />
              <h2>Longevity Record</h2>
              <span className={styles.sectionMeta}>Top 20 longest-lived members</span>
            </div>
            {dbError && <NotConfiguredBanner />}
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Line</th><th>Born</th><th>Died</th><th>Age</th><th>Visual</th></tr>
                </thead>
                <tbody>
                  {longevityData.map((m,i) => (
                    <tr key={m.id}>
                      <td style={{ color:'var(--muted)', width:40 }}>{i+1}</td>
                      <td style={{ fontWeight:500 }}>{m.first_name} {m.last_name}</td>
                      <td><span className="badge" style={{ background:`${LINE_COLORS_MAP[m.family_line]}18`, color:LINE_COLORS_MAP[m.family_line] }}>{m.family_line}</span></td>
                      <td style={{ color:'var(--muted)' }}>{formatDate(m.birth_date)}</td>
                      <td style={{ color:'var(--muted)' }}>{m.death_date?formatDate(m.death_date):<span style={{ color:'var(--johnson)' }}>Living</span>}</td>
                      <td style={{ color:m.computedAge&&m.computedAge>99?'var(--gold)':'var(--cream)', fontWeight:m.computedAge&&m.computedAge>99?700:400 }}>{m.computedAge} yrs</td>
                      <td><span className="age-bar" style={{ width:Math.round(((m.computedAge??0)/maxAge)*120) }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════ ADD MEMBER ══════════ */}
        {activeTab==='add' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.dot} style={{ background:'var(--ida)' }} />
              <h2>Add a Family Member</h2>
              <span className={styles.sectionMeta}>Connect them to the right branch</span>
            </div>
            {dbError && <NotConfiguredBanner />}

            <div className={styles.formWrap}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formNote}>
                  Search for the parent first — this places the new member in the correct branch and generation automatically.
                </div>

                <div className={styles.formGrid}>

                  {/* ── PARENT SEARCH — most important field, first ── */}
                  <div className={`${styles.field} ${styles.fieldFull}`} ref={parentRef}>
                    <label className={styles.label}>Parent (Father or Mother)</label>
                    <div style={{ position:'relative' }}>
                      <input
                        type="text"
                        placeholder="Search by name — e.g. Cameron Johnson, Leo Johnson…"
                        value={parentSearch}
                        onChange={e => { setParentSearch(e.target.value); setParentDropdownOpen(true); if (!e.target.value) { setSelectedParent(null); setForm(f=>({...f,parent_id:''})) } }}
                        onFocus={() => parentSearch && setParentDropdownOpen(true)}
                        autoComplete="off"
                      />
                      {parentDropdownOpen && parentSuggestions.length > 0 && (
                        <div style={{ position:'absolute', top:'100%', left:0, right:0, zIndex:100, background:'var(--surface)', border:'1px solid var(--gold)', borderRadius:8, marginTop:4, boxShadow:'0 8px 24px rgba(0,0,0,.4)', overflow:'hidden' }}>
                          {parentSuggestions.map(m => {
                            const path = getAncestryPath(m.id, members)
                            const color = LINE_COLORS_MAP[m.family_line]||'#8a7a60'
                            return (
                              <button
                                key={m.id} type="button"
                                onClick={() => selectParent(m)}
                                style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 14px', background:'none', border:'none', borderBottom:'1px solid var(--border)', cursor:'pointer', color:'var(--cream)', fontFamily:'inherit' }}
                                onMouseEnter={e=>(e.currentTarget.style.background='rgba(200,151,58,.08)')}
                                onMouseLeave={e=>(e.currentTarget.style.background='none')}
                              >
                                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                  <span style={{ width:7, height:7, borderRadius:'50%', background:color, flexShrink:0 }} />
                                  <span style={{ fontWeight:600 }}>{m.first_name} {m.last_name}</span>
                                  <span style={{ fontSize:10, padding:'1px 6px', borderRadius:3, background:`${color}18`, color }}>{m.family_line}</span>
                                  {m.birth_date && <span style={{ fontSize:11, color:'var(--muted)' }}>{new Date(m.birth_date).getFullYear()}</span>}
                                </div>
                                {path.length > 1 && (
                                  <div style={{ fontSize:10, color:'var(--muted)', marginTop:3, paddingLeft:15 }}>
                                    📍 {path.map(p=>`${p.first_name} ${p.last_name}`).join(' → ')}
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Selected parent info */}
                    {selectedParent && (
                      <div style={{ marginTop:8, background:'rgba(200,151,58,.06)', border:'1px solid rgba(200,151,58,.3)', borderRadius:8, padding:'10px 14px', fontSize:12 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                          <span style={{ color:'var(--gold)', fontWeight:600 }}>✓ Parent selected:</span>
                          <span style={{ fontWeight:600 }}>{selectedParent.first_name} {selectedParent.last_name}</span>
                          <span style={{ fontSize:10, padding:'1px 6px', borderRadius:3, background:`${LINE_COLORS_MAP[selectedParent.family_line]}18`, color:LINE_COLORS_MAP[selectedParent.family_line] }}>{selectedParent.family_line}</span>
                          <button type="button" onClick={()=>{setSelectedParent(null);setParentSearch('');setForm(f=>({...f,parent_id:''}))}} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:12 }}>✕ Remove</button>
                        </div>
                        <div style={{ color:'var(--muted)', fontSize:11 }}>
                          📍 Full path: {getParentPath(selectedParent)}
                        </div>
                        <div style={{ color:'var(--gold-lt)', fontSize:11, marginTop:3 }}>
                          → New member will be placed in the <strong>{selectedParent.family_line}</strong> branch, as a child of {selectedParent.first_name} {selectedParent.last_name}
                        </div>
                      </div>
                    )}
                    <span className={styles.fieldHint}>
                      {selectedParent ? '' : 'If the parent is not in the system yet, leave blank and set the Family Line manually below.'}
                    </span>
                  </div>

                  {/* Name fields */}
                  <div className={styles.field}>
                    <label className={styles.label}>First Name <span style={{ color:'var(--ida)' }}>*</span></label>
                    <input type="text" placeholder="e.g. Leslie" value={form.first_name} onChange={e=>setForm(f=>({...f,first_name:e.target.value}))} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Last Name <span style={{ color:'var(--ida)' }}>*</span></label>
                    <input type="text" placeholder="e.g. Johnson" value={form.last_name} onChange={e=>setForm(f=>({...f,last_name:e.target.value}))} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Birth / Maiden Name</label>
                    <input type="text" placeholder="Surname at birth (if different)" value={form.birth_name} onChange={e=>setForm(f=>({...f,birth_name:e.target.value}))} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Family Line <span style={{ color:'var(--ida)' }}>*</span></label>
                    <select value={form.family_line} onChange={e=>setForm(f=>({...f,family_line:e.target.value}))}>
                      {FAMILY_LINES.map(l=><option key={l} value={l}>{l}</option>)}
                    </select>
                    {selectedParent && <span className={styles.fieldHint}>Auto-set from parent</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Date of Birth</label>
                    <input type="date" value={form.birth_date} onChange={e=>setForm(f=>({...f,birth_date:e.target.value}))} />
                    <span className={styles.fieldHint}>Age calculates automatically.</span>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Date of Death</label>
                    <input type="date" value={form.death_date} onChange={e=>setForm(f=>({...f,death_date:e.target.value}))} />
                    <span className={styles.fieldHint}>Leave blank if still living.</span>
                  </div>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label}>Spouse / Partner Name</label>
                    <input type="text" placeholder="Full name of spouse or partner" value={form.spouse_name} onChange={e=>setForm(f=>({...f,spouse_name:e.target.value}))} />
                  </div>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label}>Notes</label>
                    <textarea rows={3} placeholder="Additional context — children, location, occupation, etc." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
                  </div>

                  {/* Age preview */}
                  {form.birth_date && (
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <div className={styles.agePreview}>
                        <span style={{ color:'var(--muted)', fontSize:12 }}>Age preview:</span>
                        <span style={{ color:'var(--gold)', fontWeight:700, fontSize:18, fontFamily:"'Playfair Display',serif" }}>
                          {calculateAge(form.birth_date, form.death_date||null)} years
                        </span>
                        <span style={{ color:'var(--muted)', fontSize:12 }}>{form.death_date?'(at time of death)':'(current age)'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {submitMsg && (
                  <div className={`${styles.alert} ${submitMsg.type==='success'?styles.alertSuccess:styles.alertError}`}>
                    {submitMsg.type==='success'?'✓ ':'✕ '}{submitMsg.text}
                  </div>
                )}

                <div style={{ display:'flex', gap:12, marginTop:8 }}>
                  <button type="submit" className="btn btn-gold" disabled={submitting}>
                    {submitting?'Saving…':'Add to Family Tree'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={()=>{
                    setForm({first_name:'',last_name:'',birth_name:'',birth_date:'',death_date:'',family_line:'Benford',parent_id:'',spouse_name:'',notes:'',is_hub:false})
                    setSelectedParent(null); setParentSearch(''); setSubmitMsg(null)
                  }}>Clear</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
