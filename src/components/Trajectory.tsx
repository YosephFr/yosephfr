import type { CSSProperties } from 'react'
import { EXPERIENCE } from '@/data/experience'
import { EDUCATION } from '@/data/education'
import { EDUCATION_EN } from '@/data/cv-en'
import { EXPERIENCE_EN, type Lang } from '@/lib/lang'

function span(period: string, now: number) {
  const match = period.match(/(\d{4})\s*[–-]\s*(\d{4}|act)/i)
  if (!match) return null
  return { from: Number(match[1]), to: match[2].toLowerCase().startsWith('act') ? now : Number(match[2]), current: match[2].toLowerCase().startsWith('act') }
}

// Años de trabajo y formación en una misma retícula de puntos.
export default function Trajectory({ lang = 'es' }: { lang?: Lang }) {
  const now = new Date().getFullYear()
  const en = lang === 'en'
  // El período se interpreta siempre desde el dato en español («act»); solo la etiqueta visible cambia de idioma.
  const groups = [
    { name: en ? 'Work' : 'Trabajo', className: 'grupo-trabajo', rows: EXPERIENCE.map(e => ({ label: en ? EXPERIENCE_EN[e.slug]?.title ?? e.title : e.title, period: e.period })) },
    { name: en ? 'Education' : 'Formación', className: 'grupo-formacion', rows: EDUCATION.map(e => ({ label: en ? EDUCATION_EN[e.degree]?.degree ?? e.degree : e.degree, period: e.period })) },
  ].map(group => ({ ...group, rows: group.rows.map(row => ({ ...row, span: span(row.period, now) })).filter(row => row.span) }))
  const first = Math.min(...groups.flatMap(g => g.rows.map(r => r.span!.from)))
  const years = Array.from({ length: now - first + 1 }, (_, i) => first + i)
  const present = en ? 'present' : 'actualidad'
  const pretty = (period: string) => period.replace(/\s*-\s*act$/i, `–${present}`).replace(/\s*-\s*/, '–').replace(/actualidad$/, present)
  return (
    <figure className="lamina trayectoria" style={{ '--anios': years.length } as CSSProperties}>
      <h2>{en ? 'Timeline' : 'Trayectoria'}</h2>
      {groups.map(group => (
        <div key={group.name} className={`trayectoria-grupo ${group.className}`}>
          {group.rows.map(row => (
            <div key={row.label} className="trayectoria-fila">
              <div className="trayectoria-nombre"><span>{row.label}</span><span>{pretty(row.period)}</span></div>
              <div className="trayectoria-puntos" aria-hidden="true">
                {years.map(year => {
                  const inside = year >= row.span!.from && year <= row.span!.to
                  const nowCell = inside && row.span!.current && year === now
                  return <i key={year} className={nowCell ? 'lleno ahora' : inside ? 'lleno' : undefined} />
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="trayectoria-anios" aria-hidden="true">
        {years.map(year => <span key={year}>{years.length > 8 ? `’${String(year).slice(2)}` : year}</span>)}
      </div>
    </figure>
  )
}
