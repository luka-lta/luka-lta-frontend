/**
 * Winziger Store für die Rotationszeile des Material-Panels. Die 3D-Szene schreibt hinein, nur das
 * Panel liest per `useSyncExternalStore` – so rendert nicht der ganze Hero bei jeder Meldung neu.
 */
export type RotationTextStore = {
  getText: () => string;
  /** Setzt den Text; meldet nur echte Änderungen. Gibt zurück, ob sich etwas geändert hat. */
  setText: (text: string) => boolean;
  subscribe: (listener: () => void) => () => void;
};

export const createRotationTextStore = (initialText: string): RotationTextStore => {
  let text = initialText;
  const listeners = new Set<() => void>();

  return {
    getText: () => text,
    setText: (nextText) => {
      if (nextText === text) return false;
      text = nextText;
      listeners.forEach((listener) => listener());
      return true;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};
