import { PROFILE } from '@/data/profile'
import { UI, type Lang } from '@/lib/lang'

// Portada: quién es y qué encuentra quien llega desde un video, sin animaciones de relleno.
export default function Hero({ lang = 'es' }: { lang?: Lang }) {
  const t = UI[lang].hero
  return (
    <section id="inicio" className="marco portada">
      <div className="portada-identidad">
        <img src="/franco-oficina.webp" width={480} height={480} alt={lang === 'en' ? 'Franco, the character of his videos' : 'Franco, el personaje de sus videos'} className="portada-foto" fetchPriority="high" />
        <div>
          <p className="portada-nombre">{PROFILE.name}</p>
          <p className="portada-usuario">@arncof</p>
        </div>
      </div>
      <h1 className="display">{t.title}</h1>
      <p className="entrada-texto">{t.text}</p>
      <ul className="portada-redes" aria-label={lang === 'en' ? 'Profiles' : 'Perfiles'}>
        {PROFILE.socials.filter(s => s.name !== 'GitHub').map(s => (
          <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer" data-event="social_profile_click" data-channel={s.name}>{s.name}</a></li>
        ))}
      </ul>
    </section>
  )
}
