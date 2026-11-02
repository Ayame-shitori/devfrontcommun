import { useLocation } from "@tanstack/react-router"
import { ChevronRight, Menu } from "lucide-react"
import { navItems } from "./navigation"

type HeaderProps = {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()

  // Entrée de menu correspondant à l'URL courante ("/" uniquement en exact)
  const current = navItems.find((item) =>
    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)
  )

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 md:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-5" />
      </button>

      <nav className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="text-zinc-500">UPJV</span>
        {current && (
          <>
            <ChevronRight className="size-4 shrink-0 text-zinc-400" />
            <span className="truncate font-medium text-zinc-900">{current.label}</span>
          </>
        )}
      </nav>
    </header>
  )
}
