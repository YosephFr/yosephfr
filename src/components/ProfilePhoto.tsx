import { preload } from 'react-dom'
import { PROFILE } from '@/data/profile'

// Retrato real. En portada y CV va con prioridad alta: es candidato a LCP.
// <img> nativo para fijar width, height y fetchpriority; el export estático no los dejaba en next/image.
export default function ProfilePhoto({ size = 72, priority = false, egg }: { size?: number; priority?: boolean; egg?: string }) {
  if (priority) preload(PROFILE.photo, { as: 'image', fetchPriority: 'high' })
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={PROFILE.photo}
      alt={PROFILE.name}
      width={size}
      height={size}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      loading={priority ? 'eager' : 'lazy'}
      data-egg-click={egg}
      className="foto-perfil"
      style={{ width: size, height: size }}
    />
  )
}
