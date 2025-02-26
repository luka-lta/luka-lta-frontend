import {ThemeProvider} from "@/assets/providers/ThemeProvider.tsx";
import {RouterProvider} from "react-router-dom";
import {appRouter} from "@/AppRouter.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import CustomCursor from "@/components/CustomCursor.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
            <CustomCursor/>
            <RouterProvider router={appRouter} fallbackElement={<ErrorPage/>}/>
        </ThemeProvider>
    )
}

export default App