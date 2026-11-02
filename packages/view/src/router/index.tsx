import { App } from "@/App"
import { features } from "@/config/features"
import { ExercicesPage } from "@/features/exercices/ExercicesPage"
import { HomePage } from "@/features/home/HomePage"
import { ParcoursPage } from "@/features/parcours/ParcoursPage"
import { validateParcoursSearch } from "@/features/parcours/parcours.search"
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  RouterProvider,
} from "@tanstack/react-router"

const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
})

const parcoursRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/parcours",
  validateSearch: validateParcoursSearch,
  component: ParcoursPage,
})

const exercicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exercices",
  // Page masquée tant que le flag est désactivé
  beforeLoad: () => {
    if (!features.exercicesPerf) throw redirect({ to: "/" })
  },
  component: ExercicesPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  parcoursRoute,
  exercicesRoute,
])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export function Router() {
  return <RouterProvider router={router} />
}
