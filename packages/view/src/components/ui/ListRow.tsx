import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type ListRowTone = "violet" | "teal" | "neutral";

const badgeTones: Record<ListRowTone, string> = {
  violet: "bg-violet-800 text-white",
  teal: "bg-teal-700 text-white",
  neutral: "bg-zinc-800 text-white",
};

/** Repos = clair ; hover = teinte + ombre pour bien voir la différence. */
const cardTones: Record<ListRowTone, string> = {
  violet:
    "border-violet-200 bg-white hover:border-violet-500 hover:bg-violet-100 hover:shadow-md",
  teal: "border-teal-200 bg-white hover:border-teal-600 hover:bg-teal-100 hover:shadow-md",
  neutral:
    "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-100 hover:shadow-md",
};

type ListRowProps = {
  children: ReactNode;
  /** Zone d'actions à droite. Le clic ne déclenche pas onClick de la ligne. */
  actions?: ReactNode;
  tone?: ListRowTone;
  onClick?: () => void;
  className?: string;
  /**
   * card = ligne isolée bordée
   * flush = ligne dans une liste divisée (style tableau)
   */
  variant?: "card" | "flush";
};

/** Ligne de liste réutilisable — structure sobre, contenu fourni par la page. */
export function ListRow({
  children,
  actions,
  tone = "neutral",
  onClick,
  className = "",
  variant = "card",
}: ListRowProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex flex-col gap-3 px-4 py-3.5 transition-all duration-150 sm:flex-row sm:items-center sm:gap-5",
        onClick && "cursor-pointer",
        variant === "card" && cn("rounded-lg border", cardTones[tone]),
        variant === "flush" && "bg-white hover:bg-zinc-100",
        className
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">{children}</div>

      {actions && (
        <div
          className="w-full sm:w-auto sm:shrink-0"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </div>
  );
}

type ListBadgeProps = {
  children: ReactNode;
  tone?: ListRowTone;
};

/** Badge associé à ListRow. */
export function ListBadge({ children, tone = "neutral" }: ListBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase",
        badgeTones[tone]
      )}
    >
      {children}
    </span>
  );
}
