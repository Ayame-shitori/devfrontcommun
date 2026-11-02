import { useCallback, useState } from "react"
import { Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"

export function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={closeMobileNav} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
