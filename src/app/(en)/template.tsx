// Se vuelve a montar en cada navegación: la página nueva entra con un desplazamiento corto en vez de saltar.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="entrada-pagina">{children}</div>
}
