import {Button} from "@/components/ui/button.tsx";
import SiteLogo from "@/components/SiteLogo.tsx";

export function Navbar() {
    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
            <a className="flex items-center justify-center" href="/">
                <SiteLogo />
            </a>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                <a className="text-sm font-medium hover:underline underline-offset-4" href="#about">
                    About
                </a>
                <a className="text-sm font-medium hover:underline underline-offset-4" href="#skills">
                    Skills
                </a>
                <a className="text-sm font-medium hover:underline underline-offset-4" href="#projects">
                    Projects
                </a>
                <a className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
                    Contact
                </a>
                <a className="text-sm font-medium hover:underline underline-offset-4" href="/links">
                    Links
                </a>
            </nav>
            <Button className="ml-4" variant="outline">
                Resume
            </Button>
        </header>
    )
}