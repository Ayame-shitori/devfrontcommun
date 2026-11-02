import { cn } from "@/utils/cn"
import { useEffect, useState } from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react"
import { loadParcoursSearch } from "@/features/parcours/parcours.search"
import { navItems } from "./navigation"

type SidebarProps = {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Ferme le menu mobile après navigation
  useEffect(() => {
    onMobileClose()
  }, [pathname, onMobileClose])

  return (
    <>
      {/* Fond sombre mobile */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={cn(
          "flex h-screen shrink-0 flex-col border-r border-zinc-200 bg-white transition-[width,transform] duration-200",
          // Mobile : tiroir par-dessus le contenu
          "fixed inset-y-0 left-0 z-50 w-60 md:static md:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Desktop : largeur réduite / étendue
          isOpen ? "md:w-60" : "md:w-16"
        )}
      >
        {/* Marque */}
        <div className="flex h-14 items-center gap-3 border-b border-zinc-200 px-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-sm font-semibold text-white">
            U
          </div>
          {(isOpen || mobileOpen) && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-zinc-900">UPJV</p>
              <p className="truncate text-xs text-zinc-500">Parcours & notes</p>
            </div>
          )}
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded p-1 text-zinc-400 hover:text-zinc-600 md:hidden"
            aria-label="Fermer le menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {(isOpen || mobileOpen) && (
            <p className="px-2 pb-2 text-xs font-medium text-zinc-400">
              Navigation
            </p>
          )}
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              // Retrouver recherche/filtre/tri en revenant sur Parcours
              search={item.to === "/parcours" ? loadParcoursSearch() : undefined}
              activeOptions={{ exact: item.to === "/" }}
              title={isOpen || mobileOpen ? undefined : item.label}
              className={cn(
                "flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium text-zinc-600 transition-colors",
                "hover:bg-zinc-100 hover:text-zinc-900",
                "data-[status=active]:bg-zinc-100 data-[status=active]:text-zinc-900",
                !isOpen && "md:justify-center md:px-0"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {(isOpen || mobileOpen) && (
                <span className={cn("truncate", !isOpen && "md:hidden")}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Pied : réduire seulement sur desktop */}
        <div className="hidden border-t border-zinc-200 p-3 md:block">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? "Réduire le menu" : "Déplier le menu"}
            className={cn(
              "flex h-9 w-full items-center gap-3 rounded-md px-2.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900",
              !isOpen && "justify-center px-0"
            )}
          >
            {isOpen ? (
              <PanelLeftClose className="size-4 shrink-0" />
            ) : (
              <PanelLeftOpen className="size-4 shrink-0" />
            )}
            {isOpen && <span>Réduire</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
