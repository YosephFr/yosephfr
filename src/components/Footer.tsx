import InternalLink from '@/components/InternalLink'
import { PROFILE } from '@/data/profile'
import DotIcon from '@/components/dots/DotIcon'
import { UI, type Lang } from '@/lib/lang'

export default function Footer({ lang = 'es' }: { lang?: Lang }) {
  const t = UI[lang]
  const sections = [
    { href: t.home, label: t.nav.home },
    { href: t.blog, label: t.nav.articles },
    { href: t.newsletter, label: t.nav.newsletter },
    { href: t.cv, label: t.nav.cv },
    { href: t.contactPath, label: t.nav.contact },
  ]
  return (
    <footer className="marco pie" lang={lang === 'en' ? 'en' : undefined}>
      <div className="pie-rejilla">
        <div className="pie-marca">
          <InternalLink href={t.home} className="marca"><DotIcon name="marca" size={20} />Arncof</InternalLink>
          <p>{t.footer.tagline}</p>
          <a href={`mailto:${PROFILE.email}`} data-event="contact_email_click" className="boton boton-tonal">
            <DotIcon name="correo" size={16} />
            {PROFILE.email}
          </a>
        </div>
        <nav aria-label="Secciones">
          <h2>{t.footer.sections}</h2>
          <ul>
            {sections.map(s => <li key={s.href}><InternalLink href={s.href}>{s.label}</InternalLink></li>)}
            <li><InternalLink href={t.footer.otherHref} hrefLang={lang === 'en' ? 'es' : 'en'} lang={lang === 'en' ? 'es' : 'en'}>{t.footer.other}</InternalLink></li>
          </ul>
        </nav>
        <nav aria-label="Perfiles">
          <h2>{t.footer.profiles}</h2>
          <ul>
            {PROFILE.socials.map(s => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" data-event="social_profile_click" data-channel={s.name}>
                  {s.name}<DotIcon name="salida" size={11} />
                </a>
              </li>
            ))}
            <li><a href={lang === 'en' ? '/en/feed.xml' : '/feed.xml'}>RSS<DotIcon name="rss" size={11} /></a></li>
          </ul>
        </nav>
      </div>
      <div className="pie-firma">
        <span>{PROFILE.name} · Buenos Aires</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
