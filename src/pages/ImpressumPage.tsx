import Impressum from '@/feature/impressum';
import { useSetPageTitle } from '@/hooks/use-set-page-title.ts';

function ImpressumPage() {
    useSetPageTitle('Impressum - luka-lta.dev');

    return <Impressum />;
}

export default ImpressumPage;
