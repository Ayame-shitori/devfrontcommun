import { FormSelect } from "./FormElements";

export type SortOption<T extends string = string> = {
  value: T;
  label: string;
};

type SortSelectProps<T extends string> = {
  id: string;
  value: T;
  options: SortOption<T>[];
  onChange: (value: T) => void;
  label?: string;
  className?: string;
};

/** Select de tri réutilisable : la page fournit juste les options. */
export function SortSelect<T extends string>({
  id,
  value,
  options,
  onChange,
  label,
  className = "",
}: SortSelectProps<T>) {
  return (
    <FormSelect
      id={id}
      label={label}
      className={className}
      value={value}
      aria-label={label ?? "Trier la liste"}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </FormSelect>
  );
}

/** Compare deux textes (A→Z ou Z→A). */
export function compareByText(a: string, b: string, direction: "asc" | "desc" = "asc") {
  const result = a.localeCompare(b, "fr", { sensitivity: "base" });
  return direction === "asc" ? result : -result;
}

/** Compare deux dates (plus récents / plus anciens). */
export function compareByDate(
  a?: string | number,
  b?: string | number,
  direction: "asc" | "desc" = "desc"
) {
  const dateA = typeof a === "number" ? a : a ? new Date(a).getTime() : 0;
  const dateB = typeof b === "number" ? b : b ? new Date(b).getTime() : 0;
  return direction === "desc" ? dateB - dateA : dateA - dateB;
}
