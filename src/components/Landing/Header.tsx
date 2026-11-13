import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LdsIcon } from '@/components/SiteLogo';
import { LANDING_SECTIONS } from '@/components/Landing/sections';
import { formatSectionIndex } from '@/components/Landing/Section/sectionFormat';
import { useMotion } from '@/lib/motion/MotionProvider';
import { pauseSmoothScroll, resumeSmoothScroll } from '@/lib/motion/smoothScroll';
import { useSectionNavigation } from '@/lib/motion/useSectionNavigation';

/** Scroll-Schwelle in Pixeln, ab der der Header einen Hintergrund bekommt. */
const SCROLLED_THRESHOLD_PX = 40;
/** Ab dieser Breite (Tailwind `md`) gibt es kein Mobile-Menü mehr. */
const DESKTOP_QUERY = '(min-width: 768px)';
const STATUS_URL = 'https://status.luka-lta.dev';
const MENU_ID = 'mobile-menu';
/** Ziel des Skip-Links; jede Seite mit Header trägt `<main id="main" tabIndex={-1}>`. */
const MAIN_CONTENT_ID = 'main';
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';
const FOCUS_CLASS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const NAV_ITEM_CLASS = `font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground ${FOCUS_CLASS}`;

/** Sektionen in der Navigation (Dokumentreihenfolge, ohne Start und Werdegang). */
const NAV_SECTIONS = LANDING_SECTIONS.filter((section) => section.id !== 'top' && section.id !== 'timeline');
const DESKTOP_SECTIONS = NAV_SECTIONS.filter((section) => section.id !== 'contact');

type NavTarget =
  | { kind: 'section'; id: string; label: string }
  | { kind: 'route'; to: string; label: string }
  | { kind: 'external'; href: string; label: string };

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.slice(0, 2);

  const change = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18n-lang', lang);
  };

  return (
    <div
      role="group"
      aria-label={t('nav.language_label')}
      className="flex items-center rounded-full border border-border/60 px-1"
    >
      {(['de', 'en'] as const).map((lang, idx) => (
        <Fragment key={lang}>
          {idx > 0 && <span className="h-3 w-px bg-border/60" aria-hidden />}
          <button
            type="button"
            onClick={() => change(lang)}
            aria-label={`Switch to ${lang.toUpperCase()}`}
            aria-pressed={currentLang === lang}
            className={`rounded-full px-2.5 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${FOCUS_CLASS} ${
              currentLang === lang ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {lang}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const { isMotionEnabled } = useMotion();
  const goToSection = useSectionNavigation();
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLLED_THRESHOLD_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => setIsMobileOpen(false), []);

  // Offenes Menü: Escape schließt, Tab bleibt in Header + Overlay, Seiten-Scroll ist gesperrt.
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;
      const roots = [headerRef.current, overlayRef.current].filter((root): root is HTMLElement => root !== null);
      const items = roots
        .flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)))
        .filter((item) => item.getClientRects().length > 0);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const isInside = roots.some((root) => active !== null && root.contains(active));
      if (!isInside) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }
      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    // Über `md` ist das Menü nicht mehr sichtbar: schließen, damit Fokus und Scroll frei werden.
    const query = window.matchMedia(DESKTOP_QUERY);
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };
    query.addEventListener('change', onBreakpoint);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseSmoothScroll();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      query.removeEventListener('change', onBreakpoint);
      document.body.style.overflow = previousOverflow;
      resumeSmoothScroll();
    };
  }, [isMobileOpen, closeMenu]);

  // Fokus: beim Öffnen auf den ersten Eintrag, nach dem Schließen zurück auf den Button.
  useEffect(() => {
    if (isMobileOpen) {
      firstItemRef.current?.focus();
    } else if (wasOpenRef.current) {
      toggleRef.current?.focus();
    }
    wasOpenRef.current = isMobileOpen;
  }, [isMobileOpen]);

  const jumpTo = (id: string) => {
    closeMenu();
    // Lenis ignoriert `scrollTo`, solange es angehalten ist; das Menü-Effect-Cleanup käme zu spät.
    resumeSmoothScroll();
    goToSection(id);
  };

  const desktopTargets: NavTarget[] = [
    ...DESKTOP_SECTIONS.map((section): NavTarget => ({ kind: 'section', id: section.id, label: t(section.navKey) })),
    { kind: 'route', to: '/links', label: t('nav.links') },
    { kind: 'external', href: STATUS_URL, label: t('nav.status') },
  ];

  const mobileTargets: NavTarget[] = [
    ...NAV_SECTIONS.map((section): NavTarget => ({ kind: 'section', id: section.id, label: t(section.navKey) })),
    { kind: 'route', to: '/links', label: t('nav.links') },
    { kind: 'external', href: STATUS_URL, label: t('nav.status') },
  ];

  const renderDesktopItem = (target: NavTarget) => {
    if (target.kind === 'section') {
      return (
        <button
          key={target.id}
          type="button"
          onClick={() => jumpTo(target.id)}
          className={`rounded-full px-3 py-2 ${NAV_ITEM_CLASS}`}
        >
          {target.label}
        </button>
      );
    }
    if (target.kind === 'route') {
      return (
        <Link key={target.to} to={target.to} className={`rounded-full px-3 py-2 ${NAV_ITEM_CLASS}`}>
          {target.label}
        </Link>
      );
    }
    return (
      <a
        key={target.href}
        href={target.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-full px-3 py-2 ${NAV_ITEM_CLASS}`}
      >
        {target.label}
      </a>
    );
  };

  const renderMobileItem = (target: NavTarget, index: number) => {
    const number = (
      <span className="font-mono text-sm text-muted-foreground" aria-hidden>
        {formatSectionIndex(index + 1)}
      </span>
    );
    const itemClass = `flex items-baseline gap-4 py-2 text-start text-4xl font-black tracking-tight text-foreground transition-colors hover:text-primary ${FOCUS_CLASS}`;

    if (target.kind === 'section') {
      return (
        <li key={target.id}>
          <button type="button" ref={index === 0 ? firstItemRef : undefined} onClick={() => jumpTo(target.id)} className={itemClass}>
            {number}
            {target.label}
          </button>
        </li>
      );
    }
    if (target.kind === 'route') {
      return (
        <li key={target.to}>
          <Link to={target.to} onClick={closeMenu} className={itemClass}>
            {number}
            {target.label}
          </Link>
        </li>
      );
    }
    return (
      <li key={target.href}>
        <a href={target.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className={itemClass}>
          {number}
          {target.label} <span aria-hidden>↗</span>
        </a>
      </li>
    );
  };

  const overlayMotion = isMotionEnabled
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 } }
    : {};

  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-foreground ${FOCUS_CLASS}`}
      >
        {t('nav.skip_to_content')}
      </a>
      <motion.header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          isScrolled && !isMobileOpen ? 'bg-background/70 backdrop-blur-md' : 'bg-transparent'
        }`}
        initial={isMotionEnabled ? { y: -80, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label={t('nav.menu_label')}
          className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8"
        >
          <Link to="/" onClick={closeMenu} className={`flex items-center gap-2 text-foreground ${FOCUS_CLASS}`}>
            <LdsIcon className="h-6 w-6 rounded-md" />
            <span className="text-sm font-bold tracking-tight">Luka Dev Studio</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">{desktopTargets.map(renderDesktopItem)}</div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => jumpTo('contact')}
              className={`hidden rounded-full border border-foreground/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background md:inline-flex ${FOCUS_CLASS}`}
            >
              {t('nav.contact')} <span aria-hidden className="ms-1">↗</span>
            </button>
            <button
              type="button"
              ref={toggleRef}
              onClick={() => setIsMobileOpen((open) => !open)}
              aria-label={isMobileOpen ? t('nav.menu_close') : t('nav.menu_open')}
              aria-expanded={isMobileOpen}
              aria-controls={MENU_ID}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:border-primary/40 hover:text-primary md:hidden ${FOCUS_CLASS}`}
            >
              {isMobileOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            </button>
          </div>
        </nav>
      </motion.header>
      {createPortal(
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              id={MENU_ID}
              ref={overlayRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('nav.menu')}
              data-lenis-prevent
              {...overlayMotion}
              className="fixed inset-0 z-40 overflow-y-auto bg-background/95 pt-24 md:hidden"
            >
              <ul className="flex flex-col gap-2 px-6 pb-12">{mobileTargets.map(renderMobileItem)}</ul>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
