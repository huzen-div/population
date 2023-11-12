import { createBrowserRouter } from "react-router-dom"
import HomePage from "../pages/homePage"
import MoviePage from "../pages/moviePage"
import CartPage from "../pages/cartPage"
import ErrorPage from "../pages/error-page"

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/movie",
        element: <MoviePage />,
    },
    {
        path: "/cart",
        element: <CartPage />,
    },
])

export default router;