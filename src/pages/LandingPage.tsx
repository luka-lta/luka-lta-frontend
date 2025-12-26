import Header from "@/components/Landing/Header";
import Hero from "@/components/Landing/Hero.tsx";
import About from "@/components/Landing/About.tsx";
import Timeline from "@/components/Landing/Timeline.tsx";
import Marquee from "@/components/Landing/Marquee.tsx";
import ContactForm from "@/components/Landing/ContactForm.tsx";
import NewsletterSubscribe from "@/components/Landing/NewsletterSubscribe.tsx";
import Footer from "@/components/Landing/Footer.tsx";
import Skills from "@/components/Landing/Skills.tsx";
import Projects from "@/components/Landing/Projects.tsx";

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
                <NewsletterSubscribe/>
            </main>

            <Footer/>
        </>
    )
}