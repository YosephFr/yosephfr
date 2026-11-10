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
  title: string
  // Lo que la persona se lleva, en una frase.
  summary: string
  date: string
  // Dónde salió la pieza, como lo diría Franco.
  where: string
  cover: { src: string; width: number; height: number; alt: string }
  blocks: MaterialBlock[]
}

export const MATERIAL: Material[] = [
  {
    slug: 'la-misma-pagina-dos-veces',
    title: 'La misma página, dos veces',
    summary: 'Los dos pedidos exactos y las dos páginas que salieron, para que lo pruebes con tu propio proyecto.',
    date: '2026-11-11T11:06:00-03:00',
    where: 'Carrusel de LinkedIn',
    cover: { src: '/material/la-misma-pagina-dos-veces/con-capturas.webp', width: 1440, height: 900, alt: 'La página que salió cuando le mostré dos capturas de referencia' },
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
    title: 'Claude Fable 5.2: los números',
    summary: 'De dónde salen el puntaje, el costo por tarea y por qué el esfuerzo máximo rinde menos.',
    date: '2026-11-09T20:11:00-03:00',
    where: 'Noticiero y carrusel de LinkedIn',
    cover: { src: '/material/claude-fable-5-2/frontiercode.webp', width: 1600, height: 914, alt: 'Gráfico de FrontierCode 2.0 del system card: Fable 5.2 sube hasta xhigh y baja en max' },
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
]

// Solo lo que ya salió: una pieza programada aparece en el primer build después de su fecha.
// MATERIAL_HASTA (fecha ISO) solo para capturas de revisión de piezas ya programadas; nunca en el build que se despliega.
export function materialByDate(now = process.env.MATERIAL_HASTA ? Date.parse(process.env.MATERIAL_HASTA) : Date.now()) {
  return MATERIAL.filter(m => Date.parse(m.date) <= now).sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export function getMaterial(slug: string) {
  return materialByDate().find(m => m.slug === slug)
}
