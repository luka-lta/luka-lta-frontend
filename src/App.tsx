import {ThemeProvider} from "@/assets/providers/ThemeProvider.tsx";
import {RouterProvider} from "react-router-dom";
import {appRouter} from "@/AppRouter.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import {SpeedInsights} from "@vercel/speed-insights/react";
import {Analytics} from "@vercel/analytics/react";

function App() {
    return (
        <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
            <RouterProvider router={appRouter} fallbackElement={<ErrorPage/>}/>
            <SpeedInsights />
            <Analytics />
        </ThemeProvider>
    )
}

export default App
