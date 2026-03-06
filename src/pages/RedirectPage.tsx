import RedirectLink from "@/feature/redirect";
import {useSetPageTitle} from "@/hooks/use-set-page-title.ts";

function RedirectPage() {
    useSetPageTitle('Redirect- luka-lta.dev');

    return (
        <RedirectLink />
    );
}

export default RedirectPage;