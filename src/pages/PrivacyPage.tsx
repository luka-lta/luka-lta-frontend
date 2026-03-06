import Privacy from "@/feature/privacy";
import {useSetPageTitle} from "@/hooks/use-set-page-title.ts";

function PrivacyPage() {
    useSetPageTitle('Privacy - luka-lta.dev');

    return (
        <Privacy />
    );
}

export default PrivacyPage;