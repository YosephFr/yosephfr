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
  date?: string
}

export const EDUCATION: EducationItem[] = [
  {
    institution: "Platzi",
    degree: "Web Page, Digital/Multimedia and Information Resources Design",
    period: "2021 - act",
    badge: "En curso",
  },
  {
    institution: "Instituto Universitario de Tecnología Agroindustrial Región Los Andes",
    degree: "Ingeniería, Mechatronics, Robotics, and Automation Engineering",
    period: "2017 - 2021",
    badge: "Completado",
  },
]

export const CERTIFICATIONS: CertificationItem[] = [
  {
    name: "Inglés Intermedio B1",
    institution: "Platzi",
    credentialId: "6507d1bc-ef46-41bb-a9fa-1bfb6151ce27",
  },
  {
    name: "HTML y CSS",
    institution: "Platzi",
    credentialId: "71c9f908-c029-4eed-9d4d-62241c7a779e",
  },
  {
    name: "Full Stack con WordPress",
    institution: "Platzi",
    credentialId: "d9701577-7f1c-4fe2-9c68-106c5240a9d6",
    date: "ago. 2022",
  },
]
