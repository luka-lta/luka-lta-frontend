import { useEffect, useRef } from 'react';

function AnalyticsScript() {
    const isLoaded = useRef(false);

    useEffect(() => {
        if (isLoaded.current) return;

        const script = document.createElement('script');
        script.src = import.meta.env.VITE_SCRIPT_URL;
        script.async = true;
        script.setAttribute('data-site-id', import.meta.env.VITE_SITE_ID);

        script.onload = () => {
            isLoaded.current = true;
        };

        document.body.appendChild(script);

        return () => {
            if (script.parentNode) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return null;
}

export default AnalyticsScript;