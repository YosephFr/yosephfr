// Archivo del newsletter: cada número que sale por correo queda aquí para quien llega después.
// El texto es el mismo que se envía; los enlaces llevan al material de cada pieza.

export type Seccion = { title: string; paragraphs: string[]; link?: { label: string; href: string } }

export type Numero = {
  numero: number
  title: string
  // Lo que la persona se lleva, en una frase (descripción y vista previa del correo).
  summary: string
  // Día en que sale por correo.
  date: string
  intro: string[]
  sections: Seccion[]
  close: string[]
}

export const NUMEROS: Numero[] = [
  {
    numero: 1,
    title: 'La IA no adivina',
    summary: 'La misma IA, el mismo pedido y dos resultados opuestos. Lo único que cambió fue lo que le conté.',
    date: '2026-11-15T10:00:00-03:00',
    intro: [
      'Esta semana le pedí la misma página a la misma IA, dos veces. La primera me inventó una empresa que no existe. La segunda hizo justo lo que yo quería.',
      'El modelo era el mismo. Lo que cambió fue lo que le conté.',
    ],
    sections: [
      {
        title: 'Cuéntale todo',
        paragraphs: [
          '«Hazme una página.» Tres palabras, y la IA rellenó el resto como pudo: salió Nova, una plataforma inventada con su botón de «Pruébalo gratis».',
          'Después le mandé una nota de voz de 37 segundos sobre una panadería de ejemplo: el nombre, el horario, los colores, qué panes van arriba y dónde va el botón de WhatsApp. Salió esa página.',
          'No hace falta un prompt perfecto. Hace falta contarle lo que le contarías a alguien que no sabe nada de ti. Si no quieres mandar audio, escríbelo, pero cuéntale todo.',
        ],
        link: { label: 'La nota de voz y las dos páginas', href: '/material/hablale' },
      },
      {
        title: 'Si no sabes explicarlo, muéstraselo',
        paragraphs: [
          'Con el diseño pasa lo mismo. Le pedí a Claude Fable 5.2 la página de una pastelería inventada, en dos chats nuevos. En el segundo le pasé capturas de dos páginas de Dribbble que me encantan y le dije qué copiar de cada una.',
          'Mismo modelo, mismo pedido, otra página. Antes de pedir un diseño junto capturas de lo que me gusta.',
        ],
        link: { label: 'Los dos pedidos y lo que salió', href: '/material/la-misma-pagina-dos-veces' },
      },
      {
        title: 'Más esfuerzo no siempre rinde más',
        paragraphs: [
          'Salió Claude Fable 5.2 y ya es lo que uso. En la prueba de código que publica la propia Anthropic, FrontierCode 2.0, saca 49,1 % en esfuerzo xhigh a 14,19 dólares por tarea. En max baja a 45,7 % y cuesta 44,70. Peor nota y el triple de costo.',
          'Yo uso siempre el mejor modelo. Lo que cambio es cuánto piensa: mi orquestador va en máximo y los demás en alto o medio.',
        ],
        link: { label: 'Los números, con sus fuentes', href: '/material/claude-fable-5-2' },
      },
      {
        title: 'Cuando te da la razón en todo',
        paragraphs: [
          'Un modelo de lenguaje no tiene emociones. Preguntarle algo es como preguntarle a Google: te devuelve lo más recomendado. Y está hecho para ser servil, así que por defecto no es imparcial.',
          'Para programar, trabajar y editar video es excelente. Úsalo con astucia: si te da la razón en todo, no le estás preguntando bien.',
        ],
        link: { label: 'Tranquilo, Franco, es solo una IA', href: '/material/tranquilo-franco' },
      },
      {
        title: 'El número de la semana',
        paragraphs: [
          'Cada mes uso entre 18 y 30 mil dólares de IA, medidos a precio de API. Pago 400: Claude y Codex, 200 cada uno.',
        ],
      },
    ],
    close: [
      'Esta semana, antes de escribirle a tu IA, mándale un audio de un minuto contándole todo lo que necesitas. Y si conoces a alguien que sigue peleándose con el teclado, reenvíale este correo.',
      'Franco',
    ],
  },
]

export function getNumero(n: number) {
  return NUMEROS.find(x => x.numero === n)
}
