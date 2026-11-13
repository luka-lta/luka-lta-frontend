import { Github, Linkedin, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LdsIcon } from "@/components/SiteLogo";
import Reveal from "@/components/Landing/Section/Reveal";
import { LANDING_SECTIONS } from "@/components/Landing/sections";
import { scrollToSection, scrollToTop } from "@/lib/motion/smoothScroll";

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/luka-liebenthal-aa047931b/" },
  { icon: Github, label: "GitHub", href: "https://github.com/luka-lta" },
];

/** Sektionen, die im Footer verlinkt werden (ohne `top`) */
const FOOTER_NAV_SECTIONS = LANDING_SECTIONS.filter((section) => section.id !== "top");

const FOCUS_CLASS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function Footer() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const footerLinks = [
    { name: t("footer.privacy"), url: "/privacy" },
    { name: t("footer.impressum"), url: "/impressum" },
  ];

  // Auf Unterseiten gibt es die Sektionen nicht: zurück zur Startseite.
  const goToSection = (id: string) => {
    if (pathname !== "/") {
      navigate("/");
      return;
    }
    scrollToSection(id);
  };

  const goToTop = () => {
    if (pathname !== "/") {
      navigate("/");
      return;
    }
    scrollToTop();
  };

  return (
    <footer aria-labelledby="footer-heading" className="w-full border-t border-border bg-background">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-4">
            <LdsIcon className="h-12 w-12 md:h-16 md:w-16" />
            <p className="text-4xl font-black tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Luka Dev Studio
            </p>
          </div>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </Reveal>

        <div className="mt-14 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Newsletter */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("footer.newsletter_label")}
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t("footer.newsletter_placeholder")}
                className="h-10 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                size="sm"
                className={`h-10 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90 ${FOCUS_CLASS}`}
                aria-label={t("footer.newsletter_aria")}
              >
                <Mail className="h-4 w-4" aria-hidden />
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" aria-hidden />
              <span>info@luka-lta.dev</span>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label={t("footer.nav_label")}>
            <ul className="space-y-2">
              {FOOTER_NAV_SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => goToSection(section.id)}
                    className={`text-sm text-muted-foreground transition-colors hover:text-foreground ${FOCUS_CLASS}`}
                  >
                    {t(section.navKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Rechtliches */}
          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.url}>
                  <Link
                    to={link.url}
                    className={`text-sm text-muted-foreground transition-colors hover:text-foreground ${FOCUS_CLASS}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  size="icon"
                  variant="ghost"
                  className={`h-9 w-9 rounded-full border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary ${FOCUS_CLASS}`}
                  aria-label={social.label}
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-4 w-4" aria-hidden />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex-row md:items-center">
          <span>{t("footer.copyright")}</span>
          <button
            type="button"
            onClick={goToTop}
            className={`transition-colors hover:text-foreground ${FOCUS_CLASS}`}
          >
            {t("footer.back_to_top")} ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
