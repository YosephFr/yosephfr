import Link from 'next/link'
import DotIcon from '@/components/dots/DotIcon'
import { PROFILE } from '@/data/profile'
import { UI, type Lang } from '@/lib/lang'
import NewsletterCTA from '@/components/NewsletterCTA'
import ParticlePortrait from '@/components/ParticlePortrait'

const RETRATO = { src: '/franco-retrato.webp', width: 600, height: 800 }

// Portada: su personaje armado con partículas, lo que hace en una frase y el newsletter a mano.
export default function Hero({ lang = 'es' }: { lang?: Lang }) {
  const t = UI[lang].hero
  return (
    <section id="inicio" className="marco portada">
      <ParticlePortrait {...RETRATO} alt={lang === 'en' ? 'Franco, the character of his videos' : 'Franco, el personaje de sus videos'} className="portada-retrato" />
      <div className="portada-texto">
        <p className="portada-quien"><strong>{PROFILE.name}</strong> <span>@arncof</span></p>
        <h1 className="display">{t.title}</h1>
        <p className="entrada-texto">{t.text}</p>
        {lang === 'es' && (
          <NewsletterCTA variant="compacto" className="solo-ancho" offer={{ title: 'Newsletter', text: '', button: 'Suscribirme' }}>
            <Link href="/newsletter/1" className="boletin-leer">Lee el número 1 <DotIcon name="flecha" size={12} /></Link>
          </NewsletterCTA>
        )}
        <ul className="portada-redes" aria-label={lang === 'en' ? 'Profiles' : 'Perfiles'}>
          {PROFILE.socials.filter(s => s.name !== 'GitHub').map(s => (
            <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer" data-event="social_profile_click" data-channel={s.name}>{s.name}</a></li>
          ))}
        </ul>
      </div>
    </section>
  )
}
