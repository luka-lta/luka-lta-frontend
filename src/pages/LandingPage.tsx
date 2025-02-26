import Header from "@/components/Landing/Header";
import Hero from "@/components/Landing/Hero.tsx";
import WearYourStory from "@/components/Landing/WearYourStory.tsx";
import Timeline from "@/components/Landing/Timeline.tsx";
import Marquee from "@/components/Landing/Marquee.tsx";
import ContactForm from "@/components/Landing/ContactForm.tsx";
import NewsletterSubscribe from "@/components/Landing/NewsletterSubscribe.tsx";
import Footer from "@/components/Landing/Footer.tsx";
import Skills from "@/components/Landing/Skills.tsx";

export default function LandingPage() {
    return (
        <>
            <Header/>
            <main>
                <Hero/>
                <WearYourStory/>
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