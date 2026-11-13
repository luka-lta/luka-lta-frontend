/**
 * Wählt die aktive Sektion: höchster sichtbarer Anteil, bei Gleichstand die frühere.
 * Ist nichts sichtbar, gilt `fallbackId`.
 */
export function pickActiveSection(
  entries: ReadonlyArray<{ id: string; ratio: number }>,
  fallbackId: string,
): string {
  let bestId = fallbackId;
  let bestRatio = 0;
  for (const entry of entries) {
    if (entry.ratio <= bestRatio) continue;
    bestId = entry.id;
    bestRatio = entry.ratio;
  }
  return bestId;
}
