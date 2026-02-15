import {ThemeProvider} from "@/assets/providers/ThemeProvider.tsx";
import {RouterProvider} from "react-router-dom";
import {appRouter} from "@/AppRouter.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import {SpeedInsights} from "@vercel/speed-insights/react";
import {Analytics} from "@vercel/analytics/react";
import CustomCursor from "@/components/CustomCursor.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Suspense, useState} from "react";
import CookieConsent from "@/components/blocks/cookie-consent.tsx";
import AnalyticsScript from "@/components/analytics-script.tsx";

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


function App() {
    const [accepted, setAccepted] = useState(getCookieConsent);

    return (
        <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<ErrorPage/>}>
                    <CustomCursor/>
                    <RouterProvider router={appRouter} fallbackElement={<ErrorPage/>}/>
                </Suspense>
            </QueryClientProvider>

            <CookieConsent
                variant="default"
                learnMoreHref='/privacy'
                onAcceptCallback={() => setAccepted(true)}
                onDeclineCallback={() => setAccepted(false)}
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

export default App