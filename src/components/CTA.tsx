import ContactActions from './ContactActions'
import DotField, { cascade } from './dots/DotField'
import { UI, type Lang } from '@/lib/lang'

export default function CTA({ lang = 'es' }: { lang?: Lang }) {
  const t = UI[lang].cta
  return (
    <section className="marco seccion acento-verde">
      <div className="llamado">
        <div>
          <h2 className="titulo">{t.title}</h2>
          <p className="entrada-texto">{t.text}</p>
          <ContactActions lang={lang} />
        </div>
        <div className="llamado-campo">
          <DotField cols={14} rows={10} cells={cascade(14, 10, 'arncof-construir', 'abajo-derecha', 1.15)} align="xMaxYMax slice" />
        </div>
      </div>
    </section>
  )
}
