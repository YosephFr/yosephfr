import Link from 'next/link'
import { PROFILE } from '@/data/profile'
import DotIcon from '@/components/dots/DotIcon'

const SECTIONS = [
  { href: '/', label: 'Inicio' },
  { href: '/blog', label: 'Artículos' },
  { href: '/cv', label: 'CV' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Footer() {
  return (
    <footer className="marco pie">
      <div className="pie-rejilla">
        <div className="pie-marca">
          <Link href="/" className="marca"><DotIcon name="marca" size={20} />Arncof</Link>
          <p>Agentes de IA, software y automatización para el trabajo real.</p>
          <a href={`mailto:${PROFILE.email}`} data-event="contact_email_click" className="boton boton-tonal">
            <DotIcon name="correo" size={16} />
            {PROFILE.email}
          </a>
        </div>
        <nav aria-label="Secciones">
          <h2>Secciones</h2>
          <ul>
            {SECTIONS.map(s => <li key={s.href}><Link href={s.href}>{s.label}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Perfiles">
          <h2>Perfiles</h2>
          <ul>
            {PROFILE.socials.map(s => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" data-event="social_profile_click" data-channel={s.name}>
                  {s.name}<DotIcon name="salida" size={11} />
                </a>
              </li>
            ))}
            <li><a href="/feed.xml">RSS<DotIcon name="rss" size={11} /></a></li>
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
