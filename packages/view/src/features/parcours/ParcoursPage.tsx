import { useState, useEffect, useMemo } from "react";
import { Card, PageContainer, PageHeader } from "@/components/layout/Page";
import { Plus, FileCog, Calendar, GraduationCap, CheckCircle2, AlertCircle } from "lucide-react";
import { ParcoursFormModal } from "./ParcoursFormModal";
import { fetchParcours, type Parcours } from "./parcours.api";

export function ParcoursPage() {
  const [parcoursList, setParcoursList] = useState<Parcours[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParcours, setSelectedParcours] = useState<Parcours | null>(null);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const [filterYear, setFilterYear] = useState<"ALL" | 1 | 2>("ALL");

  useEffect(() => {
    fetchParcours()
      .then((data) => {
        setParcoursList(data);
        setPageError(null);
      })
      .catch((err: Error) => {
        setPageError(err.message);
      });
  }, []);

  const notify = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const filteredParcours = useMemo(() => {
    if (filterYear === "ALL") return parcoursList;
    return parcoursList.filter((p) => p.anneeFormation === filterYear);
  }, [parcoursList, filterYear]);

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Parcours"
            description="Consultez et administrez l'offre de formation de l'établissement."
          />
          <button
            onClick={() => {
              setSelectedParcours(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-950 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-900 transition-colors"
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
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            {pageError}
          </div>
        )}

        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <span className="text-xs font-medium text-zinc-500">
            {filteredParcours.length} parcours affiché{filteredParcours.length > 1 ? "s" : ""}
          </span>

          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
            <button
              onClick={() => setFilterYear("ALL")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filterYear === "ALL"
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Tous ({parcoursList.length})
            </button>
            <button
              onClick={() => setFilterYear(1)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                filterYear === 1
                  ? "bg-purple-900 text-white shadow-2xs"
                  : "text-purple-900 hover:bg-purple-50"
              }`}
            >
              M1 ({parcoursList.filter((p) => p.anneeFormation === 1).length})
            </button>
            <button
              onClick={() => setFilterYear(2)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                filterYear === 2
                  ? "bg-cyan-800 text-white shadow-2xs"
                  : "text-cyan-800 hover:bg-cyan-50"
              }`}
            >
              M2 ({parcoursList.filter((p) => p.anneeFormation === 2).length})
            </button>
          </div>
        </div>

        <Card>
          {filteredParcours.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <GraduationCap className="h-10 w-10 text-zinc-300 mb-2" />
              <p className="text-sm font-medium text-zinc-700">Aucun parcours disponible</p>
              <p className="text-xs text-zinc-400 mt-1">
                Aucun parcours n'est enregistré pour cette sélection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredParcours.map((p) => {
                const isM1 = p.anneeFormation === 1;

                return (
                  <div
                    key={p.id}
                    className={`relative flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-xs ${
                      isM1
                        ? "border-purple-200 bg-purple-50/30 hover:border-purple-300"
                        : "border-cyan-200 bg-cyan-50/30 hover:border-cyan-300"
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r ${
                        isM1 ? "bg-purple-900" : "bg-cyan-800"
                      }`}
                    />

                    <div className="pl-3 pr-2 space-y-1">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase rounded text-white ${
                          isM1 ? "bg-purple-900" : "bg-cyan-800"
                        }`}
                      >
                        {isM1 ? "Master 1" : "Master 2"}
                      </span>

                      <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
                        {p.nomParcours}
                      </h4>

                      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Créé le {formatDate(p.created_at)}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedParcours(p);
                        setIsModalOpen(true);
                      }}
                      title="Configurer le parcours"
                      className="shrink-0 flex items-center gap-1.5 rounded-lg border border-sky-950/20 bg-sky-950 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-900 transition-colors shadow-2xs"
                    >
                      <FileCog className="h-4 w-4" />
                      <span>Gérer</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <ParcoursFormModal
        isOpen={isModalOpen}
        initialData={selectedParcours}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaveSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </PageContainer>
  );
}