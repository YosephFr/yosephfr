import { indexPath, type Lang } from "@/lib/content.mjs"

export default function EmptyRoute({ lang }: { lang: Lang }) {
  return (
    <main className="max-w-[680px] mx-auto px-4 py-16">
      <p className="text-base text-text-secondary">
        {lang === "en" ? "No English notes yet." : "No hay más páginas."}{" "}
        <a href={indexPath(lang === "en" ? "es" : lang)} className="text-accent underline">
          Blog
        </a>
      </p>
    </main>
  )
}
