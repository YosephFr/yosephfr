import { yaSalio } from '@/lib/desde'

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
  {
    numero: 2,
    title: 'Antes de culpar a la IA',
    summary: 'Las tres cosas que reviso cuando algo sale mal, la perilla que muevo en vez de cambiar de modelo y lo que pago de verdad.',
    date: '2026-11-22T10:00:00-03:00',
    intro: [
      'Cuando una IA hace algo mal, lo primero que hace casi todo el mundo es culparla o cambiarse a otra. Yo hago lo contrario: reviso lo que le di.',
      'Esta semana te dejo cómo lo reviso, qué ajusto cuando quiero que vaya más rápido y cuánto me cuesta trabajar así.',
    ],
    sections: [
      {
        title: 'Si te falló, revisa esto primero',
        paragraphs: [
          'En mi experiencia, el 99 % de las veces no es culpa de la IA. Reviso tres cosas: lo que le dije, las reglas que lee y lo que le mezclé en la conversación.',
          'Una instrucción que se contradice, un archivo de reglas de hace meses o un chat lleno de cosas que no tienen nada que ver alcanzan para que el mejor modelo se equivoque.',
        ],
        link: { label: 'Las tres cosas y dos pedidos para copiar', href: '/blog/te-fallo-la-ia-fuiste-tu' },
      },
      {
        title: 'Bájale la perilla, no el modelo',
        paragraphs: [
          'Le di a la mejor IA y a una más chica la misma compra, con cupones y envíos: encontrar el total más bajo entre 960 millones de combinaciones. La mejor, pensando en medio, acertó las dos veces en un minuto. En máximo dio la misma respuesta tardando entre cinco y diez veces más.',
          'Por eso no me paso a un modelo barato para ir rápido. Uso el mejor y cambio cuánto piensa.',
        ],
        link: { label: 'La prueba completa, para que la hagas tú', href: '/blog/esfuerzo-de-razonamiento-ia-la-perilla' },
      },
      {
        title: 'Cómo mido lo que uso',
        paragraphs: [
          'Pago dos suscripciones de 200 dólares, Claude y Codex. Con CodexBar, una app gratis para la Mac, veo cuánto costaría mi uso a precio de API: entre 18 y 30 mil dólares al mes.',
        ],
        link: { label: 'Pago 400 y uso hasta 30 mil', href: '/blog/pago-400-dolares-ia-uso-30-mil' },
      },
      {
        title: 'El número de la semana',
        paragraphs: [
          '9 horas y 24 minutos: lo que llevó, del guion al video final, un video mío de 32 segundos. Siete frases, treinta tomas de voz y tres escenarios. ¿Está hecho con IA? Obvio que sí, pero hay un gran trabajo detrás.',
        ],
      },
    ],
    close: [
      'Esta semana, la próxima vez que la IA te falle, no la cambies: abre lo que le escribiste y busca dos órdenes que se peleen. Y si conoces a alguien que le echa la culpa de todo a la IA, reenvíale este correo.',
      'Franco',
    ],
  },
  {
    numero: 3,
    title: 'Ve a la fuente',
    summary: 'De dónde sale la cifra de los 800 millones de empleos, la frase que le escribo a la IA antes de algo grande y lo que más rompe a un agente.',
    date: '2026-11-29T10:00:00-03:00',
    intro: [
      '«La IA va a destruir 800 millones de empleos.» Esa frase la viste mil veces. Esta semana fui a leer de dónde sale, y no dice eso.',
    ],
    sections: [
      {
        title: 'Los 800 millones',
        paragraphs: [
          'Salen de un informe de McKinsey de 2017, cinco años antes de ChatGPT. Son el techo de su escenario más rápido y cuentan personas que tendrían que cambiar de trabajo, no personas sin trabajo. El mismo informe dice que en la mayoría de los escenarios puede haber trabajo para todos.',
          'Usar IA no te deja sin trabajo. Multiplica lo que puedes hacer. Lo que te deja atrás es no usarla.',
        ],
        link: { label: 'Lo que dice el informe y lo que veo yo', href: '/blog/ia-800-millones-de-empleos' },
      },
      {
        title: 'Una frase antes de algo grande',
        paragraphs: [
          '«Hazme una entrevista con opciones para saber qué quiero hacer y qué no quiero hacer.» Ella pregunta, te marca la opción que recomienda y tú eliges A, B o C. Así decides tú y no inventa lo que no le dijiste.',
        ],
        link: { label: 'La frase y cómo se ve la entrevista', href: '/blog/entrevista-con-opciones-antes-de-pedirle-algo-a-la-ia' },
      },
      {
        title: 'Dos órdenes que se pelean',
        paragraphs: [
          'Lo que más rompe a un agente son las contradicciones dentro de sus propias instrucciones: «responde corto» arriba y «explica cada paso con detalle» abajo. Desde afuera parece que no te hace caso. Le está haciendo caso a las dos.',
        ],
        link: { label: 'Cómo las encuentro y las arreglo', href: '/blog/lo-que-mas-rompe-a-un-agente-de-ia' },
      },
      {
        title: 'El número de la semana',
        paragraphs: [
          'Menos del 5 %: las ocupaciones que, según ese mismo informe, se pueden automatizar por completo. En la mayoría cambia una parte del trabajo, no el trabajo entero.',
        ],
      },
    ],
    close: [
      'Esta semana, antes de tu próximo pedido grande, pégale la frase de la entrevista y elige. Y si tienes a alguien cerca que repite lo de los 800 millones, reenvíale este correo.',
      'Franco',
    ],
  },
]

// Solo lo que ya salió por correo tiene página y enlace; lo programado entra con el despliegue de su hora (publicar-a-su-hora).
export function numerosPublicados() {
  return NUMEROS.filter(n => yaSalio(n.date))
}

export function ultimoNumero() {
  return numerosPublicados().at(-1)
}

export function getNumero(n: number) {
  return NUMEROS.find(x => x.numero === n)
}
