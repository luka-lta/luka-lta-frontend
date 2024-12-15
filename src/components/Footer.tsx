import {FaGithub, FaLinkedin, FaTwitter} from "react-icons/fa6";

export function Footer() {
    return (
        <footer className="py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    &copy; Built by Luka ♥️. The source code is available on GitHub.
                </p>
                <div className="flex items-center gap-4">
                    <a href="https://github.com/luka-lta" target="_blank" rel="noreferrer">
                        <FaGithub className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <a href="https://twitter.com/luka-lta" target="_blank" rel="noreferrer">
                        <FaTwitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </a>
                    <a href="https://linkedin.com/in/luka.lta" target="_blank" rel="noreferrer">
                        <FaLinkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                    </a>
                </div>
            </div>
        </footer>
    )
}