'use client'

import { Member } from '../../lib/supabase'

interface LineageTreeProps {
  members: (Member & { computedAge: number | null })[]
}

// ── CSS class equivalents as inline styles matching the original HTML exactly ──
const styles = {
  wrap: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '24px',
    fontFamily: "'Inter', monospace",
    fontSize: 12,
    lineHeight: 2,
    color: 'var(--cream)',
    overflowX: 'auto' as const,
  },
  g1: { color: '#e8b85a', fontWeight: 700, fontSize: 14, display: 'block' as const },
  g2: { paddingLeft: 24, color: 'var(--cream)', fontWeight: 600, display: 'block' as const },
  g3: { paddingLeft: 48, color: '#b0a888', display: 'block' as const },
  g4: { paddingLeft: 72, color: '#807860', display: 'block' as const },
  g5: { paddingLeft: 96, color: '#604848', display: 'block' as const },
  married: { color: '#c8973a' },
  divider: { display: 'block' as const, height: 16 },
  sectionLabel: {
    display: 'block' as const,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    color: '#8a7a60',
    borderTop: '1px solid #3a3020',
    paddingTop: 16,
    marginBottom: 8,
    marginTop: 8,
  }
}

function M({ text }: { text: string }) {
  return <span style={styles.married}>{text}</span>
}

function G1({ children }: { children: React.ReactNode }) {
  return <p style={styles.g1}>{children}</p>
}
function G2({ children }: { children: React.ReactNode }) {
  return <p style={styles.g2}>{children}</p>
}
function G3({ children }: { children: React.ReactNode }) {
  return <p style={styles.g3}>{children}</p>
}
function G4({ children }: { children: React.ReactNode }) {
  return <p style={styles.g4}>{children}</p>
}
function G5({ children }: { children: React.ReactNode }) {
  return <p style={styles.g5}>{children}</p>
}

export default function LineageTree({ members }: LineageTreeProps) {
  // Find a member by name fragment for dynamic linking (future use)
  // For now render the full static lineage exactly like the HTML file

  return (
    <div style={styles.wrap}>

      {/* ══════════════════════════════════════════════════════
          RICHARD ISRAEL JOHNSON LINE
      ══════════════════════════════════════════════════════ */}
      <span style={styles.sectionLabel}>Johnson Paternal Line</span>

      <G1>1 &nbsp;Richard Israel Johnson 1868 &nbsp;<M text="+ Margaret Mothershed-Johnson 1869" /></G1>

      <G2>2 &nbsp;William Jenkins Johnson 1883–1942 &nbsp;<M text="+ Niece Abraham-Johnson 1886" /></G2>
      <G3>3 &nbsp;Ocie Mae Johnson-Adams 1905–1955 &nbsp;<M text="+ William Adams" /></G3>
      <G4>4 &nbsp;Frances Adams-Chandler 1931 &nbsp;<M text="+ Joseph Chandler" /></G4>
      <G5>5 &nbsp;Phyllis CeCelia Chandler 1952–1995 &nbsp;<M text="+ Henry Peeples" /></G5>
      <G5>5 &nbsp;Charles Chandler &nbsp;<M text="+ Diane Cox" /></G5>
      <G4>4 &nbsp;William Adams, Jr. 1933–2009</G4>
      <G4>4 &nbsp;Lillie Mae Adams-Bramlett 1936–1998 &nbsp;<M text="+ William Bramlett" /></G4>
      <G5>5 &nbsp;Robin Bramlett</G5>

      <G3>3 &nbsp;William Mansfield Johnson 1906–2011 &nbsp;<M text="+ Earlina Dennis-Johnson" /></G3>
      <G4>4 &nbsp;Ruby Mae Johnson-Gibson</G4>
      <G3>3 &nbsp;William Mansfield Johnson &nbsp;<M text="+ Fatrie Jenkins-Johnson" /></G3>
      <G4>4 &nbsp;William Mansfield Johnson, Jr. &nbsp;·&nbsp; Rudolph L. Johnson</G4>

      <G3>3 &nbsp;Robert Mencer Johnson 1908–1995 &nbsp;<M text="+ Gladys Johnson" /></G3>
      <G4>4 &nbsp;Lorinzo Johnson &nbsp;·&nbsp; Nathaniel Johnson &nbsp;·&nbsp; Calvin Johnson &nbsp;·&nbsp; Carrie Johnson &nbsp;·&nbsp; Niece Johnson &nbsp;·&nbsp; Jacqueline Johnson</G4>
      <G3>3 &nbsp;Robert Mencer Johnson &nbsp;<M text="+ Catherine Fobbs" /></G3>
      <G4>4 &nbsp;Robert Menser Johnson, Jr. &nbsp;·&nbsp; Alvin Johnson &nbsp;·&nbsp; Ora Lee Johnson-Williams</G4>

      <G3>3 &nbsp;A.C. Johnson 1910–2012 &nbsp;<M text="+ Gay Bertha Johnson 1914–1982" /></G3>
      <G3>3 &nbsp;A.C. Johnson &nbsp;<M text="+ Castella Rolfe-Johnson" /></G3>

      <G3>3 &nbsp;Lillie Belle Johnson-Stevenson 1912–1963 &nbsp;<M text="+ Leslie 'Johnny' Stevenson" /></G3>
      <G4>4 &nbsp;Betty Jean Logan-Gracey 1932</G4>

      <G2>2 &nbsp;William Jenkins Johnson 1883–1942 &nbsp;<M text="+ Ida B. Benford-Penny-Johnson 1887–1961 ⭐" /></G2>
      <G3>3 &nbsp;Willie &quot;Tott&quot; Johnson 1915–2006</G3>
      <G3>3 &nbsp;Roy Johnson 1917–1988</G3>
      <G3>3 &nbsp;Raymond Johnson 1918–1994 &nbsp;<M text="+ Juanita Andrews-Johnson 1922" /></G3>
      <G4>4 &nbsp;Tommy Andrews &nbsp;·&nbsp; Kevin Johnson &nbsp;·&nbsp; April Joy Johnson &nbsp;·&nbsp; Teresa Johnson &nbsp;·&nbsp; Sherry Johnson</G4>
      <G3>3 &nbsp;Milton Lovell Johnson 1921–1988 &nbsp;<M text="+ Johnnye Lee Carter-Johnson" /></G3>
      <G3>3 &nbsp;Ida Lucille Johnson-Francisco 1923–2000 &nbsp;<M text="+ Felix Francisco 1924–2008" /></G3>
      <G4>4 &nbsp;Felix Oliver James Francisco &nbsp;·&nbsp; Evelyn Francisco &nbsp;·&nbsp; Elaine Francisco &nbsp;·&nbsp; Loretta Lavern Francisco &nbsp;·&nbsp; Kenneth Francisco &nbsp;·&nbsp; Marva Francisco &nbsp;·&nbsp; Melva Francisco</G4>
      <G3>3 &nbsp;Jewel Leon Johnson b. 1926 &nbsp;<M text="+ Delores Droke-Johnson" /></G3>
      <G4>4 &nbsp;Darrell Johnson &nbsp;·&nbsp; Dwight Johnson &nbsp;·&nbsp; Dwayne Johnson</G4>
      <G3>3 &nbsp;Leo Johnson b. 1928 &nbsp;<M text="+ Lucille Taylor-Johnson" /></G3>
      <G4>4 &nbsp;Linda Johnson &nbsp;·&nbsp; Sylvia Johnson &nbsp;·&nbsp; Larry Johnson &nbsp;·&nbsp; Brenda Johnson &nbsp;·&nbsp; Ronald Johnson &nbsp;·&nbsp; Sandra Johnson &nbsp;·&nbsp; Glenda Johnson &nbsp;·&nbsp; Barry Johnson &nbsp;·&nbsp; Beverly Johnson &nbsp;·&nbsp; Debbie Johnson &nbsp;·&nbsp; Leo Johnson, Jr.</G4>

      <G2>2 &nbsp;Hagar Johnson 1884 &nbsp;<M text="+ Joshua Dixon" /></G2>
      <G3>3 &nbsp;Joshua Dixon, Jr.</G3>
      <G3>3 &nbsp;Jettie Mae Dixon &nbsp;<M text="+ Zacharia Banks" /></G3>
      <G4>4 &nbsp;Zerah Banks &nbsp;·&nbsp; Leo Earnest Banks &nbsp;·&nbsp; Robert Banks &nbsp;·&nbsp; Lennest Banks &nbsp;·&nbsp; Juanita Banks &nbsp;·&nbsp; Joe Nathan Banks</G4>
      <G3>3 &nbsp;J.D. Dixon &nbsp;·&nbsp; Rosie Lee Dixon &nbsp;·&nbsp; Inez Dixon &nbsp;·&nbsp; Euradell Dixon-Childs &nbsp;·&nbsp; Purnese Dixon-Hamilton &nbsp;·&nbsp; Anita Dixon &nbsp;·&nbsp; Naomi Dixon</G3>

      <G2>2 &nbsp;Jewel Johnson b. 1890</G2>
      <G2>2 &nbsp;Hedgwood Johnson 1891</G2>

      <G2>2 &nbsp;Israel Johnson 1900–1991 &nbsp;<M text="+ Beatrice Mary Norling-Johnson" /></G2>
      <G3>3 &nbsp;Ederson Johnson</G3>
      <G3>3 &nbsp;Eddie Robert Johnson 1936–2007 &nbsp;<M text="+ Clarissa Bowers-Johnson" /></G3>
      <G4>4 &nbsp;Rofreca Johnson-Carter &nbsp;·&nbsp; Denise Johnson &nbsp;·&nbsp; Makeba Johnson &nbsp;·&nbsp; Stephen Johnson &nbsp;·&nbsp; Kevin Johnson</G4>

      <G2>2 &nbsp;Tera Johnson &nbsp;<M text="+ Spouse unknown" /></G2>
      <G3>3 &nbsp;Susie Johnson</G3>
      <G4>4 &nbsp;Oteria Johnson</G4>

      {/* ══════════════════════════════════════════════════════
          MILTON BENFORD LINE
      ══════════════════════════════════════════════════════ */}
      <span style={{ ...styles.sectionLabel, marginTop: 24 }}>Benford Family Line</span>

      <G1>1 &nbsp;Milton Benford 1854 &nbsp;<M text="+ Melvenia Safronia Norseweather-Benford 1861" /></G1>

      <G2>2 &nbsp;Thomas Benford 1882</G2>
      <G2>2 &nbsp;Parlee Benford 1883</G2>

      <G2>2 &nbsp;Luvenia Benford-Holley 1884 &nbsp;<M text="+ Emmit Holley 1880" /></G2>
      <G3>3 &nbsp;Vesti Holley &nbsp;·&nbsp; Altine (Alteen) Holley &nbsp;·&nbsp; Lavell Holley &nbsp;·&nbsp; J.D. Holley &nbsp;·&nbsp; Matthew Holley 1904</G3>

      <G2>2 &nbsp;Ida B. Benford-Penny-Johnson 1887–1961 &nbsp;<M text="+ James Roma Penny –1913 ⭐" /></G2>
      <G3>3 &nbsp;Annie Mae Penny-Bell 1908–1977 &nbsp;<M text="+ Isaac Bell" /></G3>
      <G4>4 &nbsp;Alfred Bell &nbsp;·&nbsp; Athra Mae Bell 1931–1938</G4>
      <G3>3 &nbsp;Rosie Lee Penny-Moland 1911–1985 &nbsp;<M text="+ William 'Bill' Moland" /></G3>
      <G4>4 &nbsp;Gladys Moland-Montgomery &nbsp;·&nbsp; Gracie Moland &nbsp;·&nbsp; Clifford Moland &nbsp;·&nbsp; Clarence Moland &nbsp;·&nbsp; Carl Moland &nbsp;·&nbsp; Ida Moland-Hagen &nbsp;·&nbsp; Bill Moland &nbsp;·&nbsp; Betty Moland &nbsp;·&nbsp; Rose Mary Moland-Dayers &nbsp;·&nbsp; Aulah Moland &nbsp;·&nbsp; Leroy Moland &nbsp;·&nbsp; Calvin Moland &nbsp;·&nbsp; Linda Moland &nbsp;·&nbsp; Terry Moland &nbsp;·&nbsp; Macy Moland &nbsp;·&nbsp; O&apos;Neil Moland &nbsp;·&nbsp; Karen Moland</G4>
      <G3>3 &nbsp;James Roma Penny, Jr. 1912–1987 &nbsp;<M text="+ Hanna Gray-Penny" /></G3>
      <G3>3 &nbsp;James Roma Penny, Jr. &nbsp;<M text="+ Kathryn Spights-Penny" /></G3>
      <G4>4 &nbsp;Kerry L. Penny &nbsp;·&nbsp; James Roma Penny III</G4>

      <G2>2 &nbsp;Mary Benford 1889</G2>
      <G2>2 &nbsp;Jennie Benford 1891</G2>

      <G2>2 &nbsp;Burlie Benford 1892 &nbsp;<M text="+ Minnie C. Wilson-Benford" /></G2>
      <G3>3 &nbsp;Pearl Benford-Miles 1913–1998 &nbsp;<M text="+ Alfred Miles" /></G3>
      <G4>4 &nbsp;Alfred Glen Miles</G4>
      <G3>3 &nbsp;Fred Benford &nbsp;<M text="+ Ethel Beatrice Benford" /></G3>
      <G4>4 &nbsp;Freddye Mae Benford &nbsp;·&nbsp; Lavell Benford</G4>
      <G3>3 &nbsp;Bessie Bea Benford 1920–2008</G3>
      <G4>4 &nbsp;William Avery Benford, Jr. &nbsp;·&nbsp; Burley Duane Benford &nbsp;·&nbsp; Althea Marie Benford &nbsp;·&nbsp; Kermit DeKoven Benford &nbsp;·&nbsp; Wendell Lynn Benford &nbsp;·&nbsp; Michael Edwin Benford &nbsp;·&nbsp; Pearl Rena Benford</G4>
      <G3>3 &nbsp;Burley Marie Benford-Black b. 1923 &nbsp;<M text="+ Ernest Lee Black 1923–2012" /></G3>
      <G4>4 &nbsp;Benita Black-White</G4>

      <G2>2 &nbsp;Alice Benford</G2>

      <G2>2 &nbsp;William Moses Benford 1898</G2>
      <G3>3 &nbsp;William Benford &nbsp;·&nbsp; James Benford &nbsp;·&nbsp; Audrey Deloris Benford</G3>

      {/* ══════════════════════════════════════════════════════
          DYNAMIC MEMBERS — added via the form
          Members with parent_id set will show their path here
      ══════════════════════════════════════════════════════ */}
      {(() => {
        // Show newly added members that have parent connections
        const newMembers = members.filter(m => m.created_at && new Date(m.created_at) > new Date('2024-01-01'))
        if (newMembers.length === 0) return null
        return (
          <>
            <span style={{ ...styles.sectionLabel, marginTop: 24 }}>Recently Added Members</span>
            {newMembers.map(m => (
              <G3 key={m.id}>
                ✦ &nbsp;{m.first_name} {m.last_name}
                {m.birth_date ? ` ${new Date(m.birth_date).getFullYear()}` : ''}
                {m.death_date ? `–${new Date(m.death_date).getFullYear()}` : ''}
                {m.spouse_name ? <M text={` + ${m.spouse_name}`} /> : null}
                {m.notes ? <span style={{ color: '#8a7a60', fontSize: 11 }}> &nbsp;· {m.notes}</span> : null}
              </G3>
            ))}
          </>
        )
      })()}

    </div>
  )
}
