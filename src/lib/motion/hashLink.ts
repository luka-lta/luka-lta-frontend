/** Die für die Entscheidung relevanten Daten eines Klicks auf einen Link. */
export type HashLinkClick = {
  /** Rohes `href`-Attribut, nicht die aufgelöste URL. */
  href: string | null;
  /** `target`-Attribut des Links. */
  target: string | null;
  hasDownload: boolean;
  button: number;
  /** Cmd, Ctrl, Shift oder Alt gedrückt (neuer Tab, neues Fenster, Download …). */
  isModified: boolean;
  isDefaultPrevented: boolean;
};

/** Hauptmaustaste laut `MouseEvent.button`. */
const PRIMARY_BUTTON = 0;

/**
 * Liefert die Ziel-ID, wenn ein Klick ein einfacher Sprung innerhalb der Seite ist (`href="#id"`),
 * den der Smooth Scroll übernehmen darf; sonst `null`, damit der Browser normal reagiert.
 */
export const getSamePageHashTarget = (click: HashLinkClick): string | null => {
  if (click.isDefaultPrevented || click.isModified || click.button !== PRIMARY_BUTTON) return null;
  if (click.hasDownload) return null;
  if (click.target !== null && click.target !== '' && click.target !== '_self') return null;
  if (click.href === null || !click.href.startsWith('#') || click.href.length < 2) return null;
  try {
    return decodeURIComponent(click.href.slice(1));
  } catch {
    return null;
  }
};
