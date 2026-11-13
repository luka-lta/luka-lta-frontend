/** In-Memory-Storage für Tests (kein DOM nötig). */
export const memoryStorage = (initial: Record<string, string> = {}): Storage => {
  const data = new Map(Object.entries(initial));
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => { data.delete(key); },
    setItem: (key, value) => { data.set(key, value); },
  };
};

/** Storage, dessen Zugriffe wie bei blockiertem Browser-Storage werfen. */
export const throwingStorage = (): Storage => ({
  ...memoryStorage(),
  getItem: () => { throw new Error('SecurityError'); },
  setItem: () => { throw new Error('QuotaExceededError'); },
});
