import { Button } from "@/components/ui/button";
import SiteLogo from "@/components/SiteLogo";
import {ModeToggle} from "@/components/mode-toggle.tsx";

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-b border-gray-200 border-opacity-25">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
                <a className="flex items-center justify-center" href="/">
                    <SiteLogo/>
                </a>
                <nav className="flex gap-4 sm:gap-6">
                    <a className="text-sm font-medium hover:text-primary transition-colors" href="#about">
                        About
                    </a>
                    <a className="text-sm font-medium hover:text-primary transition-colors" href="#skills">
                        Skills
                    </a>
                    <a className="text-sm font-medium hover:text-primary transition-colors" href="#projects">
                        Projects
                    </a>
                    <a className="text-sm font-medium hover:text-primary transition-colors" href="#contact">
                        Contact
                    </a>
                    <a className="text-sm font-medium hover:text-primary transition-colors" href="/links">
                        Links
                    </a>
                </nav>
                <Button className="ml-4" variant="outline">
                    Resume
                </Button>
                <ModeToggle />
            </div>
        </header>
    )
}

