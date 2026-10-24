import Link from 'next/link'
import ContactActions from './ContactActions'
import ProcessWindow from './dots/ProcessWindow'
import DotIcon from './dots/DotIcon'

export default function Hero() {
  return (
    <section id="inicio" className="marco portada-hero">
      <div className="portada-hero-texto">
        <h1 className="display">IA que llega al trabajo real.</h1>
        <p className="entrada-texto">Construyo agentes, software y automatizaciones. Comparto lo que sirve para pasar de una idea a un producto que funciona.</p>
        <ContactActions />
      </div>
      <div className="portada-hero-ventana">
        <ProcessWindow caption="De una consulta a una tarea resuelta." />
        <Link href="/skills/ai-agents" className="enlace hero-enlace">
          Así trabajo con agentes
          <DotIcon name="flecha" size={13} />
        </Link>
      </div>
    </section>
  )
}
