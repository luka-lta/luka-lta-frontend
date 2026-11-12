const MIN_DIGITS = 2;

/** Zweistellige Nummer mit führender Null, z. B. 1 → '01'. */
export function formatSectionIndex(position: number): string {
  return String(position).padStart(MIN_DIGITS, '0');
}

/** Zähler wie '01 / 05'. */
export function formatCounter(current: number, total: number): string {
  return `${formatSectionIndex(current)} / ${formatSectionIndex(total)}`;
}
