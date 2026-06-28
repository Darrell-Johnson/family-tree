import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.landing}>
      <div className={styles.ambient} aria-hidden="true" />

      {/* ── TREE LOGO — redesigned: Benford center & dominant ── */}
      <div className={styles.logoWrap}>
        <svg
          className={styles.treeSvg}
          viewBox="0 0 320 310"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Family tree illustration"
        >
          {/* ── TRUNK ── */}
          <rect x="152" y="210" width="16" height="76" rx="8" fill="#2e2618" />
          <rect x="155" y="215" width="10" height="70" rx="5" fill="#c8973a" opacity="0.20" />

          {/* ── ROOTS ── */}
          <path d="M160 284 Q136 290 118 300" stroke="#2e2618" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <path d="M160 284 Q184 290 202 300" stroke="#2e2618" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <path d="M160 280 Q148 286 138 295" stroke="#2e2618" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M160 280 Q172 286 182 295" stroke="#2e2618" strokeWidth="3" strokeLinecap="round" fill="none"/>

          {/* ── MAIN BRANCHES ── */}
          {/* Left → Penny */}
          <path d="M156 212 Q110 185 72 155" stroke="#2e2618" strokeWidth="7" strokeLinecap="round" fill="none"/>
          {/* Right → Johnson */}
          <path d="M164 212 Q210 185 248 155" stroke="#2e2618" strokeWidth="7" strokeLinecap="round" fill="none"/>
          {/* Center → Benford (taller, thicker = dominant) */}
          <path d="M160 208 Q160 160 160 110" stroke="#2e2618" strokeWidth="10" strokeLinecap="round" fill="none"/>

          {/* ── GOLD ACCENT ON CENTER BRANCH ── */}
          <path d="M160 208 Q160 160 160 110" stroke="#c8973a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35"/>

          {/* ── BENFORD — center, large, dominant (gold) ── */}
          {/* outer glow */}
          <circle cx="160" cy="76" r="62" fill="#c8973a" opacity="0.07"/>
          {/* mid layer */}
          <circle cx="160" cy="76" r="50" fill="#c8973a" opacity="0.13"/>
          {/* inner layers */}
          <circle cx="148" cy="68" r="36" fill="#c8973a" opacity="0.22"/>
          <circle cx="172" cy="72" r="30" fill="#c8973a" opacity="0.20"/>
          <circle cx="160" cy="58" r="28" fill="#c8973a" opacity="0.28"/>
          <circle cx="160" cy="70" r="22" fill="#c8973a" opacity="0.32"/>
          {/* bright top */}
          <circle cx="160" cy="54" r="16" fill="#c8973a" opacity="0.38"/>

          {/* ── PENNY — left, medium (purple) ── */}
          <circle cx="68" cy="130" r="42" fill="#7a6ab0" opacity="0.08"/>
          <circle cx="62" cy="124" r="30" fill="#7a6ab0" opacity="0.16"/>
          <circle cx="76" cy="120" r="24" fill="#7a6ab0" opacity="0.18"/>
          <circle cx="66" cy="110" r="20" fill="#7a6ab0" opacity="0.26"/>
          <circle cx="78" cy="106" r="14" fill="#7a6ab0" opacity="0.30"/>

          {/* ── JOHNSON — right, medium (green) ── */}
          <circle cx="252" cy="130" r="42" fill="#6a9e72" opacity="0.08"/>
          <circle cx="246" cy="124" r="30" fill="#6a9e72" opacity="0.16"/>
          <circle cx="260" cy="120" r="24" fill="#6a9e72" opacity="0.18"/>
          <circle cx="250" cy="110" r="20" fill="#6a9e72" opacity="0.26"/>
          <circle cx="262" cy="106" r="14" fill="#6a9e72" opacity="0.30"/>

          {/* ── SUBTLE BRANCH GLOW ── */}
          <path d="M156 212 Q110 185 72 155" stroke="#7a6ab0" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.25"/>
          <path d="M164 212 Q210 185 248 155" stroke="#6a9e72" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.25"/>

          {/* ── IDA STAR — junction of all three ── */}
          <circle cx="160" cy="212" r="12" fill="#d4608a" opacity="0.15"/>
          <circle cx="160" cy="212" r="9"  fill="#d4608a" opacity="0.85"/>
          <path d="M160 203.5 L161.9 209.5h6.3l-5.1 3.7 1.9 5.9-5-3.6-5 3.6 1.9-5.9-5.1-3.7h6.3z" fill="#fff" opacity="0.95"/>

          {/* ── LABELS ── */}
          {/* Benford — centered under its canopy, bold */}
          <text x="160" y="148" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="13" fill="#e8b85a" opacity="0.95" fontWeight="700" letterSpacing="0.5">Benford</text>

          {/* Penny — left */}
          <text x="52" y="158" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="10" fill="#9a8acf" opacity="0.90" fontWeight="600">Penny</text>

          {/* Johnson — right */}
          <text x="264" y="158" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="10" fill="#7abf82" opacity="0.90" fontWeight="600">Johnson</text>
        </svg>
      </div>

      {/* ── HEADLINE ── */}
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Est. 1854 · A Living Record</p>
        <h1 className={styles.title}>
          The{' '}
          <span style={{ color: 'var(--gold)' }}>Benford</span>
          {' · '}
          <span style={{ color: '#9a8acf' }}>Penny</span>
          {' · '}
          <span style={{ color: '#7abf82' }}>Johnson</span>
          <br />
          Family Tree
        </h1>
        <p className={styles.subtitle}>
          Three family lines, one shared story. Born Benford, bound by Penny, carried forward by Johnson —
          this record grows with every generation that adds to it.
        </p>

        <div className={styles.hubNote}>
          <span className={styles.hubStar}>★</span>
          <span>
            <strong style={{ color: 'var(--ida)' }}>Ida B. Benford-Penny-Johnson</strong>
            {' '}— the woman who connects all three lines
          </span>
        </div>
      </div>

      {/* ── NAV CARDS ── */}
      <div className={styles.navGrid}>
        <Link href="/tree" className={styles.navCard}>
          <div className={styles.navIcon}>🌳</div>
          <div className={styles.navLabel}>Browse the Tree</div>
          <div className={styles.navDesc}>Explore all family members by line, search by name or surname, and view the full directory.</div>
          <div className={styles.navArrow}>→</div>
        </Link>
        <Link href="/tree?tab=add" className={styles.navCard} style={{ borderColor: 'rgba(212,96,138,0.3)' }}>
          <div className={styles.navIcon}>✦</div>
          <div className={styles.navLabel}>Add a Member</div>
          <div className={styles.navDesc}>Know someone who belongs here? Add their name, dates, and family line to keep the record growing.</div>
          <div className={styles.navArrow}>→</div>
        </Link>
      </div>

      {/* ── STATS STRIP ── */}
      <div className={styles.statsStrip}>
        <div className={styles.stat}>
          <span className={styles.statNum}>103+</span>
          <span className={styles.statLabel}>Members</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>3</span>
          <span className={styles.statLabel}>Family Lines</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>170+</span>
          <span className={styles.statLabel}>Years of History</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>5+</span>
          <span className={styles.statLabel}>Generations</span>
        </div>
      </div>

      <footer className={styles.footer}>
        A family record — maintained with love, open to all who belong.
      </footer>
    </main>
  )
}
