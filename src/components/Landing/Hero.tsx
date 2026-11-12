import { useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import HeroVisual from '@/components/Landing/Hero/HeroVisual';
import MaterialPanel from '@/components/Landing/Hero/MaterialPanel';
import { formatRotation, STATIC_ROTATION } from '@/components/Landing/Hero/sceneSupport';
import { useMotion } from '@/lib/motion/MotionProvider';
import { cn } from '@/lib/utils';

const socials = [
  { icon: Github, href: 'https://github.com/luka-lta', label: 'GitHub', platform: 'github' },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/luka-liebenthal-aa047931b/',
    label: 'LinkedIn',
    platform: 'linkedin',
  },
  { icon: Mail, href: 'mailto:info@luka-lta.dev', label: 'Email', platform: 'email' },
];

const ease = [0.16, 1, 0.3, 1] as const;

/** Vertikaler Versatz der Einblendung in Pixeln. */
const FADE_OFFSET_PX = 24;
/** Dauer der Einblendung in Sekunden. */
const FADE_DURATION_S = 0.8;

/** Feines Raster, das nur zur Mitte hin sichtbar ist. */
const GRID_MASK = 'radial-gradient(ellipse 65% 60% at 50% 42%, black 0%, transparent 100%)';
const gridStyle: CSSProperties = {
  backgroundImage: [
    'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)',
    'linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '64px 64px',
  maskImage: GRID_MASK,
  WebkitMaskImage: GRID_MASK,
};

export default function Hero() {
  const { t } = useTranslation();
  const { isMotionEnabled } = useMotion();
  const [rotationText, setRotationText] = useState<string>(() => formatRotation(STATIC_ROTATION));

  // Nur Bewegung, keine Opacity: Hero-Text ist ab dem ersten Paint sichtbar (LCP).
  const fadeUp = (delay: number) => {
    if (!isMotionEnabled) return {};
    return {
      initial: { y: FADE_OFFSET_PX },
      animate: { y: 0 },
      transition: { duration: FADE_DURATION_S, delay, ease },
    };
  };

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-background pt-24 md:pt-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={gridStyle} />

      {/* Bühne: riesiger Name als Hintergrund-Ebene, davor das Logo (ab md zentriert darüber) */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 md:px-0">
        <h1
          className="select-none text-center font-extrabold leading-[0.86] tracking-tighter
            text-[clamp(2.5rem,14.5vw,4rem)] md:text-[clamp(4rem,16vw,14rem)]"
        >
          <span className="mx-auto block w-fit text-foreground">LUKA</span>{' '}
          <span className="mx-auto block w-fit gradient-text">LIEBENTHAL</span>
          <span className="sr-only"> – {t('hero.role')}</span>
        </h1>

        <HeroVisual
          onRotationTextChange={setRotationText}
          className="mt-8 w-36 md:absolute md:left-1/2 md:top-1/2 md:mt-0 md:w-[clamp(11rem,20vw,19rem)]
            md:-translate-x-1/2 md:-translate-y-1/2"
        />
      </div>

      {/* Inhaltsblock unten links, Material-Panel (nur lg) rechts daneben unterhalb der Bühne */}
      <motion.div
        {...fadeUp(0.2)}
        className="relative z-10 mx-auto mt-12 flex w-full max-w-7xl items-end justify-between gap-12 px-6 lg:px-8"
      >
        <div className="max-w-md">
          <p
            className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/80 px-4 py-1.5
              text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <span
              className={cn('h-1.5 w-1.5 rounded-full bg-teal', isMotionEnabled && 'animate-pulse')}
              aria-hidden="true"
            />
            {t('hero.available')}
          </p>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{t('hero.description')}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2 rounded-full px-7 font-semibold">
              <a
                href="#contact"
                data-trackspire-event="cta_click"
                data-trackspire-prop-type="contact"
                data-trackspire-prop-source="hero"
              >
                {t('hero.cta_contact')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border/60 px-7 font-semibold hover:border-primary/50 hover:bg-primary/10
                hover:text-primary"
            >
              <a
                href="#projects"
                data-trackspire-event="cta_click"
                data-trackspire-prop-type="projects"
                data-trackspire-prop-source="hero"
              >
                {t('hero.cta_projects')}
              </a>
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Hameln, DE</p>
            <span className="h-px w-6 bg-border" aria-hidden="true" />
            <div className="flex gap-2">
              {socials.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50
                    text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  data-trackspire-event="social_click"
                  data-trackspire-prop-platform={social.platform}
                  data-trackspire-prop-source="hero"
                >
                  <social.icon className="h-3.5 w-3.5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <MaterialPanel rotationText={rotationText} className="hidden lg:block" />
      </motion.div>

      {/* Unten-Leiste: Scroll-Hinweis · Tagline · Rolle */}
      <motion.div {...fadeUp(0.35)} className="relative z-10 mx-auto mt-10 w-full max-w-7xl px-6 pb-6 lg:px-8">
        <div
          className="grid grid-cols-2 items-center gap-4 border-t border-border/40 pt-5 font-mono text-xs uppercase
            tracking-[0.2em] text-muted-foreground md:grid-cols-3"
        >
          <a href="#about" className="inline-flex w-fit items-center gap-2 transition-colors hover:text-foreground">
            {t('hero.scroll_hint')}
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <p className="hidden text-center font-sans text-sm normal-case italic tracking-normal md:block">
            "Your idea, shipped."
          </p>
          {/* Rolle steht bereits (sr-only) in der h1 */}
          <p className="text-right" aria-hidden="true">
            {t('hero.role')}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
