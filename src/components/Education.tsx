import { EDUCATION, CERTIFICATIONS } from '@/data/education'
import DotIcon from '@/components/dots/DotIcon'

export default function Education() {
  return (
    <section id="formacion" className="marco seccion">
      <div className="seccion-cabeza"><h2>Formación</h2></div>
      <div className="formacion-columnas">
        <div className="formacion-bloque">
          <h3>Estudios</h3>
          <div className="formacion-rejilla">
            {EDUCATION.map(e => (
              <div key={e.institution} className="lamina formacion-item">
                <h4>{e.degree}</h4>
                <p>{e.institution}</p>
                <p>{e.period.replace(/\s*-\s*act$/i, '–actualidad').replace(/\s*-\s*/, '–')}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="formacion-bloque">
          <h3>Certificaciones</h3>
          <div className="formacion-rejilla">
            {CERTIFICATIONS.map(c => (
              <div key={c.name} className="lamina formacion-item">
                <h4>{c.name}</h4>
                <p>{c.institution}{c.date ? ` · ${c.date}` : ''}</p>
                {c.credentialUrl && (
                  <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="enlace">
                    Ver credencial <DotIcon name="salida" size={11} />
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
