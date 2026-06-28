import { Suspense } from 'react'
import TreeClient from '../components/TreeClient'

export default function TreePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a7a60', fontFamily: 'Inter, sans-serif' }}>
        Loading family tree…
      </div>
    }>
      <TreeClient />
    </Suspense>
  )
}
