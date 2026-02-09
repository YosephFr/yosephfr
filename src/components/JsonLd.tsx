export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yoseph Franco",
    jobTitle: "Full Stack Developer",
    url: "https://yosephfr.com",
    email: "contacto@yosephfr.com",
    image: "https://yosephfr.com/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad Autonoma de Buenos Aires",
      addressCountry: "AR",
    },
    sameAs: [],
    knowsAbout: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "Express",
      "OpenAI API",
      "Artificial Intelligence",
      "WordPress",
      "AWS",
      "Docker",
      "Full Stack Development",
      "Web Development",
      "Cloud Infrastructure",
      "Digital Marketing",
      "SEO",
    ],
    description:
      "Full Stack Developer con +6 años de experiencia. Especializado en React, Next.js, Node.js, TypeScript e inteligencia artificial. Capaz de crear productos digitales completos de forma autonoma -- desde la arquitectura del backend hasta el diseno de interfaces, pasando por infraestructura cloud y estrategia de marketing digital. Un profesional multidisciplinario que reemplaza equipos de +10 personas.",
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Yoseph Franco | Full Stack Developer",
    url: "https://yosephfr.com",
    description:
      "Portfolio interactivo de Yoseph Franco. Full Stack Developer especializado en React, Next.js, Node.js, TypeScript e IA.",
    author: {
      "@type": "Person",
      name: "Yoseph Franco",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
