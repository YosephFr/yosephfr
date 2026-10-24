import { EDUCATION, CERTIFICATIONS } from '@/data/education'
import DotIcon from '@/components/dots/DotIcon'
import { CERTIFICATIONS_EN, EDUCATION_EN } from '@/data/cv-en'
import type { Lang } from '@/lib/lang'

export default function Education({ lang = 'es' }: { lang?: Lang }) {
  const en = lang === 'en'
  return (
    <section id="formacion" className="marco seccion">
      <div className="seccion-cabeza"><h2>{en ? 'Education' : 'Formación'}</h2></div>
      <div className="formacion-columnas">
        <div className="formacion-bloque">
          <h3>{en ? 'Studies' : 'Estudios'}</h3>
          <div className="formacion-rejilla">
            {EDUCATION.map(e => (
              <div key={e.institution} className="lamina formacion-item">
                <h4>{en ? EDUCATION_EN[e.degree]?.degree ?? e.degree : e.degree}</h4>
                <p>{e.institution}</p>
                <p>{e.period.replace(/\s*-\s*act$/i, en ? '–present' : '–actualidad').replace(/\s*-\s*/, '–')}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="formacion-bloque">
          <h3>{en ? 'Certifications' : 'Certificaciones'}</h3>
          <div className="formacion-rejilla">
            {CERTIFICATIONS.map(c => (
              <div key={c.name} className="lamina formacion-item">
                <h4>{en ? CERTIFICATIONS_EN[c.name]?.name ?? c.name : c.name}</h4>
                <p>{c.institution}{(en ? CERTIFICATIONS_EN[c.name]?.date ?? c.date : c.date) ? ` · ${en ? CERTIFICATIONS_EN[c.name]?.date ?? c.date : c.date}` : ''}</p>
                {c.credentialUrl && (
                  <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="enlace">
                    {en ? 'View credential' : 'Ver credencial'} <DotIcon name="salida" size={11} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
