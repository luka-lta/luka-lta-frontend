import {useState, useEffect} from 'react'
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

const useTypingEffect = (text: string, delay: number) => {
    const [currentText, setCurrentText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex])
                setCurrentIndex(prevIndex => prevIndex + 1)
            }, delay)

            return () => clearTimeout(timeout)
        }
    }, [currentIndex, delay, text])

    return currentText
}

const Hero = () => {
    const typedText = useTypingEffect("I'm a Full Stack Developer", 100)

    return (
        <section className="text-center py-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Hello, I'm Luka</h1>
            <h2 className="text-2xl md:text-3xl mb-8">{typedText}</h2>
            <Button
                className="bg-purple-800 font-bold py-2 px-4 rounded"
            >
                <Link to={'/links'}>
                    See my Links
                </Link>
            </Button>
        </section>
    )
}

export default Hero

