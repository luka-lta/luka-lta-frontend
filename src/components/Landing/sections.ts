export type LandingSectionId = 'top' | 'about' | 'projects' | 'skills' | 'services' | 'timeline' | 'contact';

/** Sektionen der Startseite in Dokumentreihenfolge (entspricht LandingPage). */
export const LANDING_SECTIONS: ReadonlyArray<{ id: LandingSectionId; navKey: string }> = [
  { id: 'top', navKey: 'nav.top' },
  { id: 'about', navKey: 'nav.about' },
  { id: 'projects', navKey: 'nav.projects' },
  { id: 'skills', navKey: 'nav.skills' },
  { id: 'services', navKey: 'nav.services' },
  { id: 'timeline', navKey: 'nav.timeline' },
  { id: 'contact', navKey: 'nav.contact' },
];

/** Nummer der Sektion für die Anzeige; `top` hat keine Nummer (0). */
export function getSectionNumber(id: LandingSectionId): number {
  return LANDING_SECTIONS.findIndex((section) => section.id === id);
}

/** Filtert die Sektions-IDs auf jene, die laut `isPresent` im DOM vorhanden sind (Reihenfolge bleibt erhalten). */
export function filterPresentSections(
  ids: ReadonlyArray<LandingSectionId>,
  isPresent: (id: LandingSectionId) => boolean,
): LandingSectionId[] {
  return ids.filter(isPresent);
}
