import {Origami} from "lucide-react";
import {Link} from "react-router-dom";

interface SiteLogoProps {
    className?: string
}

export default function SiteLogo({className}: SiteLogoProps) {

    return (
        <>
            <Link to="/" className={className}>
                <div className={"flex items-center"}>
                    <Origami className="h-8 w-8"/>
                    <span className="ml-2 text-2xl font-bold">luka-lta.dev</span>
                </div>
            </Link>
        </>
    )
}