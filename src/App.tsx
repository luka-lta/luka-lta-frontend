import {ThemeProvider} from "@/assets/providers/ThemeProvider.tsx";
import {RouterProvider} from "react-router-dom";
import {appRouter} from "@/AppRouter.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import {SpeedInsights} from "@vercel/speed-insights/react";
import {Analytics} from "@vercel/analytics/react";
import FloatingScrollToTop from "@/components/FloatingScrollToTop.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Suspense, useState} from "react";
import CookieConsent from "@/components/blocks/cookie-consent.tsx";
import AnalyticsScript from "@/components/analytics-script.tsx";
import {HelmetProvider} from "react-helmet-async";
import {useTranslation} from "react-i18next";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 1000 * 60 * 5,
        },
    },
});

// Helper function to check cookie
const getCookieConsent = (): boolean => {
  if (typeof document === 'undefined') return false;
  const cookieValue = document.cookie
        .split('; ')
    .find(row => row.startsWith('cookieConsent='))
    ?.split('=')[1];
  return cookieValue === 'true';
};


function AppInner() {
    const [accepted, setAccepted] = useState(getCookieConsent);
    const { t } = useTranslation();

    return (
        <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<ErrorPage/>}>
                    <FloatingScrollToTop/>
                    <RouterProvider router={appRouter} fallbackElement={<ErrorPage/>}/>
                </Suspense>
            </QueryClientProvider>

            <CookieConsent
                variant="default"
                learnMoreHref='/privacy'
                onAcceptCallback={() => setAccepted(true)}
                onDeclineCallback={() => setAccepted(false)}
                description={t('cookie.description')}
                acceptLabel={t('cookie.accept')}
                declineLabel={t('cookie.decline')}
            />

            {accepted && (
              <>
                  <SpeedInsights/>
                  <Analytics/>
                  <AnalyticsScript />
              </>
            )}
        </ThemeProvider>
    )
}

function App() {
    return (
        <HelmetProvider>
            <AppInner />
        </HelmetProvider>
    )
}

export default App