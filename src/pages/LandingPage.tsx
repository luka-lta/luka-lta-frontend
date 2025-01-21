import StarBackground from "@/components/StarBackground.tsx";
import {Navbar} from "@/components/Navbar.tsx";
import {Footer} from "@/components/Footer.tsx";
import Hero from "@/components/Landing/Hero.tsx";
import About from "@/components/Landing/About.tsx";
import Projects from "@/components/Landing/Projects.tsx";
import Skills from "@/components/Landing/Skills.tsx";
import Contact from "@/components/Landing/Contact.tsx";

export default function LandingPage() {
    return (
        <>
            <StarBackground/>
            <Navbar/>
            <div className="min-h-screen text-gray-800 dark:text-gray-200">
                <main className="container mx-auto px-4 py-8">
                    <Hero/>
                    <About/>
                    <Projects/>
                    <Skills/>
                    <Contact/>
                </main>
            </div>

            <Footer/>
        </>
    );
}