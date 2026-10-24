export interface EducationItem {
  institution: string
  degree: string
  period: string
  badge: string
}

export interface CertificationItem {
  name: string
  institution: string
  credentialId?: string
  credentialUrl?: string
  date?: string
}

export const EDUCATION: EducationItem[] = [
  {
    institution: "Platzi",
    degree: "Desarrollo web, contenido digital y recursos informáticos",
    period: "2021 - act",
    badge: "En curso",
  },
  {
    institution: "Instituto Universitario de Tecnología Agroindustrial Región Los Andes",
    degree: "Ingeniería electrónica, robótica y mecatrónica",
    period: "2017 - 2021",
    badge: "Completado",
  },
]

export const CERTIFICATIONS: CertificationItem[] = [
  {
    name: "Inglés Intermedio B1",
    institution: "Platzi",
    credentialId: "6507d1bc-ef46-41bb-a9fa-1bfb6151ce27",
    credentialUrl: "https://platzi.com/p/yosephfr/learning-path/8310-intermediate-core/diploma/detalle/",
  },
  {
    name: "HTML y CSS",
    institution: "Platzi",
    credentialId: "71c9f908-c029-4eed-9d4d-62241c7a779e",
    credentialUrl: "https://platzi.com/p/yosephfr/learning-path/7040-web-frontend/diploma/detalle/",
  },
  {
    name: "Full Stack con WordPress",
    institution: "Platzi",
    credentialId: "d9701577-7f1c-4fe2-9c68-106c5240a9d6",
    credentialUrl: "https://platzi.com/p/yosephfr/learning-path/9580-web-wordpress/diploma/detalle/",
    date: "ago. 2022",
  },
]
