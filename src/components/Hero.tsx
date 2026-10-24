import Link from 'next/link'
import ContactActions from './ContactActions'
import ProcessWindow from './dots/ProcessWindow'
import DotIcon from './dots/DotIcon'
import { UI, type Lang } from '@/lib/lang'

export default function Hero({ lang = 'es' }: { lang?: Lang }) {
  const t = UI[lang].hero
  return (
    <section id="inicio" className="marco portada-hero">
      <div className="portada-hero-texto">
        <h1 className="display">{t.title}</h1>
        <p className="entrada-texto">{t.text}</p>
        <ContactActions lang={lang} />
      </div>
      <div className="portada-hero-ventana">
        <ProcessWindow caption={t.caption} lang={lang} />
        <Link href="/skills/ai-agents" className="enlace hero-enlace" hrefLang={lang === 'en' ? 'es' : undefined}>
          {t.agents}
          <DotIcon name="flecha" size={13} />
        </Link>
      </div>
    </section>
  )
}
