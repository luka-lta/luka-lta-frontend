import {createBrowserRouter} from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import LinksPage from "@/pages/LinksPage.tsx";
import RedirectPage from "@/pages/RedirectPage.tsx";

export const appRouter = createBrowserRouter([
    {
        id: 'root',
        path: '/',
        element: <LandingPage />,
        errorElement: <ErrorPage />
    },
    {
        path: '/links',
        element: <LinksPage/>,
    },
    {
        path: '/redirect/:clickTag',
        element: <RedirectPage />,
    }
])