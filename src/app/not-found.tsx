export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-accent">404</p>
        <h1 className="text-xl font-semibold text-text-primary mt-4">Página no encontrada</h1>
        <p className="text-sm text-text-muted mt-2">La página que buscas no existe o fue movida.</p>
        <a href="/" className="inline-flex items-center min-h-12 text-sm text-accent mt-4">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
