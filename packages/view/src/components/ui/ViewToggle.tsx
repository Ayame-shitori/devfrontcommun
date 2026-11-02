import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/utils/cn";

export type ViewMode = "cards" | "table";

type ViewToggleProps = {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
};

/** Bascule cartes / tableau, réutilisable. */
export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white p-0.5"
      role="group"
      aria-label="Mode d'affichage"
    >
      <button
        type="button"
        onClick={() => onChange("cards")}
        aria-pressed={value === "cards"}
        title="Vue cartes"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded transition-colors",
          value === "cards"
            ? "bg-zinc-900 text-white"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("table")}
        aria-pressed={value === "table"}
        title="Vue tableau"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded transition-colors",
          value === "table"
            ? "bg-zinc-900 text-white"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
        )}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
