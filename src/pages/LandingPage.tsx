import Header from "@/components/Landing/Header";
import Hero from "@/components/Landing/Hero.tsx";
import About from "@/components/Landing/About.tsx";
import Timeline from "@/components/Landing/Timeline.tsx";
import Marquee from "@/components/Landing/Marquee.tsx";
import ContactForm from "@/components/Landing/ContactForm.tsx";
import Skills from "@/components/Landing/Skills.tsx";
import Projects from "@/components/Landing/Projects.tsx";
import Footer from "@/components/Landing/Footer.tsx";
import Services from "@/components/Landing/Services.tsx";
import SectionRail from "@/components/Landing/SectionRail/SectionRail";
import SEO from "@/components/SEO.tsx";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
    const { t } = useTranslation();

    return (
        <>
            <SEO
                title="Luka Dev Studio — Code that ships."
                description={t('hero.description')}
                canonicalPath="/"
            />
            <Header/>
            <main id="main" tabIndex={-1} className="focus:outline-none">
                <Hero/>
                <About/>
                <Projects />
                <Skills />
                <Services />
                <Timeline/>
                <Marquee/>
                <ContactForm/>
            </main>
            {/* Nach <main> im DOM, damit die Rail-Links im Tab-Fluss nicht vor dem Hero liegen (Position ist fixed). */}
            <SectionRail />

            <Footer/>
        </>
    )
}
