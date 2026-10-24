import ContactActions from './ContactActions'
import DotField, { cascade } from './dots/DotField'

export default function CTA() {
  return (
    <section className="marco seccion acento-verde">
      <div className="llamado">
        <div>
          <h2 className="titulo">¿Qué quieres construir?</h2>
          <p className="entrada-texto">Hablemos de tu producto, tu proceso o la tarea que necesitas resolver.</p>
          <ContactActions />
        </div>
        <div className="llamado-campo">
          <DotField cols={14} rows={10} cells={cascade(14, 10, 'arncof-construir', 'abajo-derecha', 1.15)} align="xMaxYMax slice" />
        </div>
      </div>
    </section>
  )
}
