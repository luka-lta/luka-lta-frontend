import Header from "@/components/Landing/Header";
import Hero from "@/components/Landing/Hero.tsx";
import About from "@/components/Landing/About.tsx";
import Timeline from "@/components/Landing/Timeline.tsx";
import Marquee from "@/components/Landing/Marquee.tsx";
import ContactForm from "@/components/Landing/ContactForm.tsx";
import Skills from "@/components/Landing/Skills.tsx";
import Projects from "@/components/Landing/Projects.tsx";
import Footer from "@/components/Landing/Footer.tsx";

export default function LandingPage() {
    return (
        <>
            <Header/>
            <main>
                <Hero/>
                <About/>
                <Projects />
                <Skills />
                <Timeline/>
                <Marquee/>
                <ContactForm/>
            </main>

            <Footer/>
        </>
    )
}