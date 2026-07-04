import { Member, calculateAge } from '../../lib/supabase'
export type { Member }; export { calculateAge }

export const LINE_COLORS_MAP: Record<string, string> = {
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

/** Return all descendants (children, grandchildren, etc.) of a member */
export function getDescendants(memberId: string, allMembers: Member[]): Member[] {
  const result: Member[] = []
  const queue = allMembers.filter(m => m.parent_id === memberId)
  while (queue.length > 0) {
    const current = queue.shift()!
    result.push(current)
    const children = allMembers.filter(m => m.parent_id === current.id)
    queue.push(...children)
  }
  return result
}

/** Return generation number relative to a root (1 = root, 2 = child, etc.) */
export function getGeneration(memberId: string, allMembers: Member[]): number {
  let gen = 1
  let current = allMembers.find(m => m.id === memberId)
  while (current?.parent_id) {
    gen++
    current = allMembers.find(m => m.id === current!.parent_id)
    if (gen > 20) break // safety
  }
  return gen
}

/** Return the ancestry path as an array from root to member */
export function getAncestryPath(memberId: string, allMembers: Member[]): Member[] {
  const path: Member[] = []
  let current = allMembers.find(m => m.id === memberId)
  while (current) {
    path.unshift(current)
    current = current.parent_id ? allMembers.find(m => m.id === current!.parent_id) : undefined
  }
  return path
}

export const GENERATION_SUFFIXES: Record<number, string> = {
  1: 'child',
  2: 'grandchild',
  3: 'great-grandchild',
  4: 'great-great-grandchild',
  5: 'great-great-great-grandchild',
}
