import {Link} from "react-router-dom";

interface SiteLogoProps {
    className?: string
}

export function LdsIcon({ className }: { className?: string }) {
    return (
        <img
            src="/lds-icon.svg"
            alt="Luka Dev Studio"
            className={className}
        />
    )
}

export default function SiteLogo({className}: SiteLogoProps) {
    return (
        <Link to="/" className={className}>
            <div className="flex items-center justify-center">
                <LdsIcon className="h-8 w-8 shrink-0 rounded-lg" />
                <span className="ml-2 text-xl font-bold tracking-tight">Luka Dev Studio</span>
            </div>
        </Link>
    )
}
