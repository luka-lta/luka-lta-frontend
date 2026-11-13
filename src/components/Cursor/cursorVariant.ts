export type CursorVariant = 'default' | 'link' | 'open' | 'drag';

/** Liest den Wert eines `data-cursor`-Attributs; unbekannte Werte fallen auf 'default' zurück. */
export function parseCursorVariant(value: string | null): CursorVariant {
  if (value === 'open') return 'open';
  if (value === 'drag') return 'drag';
  return 'default';
}
