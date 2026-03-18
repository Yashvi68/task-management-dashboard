import { BrowserRouter } from "react-router-dom"
import { NavBar } from "./components/navbar"
import { SideBar } from "./components/sidebar"
import { MainLayout } from "./pages/main-layout"
import { LoginPage } from "./pages/auth/login"
import { RegisterPage } from "./pages/auth/register"
import ManageTasks from "./pages/users/manage-tasks"

// function App() {

//   return (
//     <>
// {/* <NavBar /> */}
// <BrowserRouter>
// {/* <NavBar /> */}
// {/* <MainLayout /> */}
// {/* <ManageTasks /> */}
// {/* <LoginPage /> */}
// <RegisterPage />
// </BrowserRouter>
//     </>
//   )
// }



import { useMemo } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { filterByRole } from "./utils/filterByRole"
import { Routes } from "./routes"
import { useAuthStore } from "./zustand-store/auth/authStore"
import { Toast } from "./components/toast"

function App() {
    const { userDetails } = useAuthStore()

    const filteredRoutes = useMemo(() => {
        if (userDetails?.role) {
            return filterByRole(Routes, userDetails.role)
        }
        return Routes
    }, [userDetails])

    const router = createBrowserRouter(filteredRoutes)

    return (
        <>
        <RouterProvider router={router} />
        <Toast />
        </>
    )

}

export default App