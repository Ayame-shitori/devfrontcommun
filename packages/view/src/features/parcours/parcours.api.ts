export interface Parcours {
  id: number;
  nomParcours: string;
  anneeFormation: 1 | 2;
  created_at?: string;
}

export interface ParcoursPayload {
  nomParcours: string;
  anneeFormation: 1 | 2;
}

interface ApiResponse<T> {
  message: string;
  parcours: T;
}

function handleApiError(response: Response): never {
  if (response.status === 400) {
    throw new Error("Les données transmises sont incomplètes ou invalides.");
  }
  if (response.status === 404) {
    throw new Error("Ce parcours est introuvable ou a déjà été supprimé.");
  }
  throw new Error("Une erreur serveur est survenue. Veuillez réessayer.");
}

export async function fetchParcours(): Promise<Parcours[]> {
  const res = await fetch("/api/parcours");
  if (!res.ok) handleApiError(res);
  return await res.json();
}

export async function createParcours(payload: ParcoursPayload): Promise<ApiResponse<Parcours>> {
  const res = await fetch("/api/parcours", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) handleApiError(res);
  return await res.json();
}

export async function updateParcours(id: number, payload: ParcoursPayload): Promise<ApiResponse<Parcours>> {
  const res = await fetch(`/api/parcours/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) handleApiError(res);
  return await res.json();
}

export async function deleteParcours(id: number): Promise<void> {
  const res = await fetch(`/api/parcours/${id}`, { method: "DELETE" });
  if (!res.ok) handleApiError(res);
}