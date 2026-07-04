import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type Member = {
  id: string
  first_name: string
  last_name: string
  birth_name: string | null
  birth_date: string | null
  death_date: string | null
  age: number | null
  family_line: string
  parent_id: string | null
  spouse_name: string | null
  notes: string | null
  is_hub: boolean
  created_at: string
}

export type NewMember = Omit<Member, 'id' | 'age' | 'created_at'>

// Lazy singleton — only creates the client when first needed, not at module load
let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url.includes('your_supabase') || url === 'https://placeholder.supabase.co') {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }
  _client = createClient(url, key)
  return _client
}

// Keep the named export for backward compat — but make it a proxy
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient]
  },
})

// ── Helpers ──────────────────────────────────────────────────

export function calculateAge(birthDate: string | null, deathDate: string | null): number | null {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  const end = deathDate ? new Date(deathDate) : new Date()
  if (isNaN(birth.getTime())) return null
  let age = end.getFullYear() - birth.getFullYear()
  const monthDiff = end.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) age--
  return age >= 0 ? age : null
}

// Nobody with a recorded birth date but no death date has plausibly stayed alive past this age —
// treat them as deceased with an unrecorded death date rather than "Living" at 150+ years old.
const MAX_PLAUSIBLE_LIVING_AGE = 110

export type LifeStatus = 'living' | 'deceased' | 'unknown'

export function getLifeStatus(birthDate: string | null, deathDate: string | null): LifeStatus {
  if (deathDate) return 'deceased'
  const currentAge = calculateAge(birthDate, null)
  if (currentAge !== null && currentAge > MAX_PLAUSIBLE_LIVING_AGE) return 'unknown'
  return 'living'
}

// Age to display for stored records: real age at death, current age if plausibly still living,
// or null if the person has no death date recorded but can no longer plausibly be alive.
export function getDisplayAge(birthDate: string | null, deathDate: string | null): number | null {
  if (getLifeStatus(birthDate, deathDate) === 'unknown') return null
  return calculateAge(birthDate, deathDate)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const FAMILY_LINES = [
  'Benford', 'Penny', 'Johnson', 'Holley',
  'Moland', 'Bell', 'Miles', 'Dixon', 'Mothershed', 'Other',
]
