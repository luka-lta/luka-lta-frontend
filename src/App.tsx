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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 1000 * 60 * 5,
        },
    },
});

function App() {
    const [accepted, setAccepted] = useState(false);

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
              </>
            )}
        </ThemeProvider>
    )
}

export default App