import {ThemeProvider} from "@/assets/providers/ThemeProvider.tsx";
import {RouterProvider} from "react-router-dom";
import {appRouter} from "@/AppRouter.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import FloatingScrollToTop from "@/components/FloatingScrollToTop.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Suspense} from "react";
import {HelmetProvider} from "react-helmet-async";
import trackspire from "@trackspire/sdk";
import AnalyticsScript from "@/components/analytics-script.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: 1000 * 60 * 5,
        },
    },
});

trackspire.init({
    analyticsHost: import.meta.env.VITE_TRACKSPIRE_HOST,
    siteId: import.meta.env.VITE_SITE_ID,
    debug: true,
    
});

function AppInner() {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<ErrorPage/>}>
                    <FloatingScrollToTop/>
                    <RouterProvider router={appRouter} fallbackElement={<ErrorPage/>}/>
                </Suspense>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

function App() {
    return (
        <HelmetProvider>
            <AppInner />
            <AnalyticsScript />
        </HelmetProvider>
    )
}

export default App