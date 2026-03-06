import Links from "@/feature/links";
import {useSetPageTitle} from "@/hooks/use-set-page-title.ts";

export default function LinksPage() {
    useSetPageTitle('Links - luka-lta.dev');

    return (
        <Links />
    );
}
