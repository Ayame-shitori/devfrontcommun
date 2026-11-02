/** Surligne discrètement la partie du texte correspondant à la recherche. */
export function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;

  const index = text.toLowerCase().indexOf(q.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent font-semibold text-sky-950 underline decoration-sky-950/30 decoration-2 underline-offset-2">
        {text.slice(index, index + q.length)}
      </mark>
      {text.slice(index + q.length)}
    </>
  );
}
