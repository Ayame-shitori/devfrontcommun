/** Paramètres d'URL pour la page Parcours (partageables / persistants). */

export type ParcoursSort = "desc" | "asc" | "name-asc" | "name-desc";
export type ParcoursAnnee = "ALL" | 1 | 2;

export type ParcoursSearch = {
  recherche?: string;
  annee?: ParcoursAnnee;
  tri?: ParcoursSort;
  page?: number;
};

const SORT_VALUES: ParcoursSort[] = ["desc", "asc", "name-asc", "name-desc"];

/** Parse et sécurise les query params venant de l'URL. */
export function validateParcoursSearch(search: Record<string, unknown>): ParcoursSearch {
  // Compat : ancien param `q` / `sort` si un vieux lien existe encore
  const rawRecherche =
    typeof search.recherche === "string"
      ? search.recherche
      : typeof search.q === "string"
        ? search.q
        : undefined;

  let annee: ParcoursAnnee | undefined;
  if (search.annee === 1 || search.annee === "1") annee = 1;
  else if (search.annee === 2 || search.annee === "2") annee = 2;
  else if (search.annee === "ALL") annee = "ALL";

  const rawTri = typeof search.tri === "string" ? search.tri : search.sort;
  const tri =
    typeof rawTri === "string" && SORT_VALUES.includes(rawTri as ParcoursSort)
      ? (rawTri as ParcoursSort)
      : undefined;

  const pageNum = Number(search.page);
  const page = Number.isFinite(pageNum) && pageNum > 1 ? Math.floor(pageNum) : undefined;

  return {
    recherche: rawRecherche?.trim() ? rawRecherche : undefined,
    annee,
    tri,
    page,
  };
}

/** Valeurs effectives (avec défauts) pour filtrer / trier / paginer. */
export function resolveParcoursSearch(search: ParcoursSearch) {
  return {
    recherche: search.recherche ?? "",
    annee: search.annee ?? ("ALL" as ParcoursAnnee),
    tri: search.tri ?? ("desc" as ParcoursSort),
    page: search.page ?? 1,
  };
}

/** Nettoie l'URL : on n'écrit pas les valeurs par défaut. */
export function toParcoursSearchParams(next: {
  recherche: string;
  annee: ParcoursAnnee;
  tri: ParcoursSort;
  page: number;
}): ParcoursSearch {
  return {
    recherche: next.recherche.trim() ? next.recherche : undefined,
    annee: next.annee === "ALL" ? undefined : next.annee,
    tri: next.tri === "desc" ? undefined : next.tri,
    page: next.page > 1 ? next.page : undefined,
  };
}

const STORAGE_KEY = "parcours-search";

export function hasParcoursSearchState(search: ParcoursSearch) {
  return Boolean(search.recherche || search.annee || search.tri || search.page);
}

/** Sauvegarde locale pour retrouver les filtres en changeant de page du site. */
export function saveParcoursSearch(search: ParcoursSearch) {
  try {
    if (!hasParcoursSearchState(search)) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(search));
  } catch {
    // sessionStorage indisponible : on ignore
  }
}

export function loadParcoursSearch(): ParcoursSearch | undefined {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return validateParcoursSearch(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return undefined;
  }
}
