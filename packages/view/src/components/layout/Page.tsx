import { cn } from "@/utils/cn"
import type { ReactNode } from "react"

type PageContainerProps = {
  children: ReactNode
  className?: string
}

/** Conteneur centré avec largeur max et marges, à utiliser dans chaque page. */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8", className)}>
      {children}
    </div>
  )
}

type PageHeaderProps = {
  title: string
  description?: string
  /** Boutons ou actions affichés à droite du titre */
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex w-full items-center gap-2 sm:w-auto">{actions}</div>}
    </div>
  )
}

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-200 bg-white p-4 shadow-xs sm:p-6",
        className
      )}
    >
      {children}
    </div>
  )
}
