/** Ab dieser Anzahl gemerkter Schlüssel werden abgelaufene Einträge aufgeräumt */
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  isAllowed: boolean;
  /** Sekunden bis zum Ende des laufenden Fensters (für den `Retry-After`-Header) */
  retryAfterSeconds: number;
}

interface RateLimitWindow {
  count: number;
  resetAt: number;
}

/**
 * Fixed-Window-Limiter im Arbeitsspeicher der Function-Instanz.
 * Gilt pro Instanz: bremst Bursts zuverlässig, ist aber keine instanzübergreifende Garantie.
 */
export class RateLimiter {
  private readonly windows = new Map<string, RateLimitWindow>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  consume(key: string, now: number): RateLimitResult {
    this.removeExpiredWindows(now);

    const current = this.windows.get(key);
    if (current === undefined || current.resetAt <= now) {
      this.windows.set(key, { count: 1, resetAt: now + this.windowMs });

      return { isAllowed: true, retryAfterSeconds: 0 };
    }

    current.count += 1;
    if (current.count <= this.limit) return { isAllowed: true, retryAfterSeconds: 0 };

    return { isAllowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }

  private removeExpiredWindows(now: number): void {
    if (this.windows.size < MAX_TRACKED_KEYS) return;

    for (const [key, window] of this.windows) {
      if (window.resetAt <= now) this.windows.delete(key);
    }

    // Immer noch voll: lieber Zähler verlieren als unbegrenzt Speicher belegen.
    if (this.windows.size >= MAX_TRACKED_KEYS) this.windows.clear();
  }
}
