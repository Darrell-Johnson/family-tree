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

/** Find a member by exact first + last name */
export function findMember<T extends Member>(members: T[], firstName: string, lastName: string): T | undefined {
  return members.find(m => m.first_name === firstName && m.last_name === lastName)
}

/** Direct children of a member, sorted by birth date then name */
export function getChildren<T extends Member>(parentId: string, members: T[]): T[] {
  return members
    .filter(m => m.parent_id === parentId)
    .sort((a, b) => {
      if (a.birth_date && b.birth_date) return a.birth_date.localeCompare(b.birth_date)
      return (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name)
    })
}

/** All descendants of a member with depth (1 = child) and relation label */
export function getDescendantsWithDepth<T extends Member>(
  memberId: string,
  members: T[]
): { member: T; depth: number; relation: string }[] {
  const result: { member: T; depth: number; relation: string }[] = []
  function walk(id: string, depth: number) {
    for (const child of getChildren(id, members)) {
      const relation =
        depth === 1 ? 'Child' : depth === 2 ? 'Grandchild' : depth === 3 ? 'Great-grandchild' : `Great×${depth - 2}-grandchild`
      result.push({ member: child, depth, relation })
      walk(child.id, depth + 1)
    }
  }
  walk(memberId, 1)
  return result
}

export const GENERATION_SUFFIXES: Record<number, string> = {
  1: 'child',
  2: 'grandchild',
  3: 'great-grandchild',
  4: 'great-great-grandchild',
  5: 'great-great-great-grandchild',
}
