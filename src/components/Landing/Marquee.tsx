const MARQUEE_REPEATS = 4;

/** Rein dekorativ: Laufband mit Domain und Trenner, per CSS animiert (pausiert bei data-motion="off"). */
export default function Marquee() {
  return (
    <div
      className="relative w-full overflow-hidden border-y border-border bg-background py-10 md:py-14"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {Array.from({ length: MARQUEE_REPEATS }, (_, index) => (
              <span key={index} className="flex items-center">
                <span className="px-6 text-6xl font-black tracking-tight text-foreground sm:text-7xl md:px-10 md:text-9xl">
                  luka-lta.dev
                </span>
                <span className="font-mono text-5xl text-primary sm:text-6xl md:text-8xl">↗</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
