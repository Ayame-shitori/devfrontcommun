import { useState, useEffect } from "react";
import { FileCog, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Dialog } from "../../components/ui/Dialog";
import { Button, FormInput, FormSelect } from "../../components/ui/FormElements";
import { createParcours, updateParcours, deleteParcours, type Parcours } from "./parcours.api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (p: Parcours, msg: string) => void;
  onDeleteSuccess: (id: number, msg: string) => void;
  initialData?: Parcours | null;
}

export function ParcoursFormModal({ isOpen, onClose, onSuccess, onDeleteSuccess, initialData }: Props) {
  const isEdit = Boolean(initialData);
  const [nomParcours, setNomParcours] = useState("");
  const [anneeFormation, setAnneeFormation] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNomParcours(initialData?.nomParcours ?? "");
    setAnneeFormation(initialData?.anneeFormation ?? 1);
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomParcours.trim()) return setError("Veuillez saisir un intitulé.");

    setLoading(true);
    setError(null);
    try {
      const payload = { nomParcours: nomParcours.trim(), anneeFormation };
      const { parcours } = isEdit && initialData
        ? await updateParcours(initialData.id, payload)
        : await createParcours(payload);

      onSuccess(parcours, isEdit ? "Parcours mis à jour avec succès." : "Nouveau parcours créé avec succès.");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData || !window.confirm(`Supprimer définitivement le parcours "${initialData.nomParcours}" ?`)) return;
    setLoading(true);
    try {
      await deleteParcours(initialData.id);
      onDeleteSuccess(initialData.id, "Le parcours a été supprimé.");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier le parcours" : "Nouveau parcours"}
      icon={isEdit ? <Pencil className="h-5 w-5 text-zinc-700" /> : <FileCog className="h-5 w-5 text-sky-950" />}
      isLocked={loading}
    >
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="nomParcours"
          label="Nom du parcours"
          required
          value={nomParcours}
          onChange={(e) => setNomParcours(e.target.value)}
          placeholder="ex. MIAGE - Systèmes d'information"
        />

        <FormSelect
          id="anneeFormation"
          label="Année de formation"
          value={anneeFormation}
          onChange={(e) => setAnneeFormation(Number(e.target.value) as 1 | 2)}
        >
          <option value={1}>Master 1 (M1)</option>
          <option value={2}>Master 2 (M2)</option>
        </FormSelect>

        <div className="flex justify-between items-center pt-2">
          {isEdit ? (
            <Button type="button" variant="danger" loading={loading} onClick={handleDelete} className="text-xs">
              <Trash2 className="h-3.5 w-3.5" /> Supprimer
            </Button>
          ) : <div />}

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {isEdit ? "Enregistrer" : "Créer le parcours"}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}