import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
                    <div key='privacy' className="pb-6">
                        <Link
                            to="/privacy"
                            rel="noopener noreferrer"
                            className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </nav>
                <p className="mt-10 text-center text-sm leading-5 text-muted-foreground">
                    Designed & Developed with ❤️ by Luka. Copyright luka-lta.dev
                </p>
            </div>
        </footer>
    )
}

