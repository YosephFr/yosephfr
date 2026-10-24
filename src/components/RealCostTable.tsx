'use client'

import { useState } from 'react'
import { REAL_COST_ROWS, realCostCopy } from '@/data/real-cost'
import type { Lang } from '@/lib/lang'

type Key = 'model' | 'seconds' | 'usd'
type Dir = 'asc' | 'desc'

const COLUMN: Record<Key, 'model' | 'time' | 'cost'> = { model: 'model', seconds: 'time', usd: 'cost' }

export default function RealCostTable({ lang }: { lang: Lang }) {
  const t = realCostCopy(lang)
  const [sort, setSort] = useState<{ key: Key; dir: Dir } | null>(null)
  const rows = [...REAL_COST_ROWS].sort((a, b) => {
    if (!sort) return 0
    const diff = sort.key === 'model' ? a.model.localeCompare(b.model) : a[sort.key] - b[sort.key]
    return sort.dir === 'asc' ? diff : -diff
  })

  function toggle(key: Key) {
    setSort(current => current?.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
  }

  function ariaSort(key: Key): 'ascending' | 'descending' | 'none' {
    if (sort?.key !== key) return 'none'
    return sort.dir === 'asc' ? 'ascending' : 'descending'
  }

  return (
    <div className="tabla-medicion">
      <table>
        <caption className="solo-lector">{t.caption}</caption>
        <thead>
          <tr>
            {(['model', 'seconds', 'usd'] as const).map(key => (
              <th key={key} scope="col" aria-sort={ariaSort(key)}>
                <button type="button" onClick={() => toggle(key)} aria-label={`${t.sort} ${t.columns[COLUMN[key]]}`}>
                  {t.columns[COLUMN[key]]}
                  {sort?.key === key && <span className="orden" aria-hidden="true">{sort.dir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.model}>
              <th scope="row">{row.model}</th>
              <td>{row.time}</td>
              <td>{row.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
