// Material de cada video o post: lo que Franco dice «está en mi perfil».
// Una entrada por pieza publicada. Solo material real: pedidos, archivos, fuentes y capturas que existen.
// Cada entrada se agrega el mismo día en que sale la pieza; nada de entradas vacías ni «próximamente».

export type MaterialLink = { label: string; href: string; note?: string }
export type MaterialBlock =
  | { type: 'texto'; text: string }
  | { type: 'pedido'; label: string; text: string }
  | { type: 'enlaces'; title: string; links: MaterialLink[] }
  | { type: 'vista'; title: string; src: string; href: string; width: number; height: number; alt: string }

export type Material = {
  slug: string
  kind: 'video' | 'carrusel'
  title: string
  // Lo que la persona se lleva, en una frase.
  summary: string
  date: string
  // Dónde salió la pieza, como lo diría Franco.
  where: string
  cover: { src: string; width: number; height: number; alt: string }
  // La portada que se vio en la red, para reconocer la pieza de un vistazo (vertical, 540 de ancho).
  poster: { src: string; width: number; height: number; focus?: string }
  // Dónde verla. Solo enlaces que ya existen.
  watch?: MaterialLink[]
  blocks: MaterialBlock[]
}

export const MATERIAL: Material[] = [
  {
    slug: 'la-misma-pagina-dos-veces',
    kind: 'carrusel',
    title: 'La misma página, dos veces',
    summary: 'Los dos pedidos exactos y las dos páginas que salieron, para que lo pruebes con tu propio proyecto.',
    date: '2026-11-11T11:06:00-03:00',
    where: 'Carrusel de LinkedIn',
    cover: { src: '/material/la-misma-pagina-dos-veces/con-capturas.webp', width: 1440, height: 900, alt: 'La página que salió cuando le mostré dos capturas de referencia' },
    poster: { src: '/material/la-misma-pagina-dos-veces/portada.webp', width: 540, height: 675 },
    blocks: [
      { type: 'texto', text: 'Le pedí a Claude Fable 5.2 la página de una pastelería inventada, Dulce Luna. Mismo modelo y mismo pedido, en dos chats nuevos. La única diferencia: en el segundo le pasé dos capturas de páginas que me gustan y le dije qué copiar de cada una.' },
      { type: 'pedido', label: 'Pedido 1, solo con palabras', text: 'Hazme una página web linda para mi pastelería, Dulce Luna. Un solo archivo HTML, sin imágenes externas.' },
      { type: 'vista', title: 'Lo que salió', src: '/material/la-misma-pagina-dos-veces/con-palabras.webp', href: '/material/la-misma-pagina-dos-veces/con-palabras.html', width: 1440, height: 900, alt: 'Página morada con una luna y estrellas, elegidas por el modelo' },
      { type: 'pedido', label: 'Pedido 2, con dos capturas', text: 'Hazme una página web linda para mi pastelería, Dulce Luna. Un solo archivo HTML, sin imágenes externas. Te paso dos capturas de páginas que me gustan. De la primera copia los colores (crema y azul) y el tipo de letra. De la segunda copia los títulos grandes en negrita y la cinta negra con texto que se mueve.' },
      { type: 'vista', title: 'Lo que salió', src: '/material/la-misma-pagina-dos-veces/con-capturas.webp', href: '/material/la-misma-pagina-dos-veces/con-capturas.html', width: 1440, height: 900, alt: 'Página crema y azul con títulos grandes y una cinta negra que se mueve' },
      { type: 'enlaces', title: 'Las dos páginas que le mostré', links: [
        { label: 'Levain Bakery', href: 'https://levainbakery.com', note: 'colores y tipo de letra' },
        { label: 'Milk Bar', href: 'https://milkbarstore.com', note: 'títulos grandes y la cinta que se mueve' },
      ] },
      { type: 'texto', text: 'Antes de pedir un diseño junto capturas de lo que me gusta y le digo qué copiar de cada una. Si no sabes explicarlo, muéstraselo.' },
    ],
  },
  {
    slug: 'claude-fable-5-2',
    kind: 'video',
    title: 'Claude Fable 5.2: los números',
    summary: 'De dónde salen el puntaje, el costo por tarea y por qué el esfuerzo máximo rinde menos.',
    date: '2026-11-09T20:11:00-03:00',
    where: 'Noticiero y carrusel de LinkedIn',
    cover: { src: '/material/claude-fable-5-2/frontiercode.webp', width: 1600, height: 914, alt: 'Gráfico de FrontierCode 2.0 del system card: Fable 5.2 sube hasta xhigh y baja en max' },
    poster: { src: '/material/claude-fable-5-2/portada.webp', width: 540, height: 960 },
    watch: [
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/24s-qXaGf48' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@arncof/video/7706313449864842509' },
      { label: 'Instagram', href: 'https://www.instagram.com/reel/Dfie1BWlK3k/' },
    ],
    blocks: [
      { type: 'texto', text: 'Es el número uno del índice de Artificial Analysis con 65 puntos y también el más caro de la tabla: 26,54 dólares por tarea, el 9 de noviembre.' },
      { type: 'texto', text: 'En la prueba de código que publica la propia Anthropic, FrontierCode 2.0, saca 49,1 % en esfuerzo xhigh a 14,19 dólares por tarea y 45,7 % en max a 44,70. Más esfuerzo, peor nota y el triple de costo.' },
      { type: 'texto', text: 'Yo uso siempre el mejor modelo. Lo que cambio es cuánto piensa: mi orquestador va en máximo y los demás en alto o medio.' },
      { type: 'enlaces', title: 'Fuentes', links: [
        { label: 'Artificial Analysis, tabla de modelos', href: 'https://artificialanalysis.ai/leaderboards/models', note: 'índice y costo por tarea' },
        { label: 'System card de Claude Fable 5.2 y Mythos 5.2', href: 'https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf', note: 'páginas 209 y 210, FrontierCode 2.0' },
        { label: 'Anuncio de Anthropic', href: 'https://www.anthropic.com/claude-fable-and-mythos-5-2', note: 'cuándo usar cada modelo' },
      ] },
    ],
  },
  {
    slug: 'primer-dia-fable',
    kind: 'video',
    title: 'El primer día de la IA más avanzada',
    summary: 'Salió Claude Fable 5.2 y lo primero que hicimos todos fue pedirle lo de siempre. Los números de verdad, aquí.',
    date: '2026-11-11T10:05:00-03:00',
    where: 'Video',
    cover: { src: '/material/primer-dia-fable/portada.webp', width: 540, height: 960, alt: 'Franco con Fable 5.2, empleado del mes, en su primer día' },
    poster: { src: '/material/primer-dia-fable/portada.webp', width: 540, height: 960 },
    blocks: [
      { type: 'texto', text: 'La IA más avanzada del mundo y yo preguntándole qué día es hoy.' },
      { type: 'texto', text: 'Si quieres saber qué cambió de verdad con Fable 5.2, cuánto cuesta cada tarea y por qué el esfuerzo máximo rinde menos, está en la pieza de los números.' },
      { type: 'enlaces', title: 'Sigue con', links: [
        { label: 'Claude Fable 5.2: los números', href: '/material/claude-fable-5-2', note: 'puntaje, costo por tarea y fuentes' },
      ] },
    ],
  },
  {
    slug: 'hablale',
    kind: 'video',
    title: 'Deja de escribirle a la IA',
    summary: 'La nota de voz de 37 segundos que usé y las dos páginas que salieron, para que lo pruebes con lo tuyo.',
    date: '2026-11-10T18:10:00-03:00',
    where: 'Taller de IA',
    cover: { src: '/material/hablale/b_nota_de_voz.webp', width: 900, height: 1200, alt: 'La página de La Espiga Dorada que salió de la nota de voz' },
    poster: { src: '/material/hablale/portada.webp', width: 540, height: 960 },
    blocks: [
      { type: 'texto', text: 'Le pedí una página dos veces a la misma IA, Claude. Primero con tres palabras escritas. Después con una nota de voz de 37 segundos contándole todo, como se lo contaría a una persona.' },
      { type: 'pedido', label: 'Pedido 1, escrito', text: 'hazme una página' },
      { type: 'vista', title: 'Lo que salió', src: '/material/hablale/a_tres_palabras.webp', href: '/material/hablale/a_tres_palabras.html', width: 900, height: 1200, alt: 'Una página de una empresa inventada que no existe' },
      { type: 'pedido', label: 'Pedido 2, la nota de voz', text: 'Hola. Mira, necesito una página para la panadería de mi mamá. Se llama La Espiga Dorada. Está en el barrio desde hace treinta años y todo el mundo la conoce por el pan de masa madre y por las galletas de chocolate, que se acaban antes de las diez. Abrimos de martes a domingo, de seis de la mañana a dos de la tarde. Quiero que se sienta cálida, como entrar y oler pan recién hecho. Colores crema, marrón y un poco de dorado, nada moderno ni frío. Arriba el nombre bien grande, después los tres panes que más se venden con su precio y abajo un botón para hacer pedidos por WhatsApp. Ah, y que se vea bien en el celular, porque casi todos entran desde ahí.' },
      { type: 'vista', title: 'Lo que salió', src: '/material/hablale/b_nota_de_voz.webp', href: '/material/hablale/b_nota_de_voz.html', width: 900, height: 1200, alt: 'La página cálida de La Espiga Dorada, con el nombre grande, tres panes y el botón de WhatsApp' },
      { type: 'texto', text: 'La IA no adivina. No hace falta un prompt perfecto: hace falta contarle lo que le contarías a alguien que no sabe nada de ti. Si no quieres mandar audio, escríbelo, pero cuéntale todo.' },
    ],
  },
  {
    slug: 'tranquilo-franco',
    kind: 'video',
    title: 'Tranquilo, Franco, es solo una IA',
    summary: 'Le pedí una respuesta y me dio la razón. Por qué pasa y qué hago yo.',
    date: '2026-11-10T10:05:00-03:00',
    where: 'Video',
    cover: { src: '/material/tranquilo-franco/portada.webp', width: 540, height: 960, alt: 'Franco en el concurso, frente a ChatGPT que le dice «¡Excelente pregunta!»' },
    poster: { src: '/material/tranquilo-franco/portada.webp', width: 540, height: 960 },
    blocks: [
      { type: 'texto', text: 'Un modelo de lenguaje no tiene emociones. Preguntarle algo es como preguntarle a Google: te devuelve lo más recomendado. Y está hecho para ser servil, así que por defecto no es imparcial.' },
      { type: 'texto', text: 'Para programar, trabajar y editar video es excelente. Úsalo con inteligencia, con astucia: si te da la razón en todo, no le estás preguntando bien.' },
    ],
  },
  {
    slug: 'se-acabo-tu-limite',
    kind: 'video',
    title: '¿Se acabó tu límite semanal de Claude?',
    summary: 'Cuando le pides todo a la IA, el límite se acaba. Lo que cambio yo para que me alcance.',
    date: '2026-11-09T18:57:00-03:00',
    where: 'Video',
    cover: { src: '/material/se-acabo-tu-limite/portada.webp', width: 540, height: 960, alt: 'Franco frente a tres pantallas apagadas' },
    poster: { src: '/material/se-acabo-tu-limite/portada.webp', width: 540, height: 960 },
    watch: [{ label: 'YouTube', href: 'https://www.youtube.com/shorts/iz8TYKS5DJY' }],
    blocks: [
      { type: 'texto', text: 'Yo uso siempre el mejor modelo. Lo que cambio es cuánto piensa: mi orquestador va en máximo y los demás en alto o medio.' },
      { type: 'enlaces', title: 'Sigue con', links: [
        { label: 'Claude Fable 5.2: los números', href: '/material/claude-fable-5-2', note: 'por qué el esfuerzo máximo rinde menos' },
      ] },
    ],
  },
]

// Solo lo que ya salió: una pieza programada aparece en el primer build después de su fecha.
// MATERIAL_HASTA (fecha ISO) solo para capturas de revisión de piezas ya programadas; nunca en el build que se despliega.
export function materialByDate(now = process.env.MATERIAL_HASTA ? Date.parse(process.env.MATERIAL_HASTA) : Date.now()) {
  return MATERIAL.filter(m => Date.parse(m.date) <= now).sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export function getMaterial(slug: string) {
  return materialByDate().find(m => m.slug === slug)
}
