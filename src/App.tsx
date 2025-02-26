import {ThemeProvider} from "@/assets/providers/ThemeProvider.tsx";
import {RouterProvider} from "react-router-dom";
import {appRouter} from "@/AppRouter.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import {SpeedInsights} from "@vercel/speed-insights/react";

function App() {
    return (
        <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
            <RouterProvider router={appRouter} fallbackElement={<ErrorPage/>}/>
            <SpeedInsights />
        </ThemeProvider>
    )
}

export default App
