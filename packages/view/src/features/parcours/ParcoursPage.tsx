import { useState, useEffect, useMemo } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { Card, PageContainer, PageHeader } from "@/components/layout/Page";
import { Dialog } from "@/components/ui/Dialog";
import { Button, FormInput } from "@/components/ui/FormElements";
import { ListBadge, ListRow } from "@/components/ui/ListRow";
import { Pagination, paginateItems } from "@/components/ui/Pagination";
import {
  SortSelect,
  compareByDate,
  compareByText,
  type SortOption,
} from "@/components/ui/SortSelect";
import { highlightMatch } from "@/utils/highlightMatch";
import { Plus, FileCog, Calendar, GraduationCap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ParcoursFormModal } from "./ParcoursFormModal";
import { fetchParcours, type Parcours } from "./parcours.api";
import {
  hasParcoursSearchState,
  loadParcoursSearch,
  resolveParcoursSearch,
  saveParcoursSearch,
  toParcoursSearchParams,
  type ParcoursAnnee,
  type ParcoursSort,
} from "./parcours.search";

const PAGE_SIZE = 10;
const parcoursRoute = getRouteApi("/parcours");

const PARCOURS_SORT_OPTIONS: SortOption<ParcoursSort>[] = [
  { value: "desc", label: "Plus récents" },
  { value: "asc", label: "Plus anciens" },
  { value: "name-asc", label: "Nom A → Z" },
  { value: "name-desc", label: "Nom Z → A" },
];

export function ParcoursPage() {
  const urlSearch = parcoursRoute.useSearch();
  const navigate = parcoursRoute.useNavigate();
  const { recherche: search, annee: filterYear, tri: sortOrder, page: currentPage } =
    resolveParcoursSearch(urlSearch);

  const [parcoursList, setParcoursList] = useState<Parcours[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedParcours, setSelectedParcours] = useState<Parcours | null>(null);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  /** Met à jour l'URL en gardant toujours recherche + filtre + tri + page. */
  const updateUrl = (patch: {
    recherche?: string;
    annee?: ParcoursAnnee;
    tri?: ParcoursSort;
    page?: number;
    resetPage?: boolean;
  }) => {
    const next = toParcoursSearchParams({
      // Valeurs actuelles du hook = source fiable (évite de perdre la recherche)
      recherche: patch.recherche ?? search,
      annee: patch.annee ?? filterYear,
      tri: patch.tri ?? sortOrder,
      page: patch.resetPage ? 1 : (patch.page ?? currentPage),
    });
    saveParcoursSearch(next);
    navigate({ search: next, replace: true });
  };

  const loadParcours = () => {
    setIsLoading(true);
    setPageError(null);

    fetchParcours()
      .then((data) => {
        setParcoursList(data);
      })
      .catch((err: Error) => {
        setPageError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadParcours();
  }, []);

  // Restaure les filtres sauvegardés si on revient sur /parcours sans params
  useEffect(() => {
    if (hasParcoursSearchState(urlSearch)) {
      saveParcoursSearch(urlSearch);
      return;
    }
    const saved = loadParcoursSearch();
    if (saved && hasParcoursSearchState(saved)) {
      navigate({ search: saved, replace: true });
    }
  }, []);

  const notify = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const filteredParcours = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = parcoursList.filter((p) => {
      const matchYear = filterYear === "ALL" || p.anneeFormation === filterYear;
      const matchSearch = query === "" || p.nomParcours.toLowerCase().includes(query);
      return matchYear && matchSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "name-asc" || sortOrder === "name-desc") {
        return compareByText(
          a.nomParcours,
          b.nomParcours,
          sortOrder === "name-asc" ? "asc" : "desc"
        );
      }

      return compareByDate(
        a.created_at ?? a.id,
        b.created_at ?? b.id,
        sortOrder
      );
    });
  }, [parcoursList, filterYear, search, sortOrder]);

  const { totalPages, items: paginatedParcours } = paginateItems(
    filteredParcours,
    currentPage,
    PAGE_SIZE
  );

  // Si l'URL demande une page trop haute, on la corrige
  useEffect(() => {
    if (currentPage > totalPages) {
      const next = toParcoursSearchParams({
        recherche: search,
        annee: filterYear,
        tri: sortOrder,
        page: totalPages,
      });
      saveParcoursSearch(next);
      navigate({ search: next, replace: true });
    }
  }, [currentPage, totalPages, search, filterYear, sortOrder, navigate]);

  // Aperçu limité pour rester lisible pendant la saisie
  const searchPreview = filteredParcours.slice(0, 5);
  const query = search.trim();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date non renseignée";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Date non renseignée"
      : new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(date);
  };

  const handleSaveSuccess = (savedParcours: Parcours, message: string) => {
    setParcoursList((prev) => {
      const exists = prev.some((p) => p.id === savedParcours.id);
      return exists
        ? prev.map((p) => (p.id === savedParcours.id ? savedParcours : p))
        : [savedParcours, ...prev];
    });
    notify(message);
  };

  const handleDeleteSuccess = (id: number, message: string) => {
    setParcoursList((prev) => prev.filter((p) => p.id !== id));
    notify(message);
  };

  return (
    <PageContainer>
      <div className="space-y-6 pt-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <PageHeader
            title="Parcours"
            description="Consultez et administrez l'offre de formation de l'établissement."
          />
          <button
            onClick={() => {
              setSelectedParcours(null);
              setIsModalOpen(true);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-950 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-900 transition-colors sm:w-auto sm:shrink-0"
          >
            <Plus className="h-4 w-4" />
            Nouveau parcours
          </button>
        </div>

        {feedbackMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            {feedbackMessage}
          </div>
        )}

        {pageError && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              {pageError}
            </div>
            <Button type="button" variant="secondary" onClick={loadParcours} disabled={isLoading}>
              Réessayer
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-3 border-b border-zinc-100 pb-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs lg:shrink-0">
            <FormInput
              id="parcours-search"
              type="search"
              placeholder="Rechercher un parcours"
              value={search}
              onChange={(e) => {
                updateUrl({ recherche: e.target.value, resetPage: true });
                setPreviewOpen(true);
              }}
              onFocus={() => setPreviewOpen(true)}
              onBlur={() => setTimeout(() => setPreviewOpen(false), 120)}
              aria-label="Rechercher un parcours"
              aria-expanded={previewOpen && query.length > 0}
              aria-controls="parcours-search-preview"
            />

            {previewOpen && query.length > 0 && (
              <ul
                id="parcours-search-preview"
                className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-zinc-200 bg-white py-1 shadow-xs"
              >
                {searchPreview.length === 0 ? (
                  <li className="px-3 py-2 text-xs text-zinc-500">Aucun résultat</li>
                ) : (
                  searchPreview.map((p) => {
                    const isM1 = p.anneeFormation === 1;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-zinc-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            updateUrl({ recherche: p.nomParcours, resetPage: true });
                            setPreviewOpen(false);
                          }}
                        >
                          <span className="truncate text-sm text-zinc-900">
                            {highlightMatch(p.nomParcours, query)}
                          </span>
                          <ListBadge tone={isM1 ? "violet" : "teal"}>
                            {isM1 ? "M1" : "M2"}
                          </ListBadge>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            )}
          </div>

          <span className="text-xs font-medium text-zinc-500 lg:mx-3 lg:shrink-0">
            {filteredParcours.length} parcours affiché{filteredParcours.length > 1 ? "s" : ""}
          </span>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:ml-auto lg:flex-nowrap">
            <div className="w-full sm:w-44 lg:w-44 lg:shrink-0">
              <SortSelect
                id="parcours-sort"
                value={sortOrder}
                options={PARCOURS_SORT_OPTIONS}
                onChange={(value) => updateUrl({ tri: value, resetPage: true })}
              />
            </div>

            <div className="flex w-full items-center gap-1 overflow-x-auto rounded-md border border-zinc-200 bg-white p-0.5 sm:w-auto lg:shrink-0">
              <button
                onClick={() => updateUrl({ annee: "ALL", resetPage: true })}
                className={`rounded px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  filterYear === "ALL"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                Tous ({parcoursList.length})
              </button>
              <button
                onClick={() => updateUrl({ annee: 1, resetPage: true })}
                className={`rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterYear === 1
                    ? "bg-violet-800 text-white"
                    : "text-violet-800 hover:bg-violet-50"
                }`}
              >
                M1 ({parcoursList.filter((p) => p.anneeFormation === 1).length})
              </button>
              <button
                onClick={() => updateUrl({ annee: 2, resetPage: true })}
                className={`rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterYear === 2
                    ? "bg-teal-700 text-white"
                    : "text-teal-800 hover:bg-teal-50"
                }`}
              >
                M2 ({parcoursList.filter((p) => p.anneeFormation === 2).length})
              </button>
            </div>
          </div>
        </div>

        <Card>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="mb-3 h-6 w-6 animate-spin text-sky-950" />
              <p className="text-sm text-zinc-600">Chargement des parcours…</p>
            </div>
          ) : filteredParcours.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <GraduationCap className="mb-3 h-8 w-8 text-zinc-300" />
              <p className="text-sm font-medium text-zinc-800">Aucun parcours disponible</p>
              <p className="mt-1 max-w-sm text-xs text-zinc-500">
                {search.trim()
                  ? "Aucun parcours ne correspond à cette recherche."
                  : filterYear !== "ALL"
                    ? "Aucun parcours pour ce filtre."
                    : "Aucun parcours n'est enregistré."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {paginatedParcours.map((p) => {
                  const isM1 = p.anneeFormation === 1;
                  const tone = isM1 ? "violet" : "teal";

                  return (
                    <ListRow
                      key={p.id}
                      variant="card"
                      tone={tone}
                      onClick={() => {
                        setSelectedParcours(p);
                        setIsDetailOpen(true);
                      }}
                      actions={
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedParcours(p);
                            setIsModalOpen(true);
                          }}
                          title="Configurer le parcours"
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 sm:w-auto"
                        >
                          <FileCog className="h-3.5 w-3.5" />
                          <span>Gérer</span>
                        </button>
                      }
                    >
                      <ListBadge tone={tone}>{isM1 ? "Master 1" : "Master 2"}</ListBadge>

                      <h4 className="text-[15px] font-medium leading-snug tracking-tight break-words text-zinc-900">
                        {highlightMatch(p.nomParcours, query)}
                      </h4>

                      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Créé le {formatDate(p.created_at)}</span>
                      </p>
                    </ListRow>
                  );
                })}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateUrl({ page })}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Même Dialog que la création : on change seulement le contenu affiché */}
      <Dialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Détail du parcours"
        icon={<GraduationCap className="h-5 w-5 text-sky-950" />}
      >
        {selectedParcours && (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500">Nom</p>
              <p className="text-sm font-semibold text-zinc-900">{selectedParcours.nomParcours}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500">Année de formation</p>
              <ListBadge tone={selectedParcours.anneeFormation === 1 ? "violet" : "teal"}>
                {selectedParcours.anneeFormation === 1 ? "Master 1" : "Master 2"}
              </ListBadge>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500">Date de création</p>
              <p className="flex items-center gap-1.5 text-sm text-zinc-700">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                {formatDate(selectedParcours.created_at)}
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setIsDetailOpen(false)}>
                Fermer
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsModalOpen(true);
                }}
              >
                Modifier
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <ParcoursFormModal
        isOpen={isModalOpen}
        initialData={selectedParcours}
        existingParcours={parcoursList}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaveSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </PageContainer>
  );
}